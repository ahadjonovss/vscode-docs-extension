import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Builds breadcrumb navigation HTML
 * Creates clickable folder hierarchy for navigating to module documentation
 *
 * Example output:
 * workspace > src > modules > user > user.service.ts
 * (each folder is clickable to view module docs)
 */
export class BreadcrumbBuilder {
    /**
     * Builds breadcrumb HTML for a file or folder path
     * @param filePath - Full path to file or folder
     * @param isModuleView - Whether this is a module-level view
     */
    public buildBreadcrumb(filePath: string, isModuleView: boolean): string {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(
            vscode.Uri.file(filePath)
        );

        if (!workspaceFolder) {
            return this.buildSimpleBreadcrumb(filePath, isModuleView);
        }

        const workspacePath = workspaceFolder.uri.fsPath;
        const relativePath = path.relative(workspacePath, filePath);
        const parts = relativePath.split(path.sep).filter(p => p.length > 0);

        // Remove filename if not module view
        if (!isModuleView && parts.length > 0) {
            parts.pop();
        }

        const breadcrumbItems: string[] = [];
        let currentPath = workspacePath;

        // Add workspace root
        breadcrumbItems.push(this.createBreadcrumbItem(
            workspaceFolder.name,
            currentPath,
            false,
            true
        ));

        // Add each folder in path
        parts.forEach((part, index) => {
            currentPath = path.join(currentPath, part);
            const isLast = index === parts.length - 1;
            const isModule = this.isModuleFolder(part);
            const isCurrent = isLast && isModuleView;

            breadcrumbItems.push(
                '<span class="breadcrumb-separator">›</span>',
                this.createBreadcrumbItem(part, currentPath, isCurrent, isModule)
            );
        });

        // Add filename if not module view
        if (!isModuleView) {
            const fileName = path.basename(filePath);
            breadcrumbItems.push(
                '<span class="breadcrumb-separator">›</span>',
                `<span class="breadcrumb-current">${this.escapeHtml(fileName)}</span>`
            );
        }

        return breadcrumbItems.join('\n');
    }

    /**
     * Creates a single breadcrumb item
     */
    private createBreadcrumbItem(
        label: string,
        fullPath: string,
        isCurrent: boolean,
        isModule: boolean
    ): string {
        const escapedLabel = this.escapeHtml(label);

        if (isCurrent) {
            return `<span class="breadcrumb-current">${escapedLabel}</span>`;
        }

        const opacity = isModule ? '1' : '0.75';
        const weight = isModule ? 'font-weight: 500;' : '';

        return `<span class="breadcrumb-item" data-path="${this.escapeHtml(fullPath)}" style="opacity: ${opacity}; ${weight}">${escapedLabel}</span>`;
    }

    /**
     * Checks if folder name suggests it's a module
     * Uses heuristics based on common naming patterns
     */
    private isModuleFolder(folderName: string): boolean {
        const modulePatterns = [
            // Common module folder names
            /^(src|lib|app|modules|features|components|services|utils|helpers|core|shared)$/i,
            // Specific feature modules (lowercase word)
            /^[a-z]+$/,
            // Ends with common module suffixes
            /(module|feature|domain|layer)$/i,
        ];

        return modulePatterns.some(pattern => pattern.test(folderName));
    }

    /**
     * Builds simple breadcrumb when workspace context unavailable
     */
    private buildSimpleBreadcrumb(filePath: string, isModuleView: boolean): string {
        const fileName = path.basename(filePath);
        const parentDir = path.basename(path.dirname(filePath));

        if (isModuleView) {
            return `<span class="breadcrumb-current">${this.escapeHtml(fileName)}</span>`;
        }

        return `
            <span class="breadcrumb-item" style="opacity: 0.75;">${this.escapeHtml(parentDir)}</span>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">${this.escapeHtml(fileName)}</span>
        `;
    }

    /**
     * Escapes HTML special characters
     */
    private escapeHtml(text: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (char) => map[char]);
    }
}
