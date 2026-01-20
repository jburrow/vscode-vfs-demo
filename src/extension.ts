import * as vscode from 'vscode';
import { VirtualFileSystemProvider } from './virtualFileSystemProvider';
import { VirtualFileSearchProvider } from './fileSearchProvider';
import { VirtualTextSearchProvider } from './textSearchProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Virtual File System extension is now active!');

    // Show activation message
    vscode.window.showInformationMessage('Virtual File System extension activated!');

    // Create and register the file system provider
    const vfsProvider = new VirtualFileSystemProvider();
    const registration = vscode.workspace.registerFileSystemProvider('vfs', vfsProvider, {
        isCaseSensitive: true,
        isReadonly: false
    });

    console.log('FileSystemProvider registered for vfs scheme');

    // Create and register the file search provider
    const fileSearchProvider = new VirtualFileSearchProvider(vfsProvider);
    const fileSearchRegistration = vscode.workspace.registerFileSearchProvider('vfs', fileSearchProvider);
    console.log('FileSearchProvider registered for vfs scheme');

    // Create and register the text search provider
    const textSearchProvider = new VirtualTextSearchProvider(vfsProvider);
    const textSearchRegistration = vscode.workspace.registerTextSearchProvider('vfs', textSearchProvider);
    console.log('TextSearchProvider registered for vfs scheme');

    // Register command to mount the virtual file system
    const mountCommand = vscode.commands.registerCommand('vfs.mount', async () => {
        console.log('Mount command executed');
        const uri = vscode.Uri.parse('vfs:/');
        try {
            // Open the virtual file system in the explorer
            await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: false });
            vscode.window.showInformationMessage('Virtual File System mounted successfully!');
        } catch (error) {
            console.error('Failed to mount VFS:', error);
            vscode.window.showErrorMessage(`Failed to mount Virtual File System: ${error}`);
        }
    });

    console.log('Commands and providers registered');
    context.subscriptions.push(
        registration,
        fileSearchRegistration,
        textSearchRegistration,
        mountCommand
    );

    // Auto-mount the virtual file system on activation
    const vfsRoot = vscode.Uri.parse('vfs:/');
    vscode.commands.executeCommand('vscode.openFolder', vfsRoot, { forceNewWindow: false })
        .then(
            () => {
                vscode.window.showInformationMessage('Virtual File System mounted successfully!');
            },
            (error: unknown) => {
                console.error('Failed to auto-mount VFS:', error);
                vscode.window.showErrorMessage(`Failed to mount Virtual File System: ${error}`);
            }
        );
}

export function deactivate() {
    console.log('Virtual File System extension deactivated');
}
