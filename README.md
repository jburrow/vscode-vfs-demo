# Virtual File System Extension

A VS Code extension that implements a custom FileSystemProvider to create a virtual file system with sample files for demonstration and testing purposes.

## Features

- 🚀 Custom FileSystemProvider implementation
- 📁 In-memory virtual file system
- 📝 10 pre-loaded sample files with different programming languages
- ✏️ Full read/write capabilities
- 🔍 Directory browsing and file operations
- 🎯 Easy mounting via command palette
- 🔎 **File search support** via FileSearchProvider (Quick Open / Ctrl+P)
- 📄 **Text search support** via TextSearchProvider (Search in files)

## Sample Files Included

The extension comes with 10 sample files demonstrating various programming languages and file types:

1. **hello.js** - JavaScript hello world with functions
2. **calculator.py** - Python calculator with mathematical operations
3. **person.ts** - TypeScript class definition with interfaces
4. **styles.css** - CSS styling with modern selectors
5. **index.html** - HTML page with embedded JavaScript
6. **config.json** - JSON configuration file example
7. **README.md** - Markdown documentation
8. **todo.txt** - Plain text file with task list
9. **api.go** - Go REST API server example
10. **sample-package.json** - Node.js package configuration

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Compile the extension:
   ```bash
   pnpm run compile
   ```
4. Press F5 to launch a new VS Code window with the extension loaded
5. To compile a vsix to install
   ```bash
   pnpm run package
   ```

## Usage

### Mounting the Virtual File System

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Mount Virtual File System"
3. Select the command to mount the virtual file system

### Working with Files

Once mounted, you can:
- Browse files in the VS Code Explorer under the `vfs:/` scheme
- Open and edit any of the sample files
- Create new files and directories
- Delete, rename, and move files
- All changes are stored in memory during the session
- **Use Quick Open (Ctrl+P / Cmd+P)** to search for files by name
- **Use Search (Ctrl+Shift+F / Cmd+Shift+F)** to search for text within files

## Development

### Building

```bash
# Install dependencies
pnpm install

# Compile TypeScript
pnpm run compile

# Watch for changes
pnpm run watch

# Lint the code
pnpm run lint
```

### Testing

1. Press `F5` to launch a new Extension Development Host window
2. In the new window, use `Ctrl+Shift+P` and run "Mount Virtual File System"
3. Test file operations in the virtual file system

## Architecture

### Key Components

- **extension.ts**: Main extension entry point, handles activation and command registration
- **virtualFileSystemProvider.ts**: Implementation of VS Code's FileSystemProvider interface
- **fileSearchProvider.ts**: Implementation of FileSearchProvider for Quick Open support
- **textSearchProvider.ts**: Implementation of TextSearchProvider for text search in files
- **package.json**: Extension manifest defining commands, activation events, and metadata

### File System Operations

The extension implements all required FileSystemProvider methods:
- `stat()` - Get file/directory metadata
- `readDirectory()` - List directory contents
- `readFile()` - Read file contents
- `writeFile()` - Write file contents
- `createDirectory()` - Create new directories
- `delete()` - Delete files/directories
- `rename()` - Rename/move files

### Search Operations

The extension implements search providers using provisional APIs:
- **FileSearchProvider** - Enables Quick Open (Ctrl+P) to search for files by name
  - Supports fuzzy matching for flexible file searching
  - Respects include/exclude patterns
  - Configurable maximum results
- **TextSearchProvider** - Enables full-text search (Ctrl+Shift+F) within files
  - Supports regex patterns and case-sensitive search
  - Whole word matching
  - Context lines before/after matches
  - Configurable preview options

## Technical Details

- **Scheme**: `vfs://` - Custom URI scheme for the virtual file system
- **Storage**: In-memory - Files are stored in JavaScript Map objects
- **Events**: Implements VS Code's file change events for real-time updates
- **Error Handling**: Uses VS Code's FileSystemError for proper error reporting
- **Search APIs**: Uses provisional FileSearchProvider and TextSearchProvider APIs
  - Enabled via `enabledApiProposals` in package.json
  - Requires `fileSearchProvider` and `textSearchProvider` proposals

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## VS Code API References

This extension uses the following VS Code APIs:
- FileSystemProvider interface
- workspace.registerFileSystemProvider()
- EventEmitter for file change notifications
- Command registration and execution
- URI handling for custom schemes
- **FileSearchProvider interface (provisional API)**
- **TextSearchProvider interface (provisional API)**
- **workspace.registerFileSearchProvider() (provisional API)**
- **workspace.registerTextSearchProvider() (provisional API)**
