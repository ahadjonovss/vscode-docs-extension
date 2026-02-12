import * as vscode from 'vscode';
import { DocumentationPanelManager } from './DocumentationPanelManager';
import { MappingManager } from './MappingManager';

/**
 * Extension activation entry point
 * Called when VS Code starts up (onStartupFinished)
 *
 * Architecture:
 * - Single instance of DocumentationPanelManager to handle all webview panels
 * - Listens to active editor changes to update docs panel dynamically
 * - Command registered for the book icon in editor title bar
 * - File system watcher to track file renames and deletions
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Docky - Documentation Companion is now active');

    // Create the documentation panel manager
    const panelManager = new DocumentationPanelManager(context);

    // Create mapping manager for file tracking
    const mappingManager = new MappingManager();

    // Register command for opening documentation
    const openDocsCommand = vscode.commands.registerCommand(
        'docky.openDocumentation',
        async () => {
            console.log('🔍 Docky: openDocumentation command triggered');
            const editor = vscode.window.activeTextEditor;
            console.log('🔍 Docky: Active editor:', editor ? editor.document.uri.toString() : 'none');

            if (!editor) {
                vscode.window.showWarningMessage('No active file to show documentation for');
                return;
            }

            // Check if it's a valid file (not output, debug, etc.)
            if (editor.document.uri.scheme !== 'file') {
                vscode.window.showWarningMessage('Documentation only works with file:// URIs');
                return;
            }

            await panelManager.showDocumentation(editor.document.uri.fsPath);
        }
    );

    // Listen for active editor changes to update docs panel automatically
    const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(
        async (editor) => {
            if (editor && panelManager.isPanelActive()) {
                await panelManager.updateDocumentation(editor.document.uri.fsPath);
            }
        }
    );

    // Watch for file renames and deletions to update mappings
    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');

    // Handle file renames
    const onFileRename = vscode.workspace.onDidRenameFiles((event) => {
        for (const file of event.files) {
            const oldPath = file.oldUri.fsPath;
            const newPath = file.newUri.fsPath;

            // Only track source files (not docs files)
            if (!oldPath.includes('docky/') && !newPath.includes('docky/')) {
                mappingManager.updateMappingOnFileRename(oldPath, newPath);

                // If panel is showing this file, update it
                if (panelManager.isPanelActive()) {
                    const editor = vscode.window.activeTextEditor;
                    if (editor && editor.document.uri.fsPath === newPath) {
                        panelManager.updateDocumentation(newPath);
                    }
                }
            }
        }
    });

    // Handle file deletions
    const onFileDelete = fileWatcher.onDidDelete((uri) => {
        const filePath = uri.fsPath;

        // Only track source files (not docs files)
        if (!filePath.includes('docky/')) {
            mappingManager.removeMappingOnFileDelete(filePath);
        }
    });

    // Register disposables
    context.subscriptions.push(
        openDocsCommand,
        editorChangeListener,
        fileWatcher,
        onFileRename,
        onFileDelete,
        panelManager
    );
}

/**
 * Extension deactivation
 * Called when VS Code is shut down or extension is disabled
 */
export function deactivate() {
    console.log('Docky extension deactivated');
}
