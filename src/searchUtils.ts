/**
 * Shared utility functions for search providers
 */

/**
 * Simple glob pattern matching.
 * Supports * and ** wildcards.
 * 
 * @param path The file path to test
 * @param pattern The glob pattern to match against
 * @returns True if the path matches the pattern
 */
export function matchesGlob(path: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
}

/**
 * Helper to prevent infinite loops when using RegExp.exec with zero-length matches.
 * Advances the lastIndex when a zero-length match is found.
 * 
 * @param match The RegExpExecArray result from exec()
 * @param pattern The RegExp pattern being used
 */
export function advanceRegexOnZeroMatch(match: RegExpExecArray, pattern: RegExp): void {
    if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
    }
}
