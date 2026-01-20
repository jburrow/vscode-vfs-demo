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
    // First escape backslashes to prevent regex injection
    const regexPattern = pattern
        .replace(/\\/g, '\\\\')
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
}

/**
 * Prevents infinite loops when using RegExp.exec with zero-width matches.
 * Zero-width matches (like `^` or `$`) can match at the same position repeatedly.
 * This helper advances the lastIndex when a zero-width match is detected.
 * 
 * @param match The RegExpExecArray result from exec()
 * @param pattern The RegExp pattern being used (will be mutated)
 */
export function preventInfiniteLoop(match: RegExpExecArray, pattern: RegExp): void {
    // If the match has zero width (match.index === pattern.lastIndex),
    // advance lastIndex to prevent matching the same position again
    if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
    }
}
