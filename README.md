# Virtual File System Extension

A VS Code extension that implements a custom FileSystemProvider to create a virtual file system with sample files. **Primary use case**: Help extension developers validate that their extensions work correctly with virtual file systems (VFS).

## Why This Extension?

Many VS Code extensions only work with local files. If your extension needs to support VFS (remote development, GitHub Codespaces, virtual workspaces), you can use this extension to:

- Test your extension against a clean VFS implementation
- Validate syntax highlighting, IntelliSense, and other language features work on VFS files  
- Verify your extension handles the `vfs:/` scheme correctly
- Debug issues specific to non-local file systems

## Features

- Custom FileSystemProvider implementation
- In-memory virtual file system with the `vfs:/` scheme
- **31 sample files** covering major programming languages
- Nested directory structure (including a LaTeX paper project)
- Full read/write capabilities
- Directory browsing and file operations
- Easy mounting via command palette
- **File search support** via FileSearchProvider (Quick Open / Ctrl+P) *
- **Text search support** via TextSearchProvider (Search in files) *

\* *Search features require VS Code with proposed API access. When unavailable, the extension works normally but search features are disabled.*

## Requirements

- VS Code 1.108.0 or later
- **For search features**: Requires running VS Code with proposed APIs enabled (use `--enable-proposed-api jburrow.virtual-file-system`)

## Known Limitations

- Files are stored in memory only - all changes are lost when VS Code closes
- Search features (Quick Open / Text Search for `vfs:/` files) require proposed API access and may not be available in standard VS Code installations

## Sample Files Included

Sample files are loaded from the `resources/` folder. Each file contains realistic code examples to test language features.

### Programming Languages
| Language | File | Description |
|----------|------|-------------|
| JavaScript | `hello.js` | Functions, exports |
| TypeScript | `person.ts` | Classes, interfaces |
| Python | `calculator.py` | Functions, docstrings |
| Go | `api.go` | REST API, structs |
| Rust | `example.rs` | Traits, structs, tests |
| C++ | `example.cpp` | Templates, classes, STL |
| C | `example.c` | Structs, pointers, memory |
| Java | `Example.java` | Classes, generics, streams |
| C# | `Example.cs` | Records, LINQ, async |
| Kotlin | `Example.kt` | Data classes, coroutines |
| Swift | `example.swift` | Protocols, enums |
| Ruby | `example.rb` | Classes, blocks, modules |
| PHP | `example.php` | Classes, type hints |

### Scripting & Shell
| Language | File | Description |
|----------|------|-------------|
| Bash | `example.sh` | Functions, arrays |
| PowerShell | `example.ps1` | Cmdlets, pipelines |

### Data & Config Formats
| Format | File | Description |
|--------|------|-------------|
| JSON | `config.json` | Nested objects |
| YAML | `config.yaml` | Full config example |
| TOML | `config.toml` | Tables, arrays |
| XML | `data.xml` | Namespaces, CDATA |
| SQL | `schema.sql` | DDL, queries |

### Web & Markup
| Format | File | Description |
|--------|------|-------------|
| HTML | `index.html` | Document structure |
| CSS | `styles.css` | Selectors, properties |
| Markdown | `README.md` | Documentation |
| LaTeX | `document.tex` | Document structure |

### LaTeX Project (`papers/`)
A multi-file LaTeX project demonstrating includes:
- `papers/main.tex` - Main document with packages  
- `papers/chapters/introduction.tex` - Chapter file
- `papers/chapters/methods.tex` - Equations, algorithms
- `papers/chapters/results.tex` - Tables, figures
- `papers/bib/references.bib` - BibTeX database

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Virtual File System"
4. Click Install

### From VSIX File

1. Download the `.vsix` file from [GitHub Releases](https://github.com/jburrow/vscode-vfs-demo/releases)
2. In VS Code, open Extensions (Ctrl+Shift+X)
3. Click the `...` menu and select "Install from VSIX..."
4. Select the downloaded file

### From Source (Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/jburrow/vscode-vfs-demo.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Compile the extension:
   ```bash
   pnpm run compile
   ```
4. Press F5 to launch a new VS Code window with the extension loaded

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

### Adding VFS to a Multi-Root Workspace

To test your extension against VFS alongside your existing project, add VFS as an additional folder in your `.code-workspace` file:

```json
{
    "folders": [
        {
            "path": "."
        },
        {
            "uri": "vfs:/",
            "name": "Virtual File System"
        }
    ],
    "settings": {}
}
```

This allows you to:
- See both your local files and VFS files in the Explorer
- Test how your extension handles mixed local/virtual workspaces
- Validate workspace-wide features (search, find references, etc.) across VFS

**Note**: The VFS folder uses `"uri"` instead of `"path"` since it's a virtual file system, not a local directory.

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
- **searchUtils.ts**: Shared utilities for pattern matching and search filtering
- **resources/manifest.json**: Defines which sample files to load into the VFS
- **resources/samples/**: Sample files for various programming languages

### Adding New Sample Files

To add a new sample file:
1. Create the file in `resources/samples/`
2. Add an entry to `resources/manifest.json`:
   ```json
   { "vfsPath": "/example.xyz", "resourcePath": "samples/example.xyz" }
   ```
3. Rebuild the extension

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

- **Scheme**: `vfs` - Custom URI scheme for the virtual file system (root URI is `vfs:/`)
- **Storage**: In-memory - Files are stored in JavaScript Map objects
- **Events**: Implements VS Code's file change events for real-time updates
- **Error Handling**: Uses VS Code's FileSystemError for proper error reporting
- **Search APIs**: Uses provisional FileSearchProvider and TextSearchProvider APIs
  - Enabled via `enabledApiProposals` in package.json (development only)
  - Marketplace builds have these removed for compatibility
  - Extension gracefully degrades when APIs are unavailable

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
- `FileSystemProvider` interface
- `workspace.registerFileSystemProvider()`
- `workspace.registerFileSearchProvider()` (proposed API)
- `workspace.registerTextSearchProvider()` (proposed API)
- `EventEmitter` for file change notifications
- Command registration and execution
- URI handling for custom schemes
- **FileSearchProvider interface (provisional API)**
- **TextSearchProvider interface (provisional API)**
- **workspace.registerFileSearchProvider() (provisional API)**
- **workspace.registerTextSearchProvider() (provisional API)**
