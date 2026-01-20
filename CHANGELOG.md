# Change Log

All notable changes to the "virtual-file-system" extension will be documented in this file.

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
