import * as vscode from 'vscode';
import { VirtualFileSystemProvider } from './virtualFileSystemProvider';

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

    console.log('FileSystemProvider registered for vfs:// scheme');

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
    context.subscriptions.push(registration, mountCommand);
}

export function deactivate() {
    console.log('Virtual File System extension deactivated');
}
