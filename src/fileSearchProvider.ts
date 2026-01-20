import * as vscode from 'vscode';

/**
 * Implements FileSearchProvider for the virtual file system.
 * This provider enables Quick Open (Ctrl+P) and workspace.findFiles to search for files.
 */
export class VirtualFileSearchProvider implements vscode.FileSearchProvider {
    constructor(private fileSystemProvider: { files: Map<string, Uint8Array>; directories: Set<string> }) {}

    /**
     * Provide file search results for files matching the query pattern.
     * @param query The search query containing the pattern to match
     * @param options Search options including folder, includes, excludes
     * @param token Cancellation token
     */
    provideFileSearchResults(
        query: vscode.FileSearchQuery,
        options: vscode.FileSearchOptions,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Uri[]> {
        const results: vscode.Uri[] = [];
        const pattern = query.pattern.toLowerCase();

        // Check for cancellation
        if (token.isCancellationRequested) {
            return results;
        }

        // Get all files from the virtual file system
        const files = Array.from(this.fileSystemProvider.files.keys());

        // Filter files based on the search pattern
        for (const filePath of files) {
            if (token.isCancellationRequested) {
                break;
            }

            // Check if file matches the pattern
            if (this.matchesPattern(filePath, pattern)) {
                // Check if file should be included based on options
                if (this.shouldIncludeFile(filePath, options)) {
                    results.push(vscode.Uri.parse(`vfs:${filePath}`));

                    // Check if we've reached the maximum results
                    if (options.maxResults && results.length >= options.maxResults) {
                        break;
                    }
                }
            }
        }

        console.log(`FileSearchProvider: Found ${results.length} files matching "${query.pattern}"`);
        return results;
    }

    /**
     * Check if a file path matches the search pattern.
     * Implements fuzzy matching similar to VS Code's Quick Open.
     */
    private matchesPattern(filePath: string, pattern: string): boolean {
        // If pattern is empty, match all files
        if (!pattern) {
            return true;
        }

        const filePathLower = filePath.toLowerCase();
        const fileName = filePath.split('/').pop()?.toLowerCase() || '';

        // Direct substring match in file name or path
        if (fileName.includes(pattern) || filePathLower.includes(pattern)) {
            return true;
        }

        // Fuzzy match: check if pattern characters appear in order
        let patternIndex = 0;
        for (let i = 0; i < fileName.length && patternIndex < pattern.length; i++) {
            if (fileName[i] === pattern[patternIndex]) {
                patternIndex++;
            }
        }

        return patternIndex === pattern.length;
    }

    /**
     * Check if a file should be included based on the search options.
     */
    private shouldIncludeFile(filePath: string, options: vscode.FileSearchOptions): boolean {
        // Check if file is within the specified folder
        const folderPath = options.folder.path;
        if (!filePath.startsWith(folderPath) && folderPath !== '/') {
            return false;
        }

        // Check excludes patterns
        if (options.excludes && options.excludes.length > 0) {
            for (const excludePattern of options.excludes) {
                if (this.matchesGlob(filePath, excludePattern)) {
                    return false;
                }
            }
        }

        // Check includes patterns (if specified, file must match at least one)
        if (options.includes && options.includes.length > 0) {
            let matchesInclude = false;
            for (const includePattern of options.includes) {
                if (this.matchesGlob(filePath, includePattern)) {
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

    /**
     * Simple glob pattern matching.
     * Supports * and ** wildcards.
     */
    private matchesGlob(path: string, pattern: string): boolean {
        // Convert glob pattern to regex
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\?/g, '.');

        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(path);
    }
}
