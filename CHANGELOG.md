# Change Log

All notable changes to the "virtual-file-system" extension will be documented in this file.

## [0.0.2] - 2026-03-06

### Added
- File search provider for Quick Open (Ctrl+P) support
- Text search provider for Search in Files (Ctrl+Shift+F) support
- Graceful degradation when proposed APIs are unavailable

### Changed
- Extension now works in standard VS Code (search features require proposed API access)
- Improved activation events for better performance

## [0.0.1] - 2025-07-14

### Added
- Initial release of Virtual File System extension
- FileSystemProvider implementation with custom `vfs` scheme
- 10 sample files with different programming languages:
  - JavaScript (hello.js)
  - Python (calculator.py)
  - TypeScript (person.ts)
  - CSS (styles.css)
  - HTML (index.html)
  - JSON (config.json)
  - Markdown (README.md)
  - Text (todo.txt)
  - Go (api.go)
  - Package.json (sample-package.json)
- Mount command for virtual file system
- Full CRUD operations (Create, Read, Update, Delete)
- File and directory operations
- In-memory storage
- Real-time file change events

### Features
- Browse virtual files in VS Code Explorer
- Edit files with full VS Code features (syntax highlighting, IntelliSense)
- Create, delete, rename files and directories
- All changes stored in memory during session
