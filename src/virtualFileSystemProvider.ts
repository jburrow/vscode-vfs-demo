import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface ManifestEntry {
    vfsPath: string;
    resourcePath: string;
}

interface Manifest {
    description: string;
    files: ManifestEntry[];
}

export class VirtualFileSystemProvider implements vscode.FileSystemProvider {
    private _onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    readonly onDidChangeFile = this._onDidChangeFile.event;

    // Make files and directories accessible for search providers
    public readonly files = new Map<string, Uint8Array>();
    public readonly directories = new Set<string>();

    private extensionPath: string;

    constructor(extensionUri: vscode.Uri) {
        this.extensionPath = extensionUri.fsPath;
        this.initializeSampleFiles();
    }

    private initializeSampleFiles() {
        // Create root directory
        this.directories.add('/');

        // Load manifest
        const manifestPath = path.join(this.extensionPath, 'resources', 'manifest.json');
        
        if (!fs.existsSync(manifestPath)) {
            console.warn('VFS: manifest.json not found, starting with empty file system');
            return;
        }

        try {
            const manifestContent = fs.readFileSync(manifestPath, 'utf8');
            const manifest: Manifest = JSON.parse(manifestContent);

            // Load each file from the manifest
            for (const entry of manifest.files) {
                const resourceFullPath = path.join(this.extensionPath, 'resources', entry.resourcePath);
                
                if (!fs.existsSync(resourceFullPath)) {
                    console.warn(`VFS: Resource not found: ${entry.resourcePath}`);
                    continue;
                }

                // Read file content
                const content = fs.readFileSync(resourceFullPath);
                
                // Ensure parent directories exist
                this.ensureParentDirectories(entry.vfsPath);
                
                // Add file to VFS
                this.files.set(entry.vfsPath, content);
            }

            console.log(`VFS: Loaded ${this.files.size} files from resources`);
        } catch (error) {
            console.error('VFS: Failed to load manifest:', error);
        }
    }

    private ensureParentDirectories(filePath: string): void {
        const parts = filePath.split('/').filter(p => p.length > 0);
        let currentPath = '';
        
        // Create all parent directories (excluding the file itself)
        for (let i = 0; i < parts.length - 1; i++) {
            currentPath += '/' + parts[i];
            if (!this.directories.has(currentPath)) {
                this.directories.add(currentPath);
            }
        }
    }

    watch(uri: vscode.Uri): vscode.Disposable {
        // For simplicity, we don't implement actual file watching
        return new vscode.Disposable(() => { });
    }

    stat(uri: vscode.Uri): vscode.FileStat {
        const uriPath = uri.path;

        if (this.directories.has(uriPath)) {
            return {
                type: vscode.FileType.Directory,
                ctime: Date.now(),
                mtime: Date.now(),
                size: 0
            };
        }

        if (this.files.has(uriPath)) {
            const content = this.files.get(uriPath)!;
            return {
                type: vscode.FileType.File,
                ctime: Date.now(),
                mtime: Date.now(),
                size: content.length
            };
        }

        throw vscode.FileSystemError.FileNotFound(uri);
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
        const uriPath = uri.path;

        if (!this.directories.has(uriPath)) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        const entries: [string, vscode.FileType][] = [];

        // Add files in this directory
        for (const filePath of this.files.keys()) {
            if (this.isDirectChild(uriPath, filePath)) {
                const fileName = this.getFileName(filePath);
                entries.push([fileName, vscode.FileType.File]);
            }
        }

        // Add subdirectories
        for (const dirPath of this.directories) {
            if (this.isDirectChild(uriPath, dirPath) && dirPath !== uriPath) {
                const dirName = this.getFileName(dirPath);
                entries.push([dirName, vscode.FileType.Directory]);
            }
        }

        return entries;
    }

    private isDirectChild(parentPath: string, childPath: string): boolean {
        if (parentPath === '/') {
            return childPath.startsWith('/') && childPath.indexOf('/', 1) === -1 && childPath !== '/';
        }

        if (!childPath.startsWith(parentPath + '/')) {
            return false;
        }

        const relativePath = childPath.substring(parentPath.length + 1);
        return relativePath.indexOf('/') === -1;
    }

    private getFileName(filePath: string): string {
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    }

    createDirectory(uri: vscode.Uri): void {
        const uriPath = uri.path;

        if (this.directories.has(uriPath) || this.files.has(uriPath)) {
            throw vscode.FileSystemError.FileExists(uri);
        }

        this.directories.add(uriPath);
        this._onDidChangeFile.fire([{
            type: vscode.FileChangeType.Created,
            uri
        }]);
    }

    readFile(uri: vscode.Uri): Uint8Array {
        const uriPath = uri.path;
        const content = this.files.get(uriPath);

        if (!content) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        return content;
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean }): void {
        const uriPath = uri.path;
        const exists = this.files.has(uriPath);

        if (exists && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(uri);
        }

        if (!exists && !options.create) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        this.files.set(uriPath, content);

        const changeType = exists ? vscode.FileChangeType.Changed : vscode.FileChangeType.Created;
        this._onDidChangeFile.fire([{
            type: changeType,
            uri
        }]);
    }

    delete(uri: vscode.Uri, options: { recursive: boolean }): void {
        const uriPath = uri.path;

        if (this.files.has(uriPath)) {
            this.files.delete(uriPath);
        } else if (this.directories.has(uriPath)) {
            if (options.recursive) {
                // Delete all files and subdirectories
                const toDelete: string[] = [];
                for (const filePath of this.files.keys()) {
                    if (filePath.startsWith(uriPath + '/')) {
                        toDelete.push(filePath);
                    }
                }
                for (const filePath of toDelete) {
                    this.files.delete(filePath);
                }

                const dirsToDelete: string[] = [];
                for (const dirPath of this.directories) {
                    if (dirPath.startsWith(uriPath + '/')) {
                        dirsToDelete.push(dirPath);
                    }
                }
                for (const dirPath of dirsToDelete) {
                    this.directories.delete(dirPath);
                }
            }
            this.directories.delete(uriPath);
        } else {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        this._onDidChangeFile.fire([{
            type: vscode.FileChangeType.Deleted,
            uri
        }]);
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {
        const oldPath = oldUri.path;
        const newPath = newUri.path;

        if (this.files.has(oldPath)) {
            const content = this.files.get(oldPath)!;

            if (this.files.has(newPath) && !options.overwrite) {
                throw vscode.FileSystemError.FileExists(newUri);
            }

            this.files.set(newPath, content);
            this.files.delete(oldPath);

            this._onDidChangeFile.fire([
                { type: vscode.FileChangeType.Deleted, uri: oldUri },
                { type: vscode.FileChangeType.Created, uri: newUri }
            ]);
        } else {
            throw vscode.FileSystemError.FileNotFound(oldUri);
        }
    }
}
