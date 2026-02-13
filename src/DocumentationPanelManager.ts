import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import MarkdownIt from 'markdown-it';
import { DocsFileHelper } from './DocsFileHelper';
import { BreadcrumbBuilder } from './BreadcrumbBuilder';
import { FileWatcher } from './FileWatcher';

/**
 * Manages the documentation webview panel
 * Ensures only one panel exists at a time and handles all panel operations
 *
 * Key responsibilities:
 * - Create and manage webview panel lifecycle
 * - Update panel content when switching files
 * - Handle breadcrumb navigation clicks
 * - Auto-refresh when docs file changes
 */
export class DocumentationPanelManager implements vscode.Disposable {
    private panel: vscode.WebviewPanel | undefined;
    private readonly context: vscode.ExtensionContext;
    private readonly md: MarkdownIt;
    private readonly docsHelper: DocsFileHelper;
    private readonly breadcrumbBuilder: BreadcrumbBuilder;
    private readonly fileWatcher: FileWatcher;
    private currentSourceFile: string | undefined;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true
        });
        this.docsHelper = new DocsFileHelper();
        this.breadcrumbBuilder = new BreadcrumbBuilder();
        this.fileWatcher = new FileWatcher();
    }

    /**
     * Shows documentation for the specified source file
     * Creates panel if it doesn't exist, reveals it if it does
     */
    public async showDocumentation(sourceFilePath: string): Promise<void> {
        // Ensure .docky.json exists
        this.docsHelper.getMappingManager().ensureConfigExists();

        const docsPath = this.docsHelper.getDocsFilePath(sourceFilePath);

        if (this.panel) {
            // Panel exists, just reveal and update content
            this.panel.reveal(vscode.ViewColumn.Beside);
            await this.updateContent(sourceFilePath, docsPath);
        } else {
            // Create new panel
            this.createPanel(sourceFilePath, docsPath);
        }

        // Watch the docs file for changes (if it exists and docsPath is defined)
        if (docsPath && fs.existsSync(docsPath)) {
            this.fileWatcher.watchFile(docsPath, () => {
                if (this.panel && this.currentSourceFile) {
                    const dp = this.docsHelper.getDocsFilePath(this.currentSourceFile);
                    if (dp) {
                        this.updateContent(this.currentSourceFile, dp);
                    }
                }
            });
        }
    }

    /**
     * Updates documentation when active file changes
     */
    public async updateDocumentation(sourceFilePath: string): Promise<void> {
        if (!this.panel) {
            return;
        }

        const docsPath = this.docsHelper.getDocsFilePath(sourceFilePath);
        await this.updateContent(sourceFilePath, docsPath);

        // Update file watcher (if docs file exists)
        if (docsPath && fs.existsSync(docsPath)) {
            this.fileWatcher.watchFile(docsPath, () => {
                if (this.panel && this.currentSourceFile) {
                    const dp = this.docsHelper.getDocsFilePath(this.currentSourceFile);
                    if (dp) {
                        this.updateContent(this.currentSourceFile, dp);
                    }
                }
            });
        }
    }

    /**
     * Checks if panel is currently active
     */
    public isPanelActive(): boolean {
        return this.panel !== undefined;
    }

    /**
     * Creates the webview panel
     */
    private createPanel(sourceFilePath: string, docsPath: string | undefined): void {
        this.panel = vscode.window.createWebviewPanel(
            'inlineDocsViewer',
            'Documentation',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: []
            }
        );

        // Handle messages from webview (breadcrumb clicks, create docs, and external links)
        this.panel.webview.onDidReceiveMessage(
            async (message) => {
                if (message.command === 'navigateToModule') {
                    await this.navigateToModuleDocs(message.folderPath);
                } else if (message.command === 'createDocs') {
                    await this.createAndOpenDocsFile(message.sourceFile);
                } else if (message.command === 'openExternal') {
                    // Open URL in external browser
                    vscode.env.openExternal(vscode.Uri.parse(message.url));
                }
            }
        );

        // Clean up when panel is closed
        this.panel.onDidDispose(() => {
            this.panel = undefined;
            this.currentSourceFile = undefined;
            this.fileWatcher.dispose();
        });

        // Set initial content
        this.updateContent(sourceFilePath, docsPath);
    }

    /**
     * Updates the content of the webview panel
     */
    private async updateContent(sourceFilePath: string, docsPath: string | undefined): Promise<void> {
        if (!this.panel) {
            return;
        }

        this.currentSourceFile = sourceFilePath;

        // Read markdown content
        let htmlContent = '';

        if (docsPath && fs.existsSync(docsPath)) {
            // Docs file exists and has mapping
            const markdownContent = fs.readFileSync(docsPath, 'utf-8');
            htmlContent = this.md.render(markdownContent);
        } else {
            // No mapping or no file - show empty state with button to create/link
            htmlContent = this.getEmptyState(sourceFilePath, docsPath);
        }

        // Generate breadcrumb
        const breadcrumb = this.breadcrumbBuilder.buildBreadcrumb(sourceFilePath, false);

        // Update panel
        const fileName = path.basename(sourceFilePath);
        this.panel.title = `📖 ${fileName}`;
        this.panel.webview.html = this.generateWebviewHtml(
            htmlContent,
            breadcrumb,
            docsPath || '',
            fileName
        );
    }

    /**
     * Navigates to module-level documentation
     * Called when user clicks a folder in breadcrumb
     */
    private async navigateToModuleDocs(folderPath: string): Promise<void> {
        const moduleName = path.basename(folderPath);

        // Mirror the folder structure in docky folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        let relativeFolderPath = path.relative(workspaceRoot, folderPath);

        // If the path already starts with docky folder, strip it
        // This happens when user clicks breadcrumb from within module docs
        const config = this.docsHelper.getMappingManager().readConfig();
        const dockyFolder = config.dockyFolder;
        if (relativeFolderPath.startsWith(dockyFolder + path.sep) || relativeFolderPath === dockyFolder) {
            relativeFolderPath = relativeFolderPath.substring(dockyFolder.length);
            // Remove leading separator if present
            if (relativeFolderPath.startsWith(path.sep)) {
                relativeFolderPath = relativeFolderPath.substring(path.sep.length);
            }
        }

        const docsFileName = moduleName.replace(/_/g, '-') + '.module.md';
        const moduleDocsPath = path.join(workspaceRoot, dockyFolder, relativeFolderPath, docsFileName);

        // DO NOT auto-create module docs - let user create manually

        // Read and render module docs
        let htmlContent = '';
        if (fs.existsSync(moduleDocsPath)) {
            const markdownContent = fs.readFileSync(moduleDocsPath, 'utf-8');
            htmlContent = this.md.render(markdownContent);
        } else {
            // Show empty state with button to create module docs
            htmlContent = this.getEmptyState(moduleDocsPath, moduleDocsPath);
        }

        const breadcrumb = this.breadcrumbBuilder.buildBreadcrumb(folderPath, true);

        if (this.panel) {
            this.panel.title = `📦 ${moduleName} Module`;
            this.panel.webview.html = this.generateWebviewHtml(
                htmlContent,
                breadcrumb,
                moduleDocsPath,
                `${moduleName} Module`
            );
        }

        // Watch module docs file (if exists)
        if (fs.existsSync(moduleDocsPath)) {
            this.fileWatcher.watchFile(moduleDocsPath, () => {
                if (this.panel) {
                    this.navigateToModuleDocs(folderPath);
                }
            });
        }
    }

    /**
     * Generates the complete HTML for the webview
     * Includes styling, breadcrumb, and rendered markdown
     */
    private generateWebviewHtml(
        markdownHtml: string,
        breadcrumb: string,
        docsPath: string,
        title: string
    ): string {
        const nonce = this.getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            line-height: 1.6;
        }

        /* Header Section */
        .header {
            position: sticky;
            top: 0;
            background-color: var(--vscode-sideBar-background);
            border-bottom: 2px solid var(--vscode-panel-border);
            padding: 16px 24px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .breadcrumb-container {
            margin-bottom: 12px;
        }

        .breadcrumb {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;
            font-size: 0.95em;
        }

        .breadcrumb-item {
            cursor: pointer;
            color: var(--vscode-textLink-foreground);
            padding: 6px 10px;
            border-radius: 4px;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        .breadcrumb-item:hover {
            background-color: var(--vscode-list-hoverBackground);
            color: var(--vscode-textLink-activeForeground);
        }

        .breadcrumb-separator {
            color: var(--vscode-descriptionForeground);
            opacity: 0.6;
            user-select: none;
            font-weight: bold;
        }

        .breadcrumb-current {
            color: var(--vscode-foreground);
            font-weight: 600;
            cursor: default;
            background-color: var(--vscode-badge-background);
            padding: 6px 12px;
            border-radius: 4px;
        }

        .docs-path {
            font-size: 0.85em;
            color: var(--vscode-descriptionForeground);
            font-family: var(--vscode-editor-font-family);
            padding: 8px 12px;
            background-color: var(--vscode-textCodeBlock-background);
            border-radius: 4px;
            border-left: 3px solid var(--vscode-textLink-foreground);
        }

        /* Content Section */
        .content {
            padding: 32px 24px;
            max-width: 900px;
            margin: 0 auto;
        }

        /* Markdown Styling */
        h1, h2, h3, h4, h5, h6 {
            color: var(--vscode-foreground);
            font-weight: 600;
            line-height: 1.3;
            margin-top: 24px;
            margin-bottom: 16px;
        }

        h1 {
            font-size: 2em;
            border-bottom: 2px solid var(--vscode-panel-border);
            padding-bottom: 10px;
            margin-top: 0;
        }

        h2 {
            font-size: 1.6em;
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 8px;
        }

        h3 { font-size: 1.3em; }
        h4 { font-size: 1.1em; }
        h5 { font-size: 1em; }
        h6 { font-size: 0.9em; opacity: 0.9; }

        p {
            margin: 16px 0;
        }

        a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }

        a:hover {
            color: var(--vscode-textLink-activeForeground);
            text-decoration: underline;
        }

        code {
            font-family: var(--vscode-editor-font-family);
            font-size: 0.9em;
            padding: 3px 6px;
            background-color: var(--vscode-textCodeBlock-background);
            border-radius: 3px;
            color: var(--vscode-textPreformat-foreground);
        }

        pre {
            background-color: var(--vscode-textCodeBlock-background);
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 16px 0;
            border: 1px solid var(--vscode-panel-border);
        }

        pre code {
            padding: 0;
            background-color: transparent;
            font-size: 0.85em;
        }

        blockquote {
            margin: 16px 0;
            padding: 12px 16px;
            color: var(--vscode-descriptionForeground);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            background-color: var(--vscode-textBlockQuote-background);
            border-radius: 4px;
        }

        blockquote p {
            margin: 8px 0;
        }

        ul, ol {
            padding-left: 32px;
            margin: 16px 0;
        }

        li {
            margin: 8px 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            border: 1px solid var(--vscode-panel-border);
        }

        th, td {
            border: 1px solid var(--vscode-panel-border);
            padding: 10px 14px;
            text-align: left;
        }

        th {
            background-color: var(--vscode-sideBar-background);
            font-weight: 600;
        }

        tr:nth-child(even) {
            background-color: var(--vscode-list-hoverBackground);
        }

        hr {
            border: none;
            border-top: 1px solid var(--vscode-panel-border);
            margin: 32px 0;
        }

        img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            margin: 16px 0;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .empty-title {
            font-size: 1.4em;
            margin-bottom: 12px;
            color: var(--vscode-foreground);
            font-weight: 600;
        }

        .empty-description {
            font-size: 1em;
            opacity: 0.8;
            margin-bottom: 24px;
        }

        .add-docs-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 12px 24px;
            font-size: 1em;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            font-family: var(--vscode-font-family);
            font-weight: 500;
        }

        .add-docs-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .add-docs-button:active {
            transform: translateY(1px);
        }

        /* Donation Button */
        .donation-footer {
            text-align: center;
            padding: 24px;
            border-top: 1px solid var(--vscode-panel-border);
            margin-top: 40px;
            background-color: var(--vscode-sideBar-background);
        }

        .donate-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 0.9em;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--vscode-font-family);
            font-weight: 500;
            text-decoration: none;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .donate-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .donate-button:active {
            transform: translateY(0);
        }

        .donation-text {
            font-size: 0.85em;
            color: var(--vscode-descriptionForeground);
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="breadcrumb-container">
            <div class="breadcrumb" id="breadcrumb">
                ${breadcrumb}
            </div>
        </div>
        <div class="docs-path">📄 ${docsPath}</div>
    </div>

    <div class="content">
        ${markdownHtml}
    </div>

    <div class="donation-footer">
        <a href="https://www.tirikchilik.uz/ahadjonovss" class="donate-button" id="donateBtn">
            ☕ Support the Developer
        </a>
        <div class="donation-text">If you find Docky useful, consider buying me a coffee!</div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();

        // Handle all click events
        document.addEventListener('click', (event) => {
            const target = event.target;

            // Handle breadcrumb navigation clicks
            if (target.classList.contains('breadcrumb-item') &&
                target.dataset.path &&
                !target.classList.contains('breadcrumb-current')) {

                vscode.postMessage({
                    command: 'navigateToModule',
                    folderPath: target.dataset.path
                });
            }

            // Handle create docs button clicks
            if (target.id === 'createDocsBtn' || target.classList.contains('add-docs-button')) {
                const sourceFile = target.dataset.source;
                if (sourceFile) {
                    vscode.postMessage({
                        command: 'createDocs',
                        sourceFile: sourceFile
                    });
                }
            }

            // Handle donate button clicks
            if (target.id === 'donateBtn' || target.classList.contains('donate-button')) {
                event.preventDefault();
                const url = target.href || 'https://www.tirikchilik.uz/ahadjonovss';
                vscode.postMessage({
                    command: 'openExternal',
                    url: url
                });
            }
        });
    </script>
</body>
</html>`;
    }

    /**
     * Creates and opens the docs file for editing
     * Uses suggested path from MappingManager
     */
    private async createAndOpenDocsFile(sourceFilePath: string): Promise<void> {
        // Check if this is a module docs path
        const isModuleDocs = sourceFilePath.endsWith('.module.docs.md');

        let docsPath: string;

        if (isModuleDocs) {
            // It's already a module docs path
            docsPath = sourceFilePath;
            const folderPath = path.dirname(docsPath);
            const moduleName = path.basename(folderPath);
            await this.docsHelper.ensureModuleDocsFileExists(docsPath, moduleName);
        } else {
            // Get suggested path for new docs file
            const suggestedPath = this.docsHelper.suggestDocsPath(sourceFilePath);
            if (!suggestedPath) {
                vscode.window.showErrorMessage('Could not determine docs path. Please check workspace.');
                return;
            }

            docsPath = suggestedPath;
            await this.docsHelper.ensureDocsFileExists(docsPath, sourceFilePath);
        }

        // Open the docs file in editor
        const doc = await vscode.workspace.openTextDocument(docsPath);
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.One);

        // Refresh the panel
        if (isModuleDocs) {
            const folderPath = path.dirname(docsPath);
            await this.navigateToModuleDocs(folderPath);
        } else {
            await this.updateContent(sourceFilePath, docsPath);
        }

        // Start watching the file
        this.fileWatcher.watchFile(docsPath, () => {
            if (this.panel) {
                if (isModuleDocs) {
                    const folderPath = path.dirname(docsPath);
                    this.navigateToModuleDocs(folderPath);
                } else if (this.currentSourceFile) {
                    const dp = this.docsHelper.getDocsFilePath(this.currentSourceFile);
                    if (dp) {
                        this.updateContent(this.currentSourceFile, dp);
                    }
                }
            }
        });
    }

    /**
     * Generates empty state HTML when no documentation exists
     */
    private getEmptyState(sourceFilePath: string, docsPath: string | undefined): string {
        const escapedPath = sourceFilePath.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const suggestedPath = this.docsHelper.suggestDocsPath(sourceFilePath);
        const displayPath = docsPath || suggestedPath || 'docky/...';

        return `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <div class="empty-title">No Documentation</div>
                <div class="empty-description">
                    This file doesn't have documentation yet<br>
                    <code style="font-size: 0.9em; opacity: 0.7;">${displayPath}</code>
                </div>
                <button class="add-docs-button" id="createDocsBtn" data-source="${escapedPath}">
                    📄 Create Documentation
                </button>
            </div>
        `;
    }

    /**
     * Generates a random nonce for Content Security Policy
     */
    private getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public dispose(): void {
        this.panel?.dispose();
        this.fileWatcher.dispose();
    }
}
