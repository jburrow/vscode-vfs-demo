import * as vscode from 'vscode';
import { matchesGlob, advanceRegexOnZeroMatch } from './searchUtils';

/**
 * Implements TextSearchProvider for the virtual file system.
 * This provider enables searching for text content within files.
 */
export class VirtualTextSearchProvider implements vscode.TextSearchProvider {
    constructor(private fileSystemProvider: { files: Map<string, Uint8Array> }) {}

    /**
     * Provide text search results for files containing the search pattern.
     * @param query The search query with pattern and options
     * @param options Search options including folder, includes, excludes
     * @param progress Progress callback to report results incrementally
     * @param token Cancellation token
     */
    provideTextSearchResults(
        query: vscode.TextSearchQuery,
        options: vscode.TextSearchOptions,
        progress: vscode.Progress<vscode.TextSearchResult>,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TextSearchComplete> {
        let resultCount = 0;
        const maxResults = options.maxResults;

        // Check for cancellation
        if (token.isCancellationRequested) {
            return { limitHit: false };
        }

        // Get all files from the virtual file system
        const files = Array.from(this.fileSystemProvider.files.entries());

        // Search through each file
        for (const [filePath, content] of files) {
            if (token.isCancellationRequested) {
                break;
            }

            // Check if file should be searched based on options
            if (!this.shouldSearchFile(filePath, options)) {
                continue;
            }

            // Convert content to string
            const text = Buffer.from(content).toString('utf8');
            
            // Check file size limit
            if (options.maxFileSize && content.length > options.maxFileSize) {
                continue;
            }

            // Search for matches in the file
            const fileResults = this.searchInFile(
                filePath,
                text,
                query,
                options,
                progress
            );

            resultCount += fileResults;

            // Check if we've hit the max results
            if (maxResults && resultCount >= maxResults) {
                console.log(`TextSearchProvider: Hit max results limit (${maxResults})`);
                return { limitHit: true };
            }
        }

        console.log(`TextSearchProvider: Found ${resultCount} matches for "${query.pattern}"`);
        return { limitHit: false };
    }

    /**
     * Search for matches within a single file.
     */
    private searchInFile(
        filePath: string,
        text: string,
        query: vscode.TextSearchQuery,
        options: vscode.TextSearchOptions,
        progress: vscode.Progress<vscode.TextSearchResult>
    ): number {
        const lines = text.split('\n');
        const uri = vscode.Uri.parse(`vfs:${filePath}`);
        let matchCount = 0;

        // Create regex pattern based on query
        const pattern = this.createSearchPattern(query);
        if (!pattern) {
            return 0;
        }

        // Search through each line
        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            const line = lines[lineNumber];
            const matches: vscode.Range[] = [];

            // Find all matches in this line
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(line)) !== null) {
                const startChar = match.index;
                const endChar = startChar + match[0].length;
                matches.push(new vscode.Range(lineNumber, startChar, lineNumber, endChar));

                // Prevent infinite loop on zero-length matches
                advanceRegexOnZeroMatch(match, pattern);
            }

            // Report matches for this line
            if (matches.length > 0) {
                // Add context lines before if requested
                if (options.beforeContext && options.beforeContext > 0) {
                    const startLine = Math.max(0, lineNumber - options.beforeContext);
                    for (let i = startLine; i < lineNumber; i++) {
                        progress.report({
                            uri,
                            text: lines[i],
                            lineNumber: i
                        });
                    }
                }

                // Report the match with preview
                const previewText = this.getPreviewText(line, matches, options);
                progress.report({
                    uri,
                    ranges: matches.length === 1 ? matches[0] : matches,
                    preview: {
                        text: previewText,
                        matches: this.adjustMatchRanges(matches, previewText, line)
                    }
                });

                matchCount += matches.length;

                // Add context lines after if requested
                if (options.afterContext && options.afterContext > 0) {
                    const endLine = Math.min(lines.length, lineNumber + options.afterContext + 1);
                    for (let i = lineNumber + 1; i < endLine; i++) {
                        progress.report({
                            uri,
                            text: lines[i],
                            lineNumber: i
                        });
                    }
                }
            }
        }

        return matchCount;
    }

    /**
     * Create a regex pattern from the search query.
     */
    private createSearchPattern(query: vscode.TextSearchQuery): RegExp | null {
        try {
            let pattern = query.pattern;

            // Escape regex special characters if not using regex mode
            if (!query.isRegExp) {
                pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }

            // Build regex flags
            let flags = 'g'; // Always use global flag
            if (!query.isCaseSensitive) {
                flags += 'i';
            }
            if (query.isMultiline) {
                flags += 'm';
            }

            // Add word boundary if whole word match is requested
            if (query.isWordMatch && !query.isRegExp) {
                pattern = `\\b${pattern}\\b`;
            }

            return new RegExp(pattern, flags);
        } catch (error) {
            console.error('TextSearchProvider: Invalid regex pattern:', error);
            return null;
        }
    }

    /**
     * Get preview text for a match, respecting preview options.
     */
    private getPreviewText(line: string, matches: vscode.Range[], options: vscode.TextSearchOptions): string {
        if (!options.previewOptions) {
            return line;
        }

        const charsPerLine = options.previewOptions.charsPerLine;
        if (!charsPerLine || line.length <= charsPerLine) {
            return line;
        }

        // Find the first match position
        const firstMatch = matches[0];
        const matchStart = firstMatch.start.character;

        // Try to center the match in the preview
        const halfChars = Math.floor(charsPerLine / 2);
        let previewStart = Math.max(0, matchStart - halfChars);
        let previewEnd = Math.min(line.length, previewStart + charsPerLine);

        // Adjust if we're at the end of the line
        if (previewEnd === line.length) {
            previewStart = Math.max(0, previewEnd - charsPerLine);
        }

        return line.substring(previewStart, previewEnd);
    }

    /**
     * Adjust match ranges to be relative to the preview text.
     */
    private adjustMatchRanges(
        matches: vscode.Range[],
        previewText: string,
        originalLine: string
    ): vscode.Range | vscode.Range[] {
        const offset = originalLine.indexOf(previewText);
        const adjustedMatches = matches.map(range => {
            const newStart = Math.max(0, range.start.character - offset);
            const newEnd = Math.min(previewText.length, range.end.character - offset);
            return new vscode.Range(0, newStart, 0, newEnd);
        });

        return adjustedMatches.length === 1 ? adjustedMatches[0] : adjustedMatches;
    }

    /**
     * Check if a file should be searched based on the search options.
     */
    private shouldSearchFile(filePath: string, options: vscode.TextSearchOptions): boolean {
        // Check if file is within the specified folder
        const folderPath = options.folder.path;
        if (!filePath.startsWith(folderPath) && folderPath !== '/') {
            return false;
        }

        // Check excludes patterns
        if (options.excludes && options.excludes.length > 0) {
            for (const excludePattern of options.excludes) {
                if (matchesGlob(filePath, excludePattern)) {
                    return false;
                }
            }
        }

        // Check includes patterns (if specified, file must match at least one)
        if (options.includes && options.includes.length > 0) {
            let matchesInclude = false;
            for (const includePattern of options.includes) {
                if (matchesGlob(filePath, includePattern)) {
                    matchesInclude = true;
                    break;
                }
            }
            if (!matchesInclude) {
                return false;
            }
        }

        return true;
    }
}
