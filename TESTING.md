# Testing the Search Providers

This document describes how to manually test the FileSearchProvider and TextSearchProvider implementations.

## Prerequisites

1. Compile the extension: `npm run compile`
2. Press F5 in VS Code to launch the Extension Development Host
3. In the new window, open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
4. Run the command "Mount Virtual File System"

## Testing FileSearchProvider (Quick Open)

The FileSearchProvider enables file searching via Quick Open.

### Test 1: Basic File Search
1. Press Ctrl+P (Cmd+P on Mac) to open Quick Open
2. Type "hello" - should show `/hello.js`
3. Type "calc" - should show `/calculator.py`
4. Type "person" - should show `/person.ts`

### Test 2: Fuzzy Matching
1. Press Ctrl+P
2. Type "hjs" - should show `/hello.js` (fuzzy match: **h**ello.**js**)
3. Type "api" - should show `/api.go`
4. Type "pkg" - should show `/sample-package.json`

### Test 3: File Extension Search
1. Press Ctrl+P
2. Type ".js" - should show JavaScript files
3. Type ".py" - should show Python files
4. Type ".ts" - should show TypeScript files

### Test 4: Empty Search
1. Press Ctrl+P
2. Leave the search box empty - should show all files in the virtual file system

## Testing TextSearchProvider (Search in Files)

The TextSearchProvider enables full-text content searching.

### Test 1: Basic Text Search
1. Press Ctrl+Shift+F (Cmd+Shift+F on Mac) to open Search
2. Enter "function" in the search box
3. Should find matches in:
   - `/hello.js` (function greet)
   - `/calculator.py` (multiple function definitions)
   - `/index.html` (function greetUser)

### Test 2: Case-Sensitive Search
1. Press Ctrl+Shift+F
2. Enter "Hello" with case sensitivity enabled (click the Aa button)
3. Should find matches only with exact case in:
   - `/hello.js`
   - `/index.html`
   - `/README.md`

### Test 3: Regex Search
1. Press Ctrl+Shift+F
2. Enable regex mode (click the .* button)
3. Enter `function\s+\w+\(` to search for function declarations
4. Should find function definitions in JavaScript and Python files

### Test 4: Whole Word Search
1. Press Ctrl+Shift+F
2. Enable whole word search (click the Ab button)
3. Enter "add" - should only match the word "add", not "added" or "addition"
4. Should find matches in:
   - `/calculator.py` (def add function)

### Test 5: Search in Specific File Types
1. Press Ctrl+Shift+F
2. Enter search text: "import"
3. Add file pattern: `**/*.py` or `**/*.go`
4. Should only search in Python or Go files

## Testing workspace.findFiles

The FileSearchProvider is also used by the `workspace.findFiles` API.

### Test via Command Palette
1. Open Command Palette (Ctrl+Shift+P)
2. Run "Developer: Show Running Extensions"
3. In the Extensions Host window console, you should see log messages:
   - "FileSearchProvider registered for vfs:// scheme"
   - "TextSearchProvider registered for vfs:// scheme"

## Expected Console Output

When using the search providers, you should see console output in the Extension Development Host:

```
FileSearchProvider: Found N files matching "pattern"
TextSearchProvider: Found N matches for "pattern"
```

## Troubleshooting

### Search providers not working
- Check that the extension activated successfully
- Verify console logs show provider registration
- Ensure the virtual file system is mounted (vfs:/ scheme)
- Check that provisional APIs are enabled in package.json

### No results returned
- Verify the virtual file system has files loaded
- Check the search pattern syntax
- Ensure include/exclude patterns are correct

### Compilation errors
- Run `npm run compile` to check for TypeScript errors
- Run `npm run lint` to check for linting issues
- Verify all imports are correct

## Performance Testing

### File Search Performance
- The provider should return results quickly even with fuzzy matching
- Results should appear as you type in Quick Open
- Cancellation should work properly when typing quickly

### Text Search Performance
- Search should be reasonably fast for the 10 sample files
- Progress should be reported incrementally
- Cancellation should work when stopping a search

## API Compliance

The implementations follow the VS Code provisional API specifications:

- **FileSearchProvider**: https://github.com/microsoft/vscode/issues/73524
- **TextSearchProvider**: https://github.com/microsoft/vscode/issues/59921

Both providers:
- Respect cancellation tokens
- Handle include/exclude patterns
- Support maxResults limits
- Return proper result types
