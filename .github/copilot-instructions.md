<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# VS Code Extension Development Instructions

This is a VS Code extension project that implements a custom FileSystemProvider. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Overview
- This extension creates a virtual file system with sample files
- It implements the VS Code FileSystemProvider interface
- The file system is mounted using the 'vfs:/' scheme
- Sample files include JavaScript, Python, TypeScript, CSS, HTML, JSON, Markdown, Go, and text files

## Key Components
- **extension.ts**: Main extension entry point and activation
- **virtualFileSystemProvider.ts**: Implementation of the FileSystemProvider interface
- **package.json**: Extension manifest with commands and activation events

## Development Guidelines
- Use TypeScript for all code
- Follow VS Code API patterns and best practices
- Implement proper error handling using FileSystemError
- Fire change events when files are modified
- Support both files and directories in the virtual file system

## Testing
- Test file operations (read, write, create, delete, rename)
- Verify directory listing functionality
- Ensure proper error handling for non-existent files
- Test the mount command functionality
