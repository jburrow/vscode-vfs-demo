# Virtual File System Demo

This is a demonstration of a virtual file system implemented as a VS Code extension.

## Features

- ✅ Custom FileSystemProvider implementation
- ✅ In-memory file storage
- ✅ Sample files with different programming languages
- ✅ Read/Write operations
- ✅ Directory structure support

## Sample Files Included

This extension includes sample files in many programming languages to help extension
developers validate their VFS support.

## Usage

1. Mount the virtual file system using the command palette
2. Browse files in the explorer
3. Edit files directly in VS Code
4. Changes are stored in memory

## Technical Details

The file system uses the VS Code FileSystemProvider API to create a virtual file system that exists entirely in memory.
