import * as vscode from 'vscode';
import { DocumentationPanelManager } from './DocumentationPanelManager';

/**
 * Extension activation entry point
 * Called when VS Code starts up (onStartupFinished)
 *
 * Architecture:
 * - Single instance of DocumentationPanelManager to handle all webview panels
 * - Listens to active editor changes to update docs panel dynamically
 * - Command registered for the book icon in editor title bar
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Inline Documentation Viewer extension is now active');

    // Create the documentation panel manager
    const panelManager = new DocumentationPanelManager(context);

    // Register command for opening documentation
    const openDocsCommand = vscode.commands.registerCommand(
        'inlineDocs.openDocumentation',
        async () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showWarningMessage('No active file to show documentation for');
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

    // Register disposables
    context.subscriptions.push(
        openDocsCommand,
        editorChangeListener,
        panelManager
    );
}

/**
 * Extension deactivation
 * Called when VS Code is shut down or extension is disabled
 */
export function deactivate() {
    console.log('Inline Documentation Viewer extension deactivated');
}
