import * as vscode from 'vscode';
import { VirtualFileSystemProvider } from './virtualFileSystemProvider';
import { VirtualFileSearchProvider } from './fileSearchProvider';
import { VirtualTextSearchProvider } from './textSearchProvider';

/**
 * Check if a proposed API is available by testing if the function exists on the namespace.
 */
function hasProposedApi(apiName: 'registerFileSearchProvider' | 'registerTextSearchProvider'): boolean {
    return typeof (vscode.workspace as unknown as Record<string, unknown>)[apiName] === 'function';
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Virtual File System extension is now active!');

    // Show activation message
    vscode.window.showInformationMessage('Virtual File System extension activated!');

    // Create and register the file system provider
    const vfsProvider = new VirtualFileSystemProvider(context.extensionUri);
    const registration = vscode.workspace.registerFileSystemProvider('vfs', vfsProvider, {
        isCaseSensitive: true,
        isReadonly: false
    });

    console.log('FileSystemProvider registered for vfs scheme');

    // Track which proposed APIs are available
    const unavailableApis: string[] = [];

    // Create and register the file search provider (proposed API)
    if (hasProposedApi('registerFileSearchProvider')) {
        const fileSearchProvider = new VirtualFileSearchProvider(vfsProvider);
        const fileSearchRegistration = vscode.workspace.registerFileSearchProvider('vfs', fileSearchProvider);
        context.subscriptions.push(fileSearchRegistration);
        console.log('FileSearchProvider registered for vfs scheme');
    } else {
        unavailableApis.push('File Search (Quick Open)');
        console.warn('FileSearchProvider API not available - Quick Open integration disabled');
    }

    // Create and register the text search provider (proposed API)
    if (hasProposedApi('registerTextSearchProvider')) {
        const textSearchProvider = new VirtualTextSearchProvider(vfsProvider);
        const textSearchRegistration = vscode.workspace.registerTextSearchProvider('vfs', textSearchProvider);
        context.subscriptions.push(textSearchRegistration);
        console.log('TextSearchProvider registered for vfs scheme');
    } else {
        unavailableApis.push('Text Search');
        console.warn('TextSearchProvider API not available - Search integration disabled');
    }

    // Notify user if running in degraded mode
    if (unavailableApis.length > 0) {
        vscode.window.showWarningMessage(
            `VFS: Some features unavailable (proposed APIs not enabled): ${unavailableApis.join(', ')}. ` +
            `The file system will still work, but search features require proposed API access.`
        );
    }

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
