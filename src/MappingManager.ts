import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Manages the .docky.json mapping file
 * Maps source files to their documentation files in the docky/ folder
 *
 * Example .docky.json:
 * {
 *   "dockyFolder": "docky",
 *   "mappings": {
 *     "lib/features/auth/auth_service.dart": "docky/auth/auth-service.md",
 *     "lib/models/user_model.dart": "docky/models/user-model.md"
 *   }
 * }
 */
export interface DockyConfig {
    dockyFolder: string;
    mappings: { [sourceFile: string]: string };
}

export class MappingManager {
    private configFileName = '.docky.json';
    private defaultDockyFolder = 'docky';

    /**
     * Gets the workspace root path
     */
    private getWorkspaceRoot(): string | undefined {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return undefined;
        }
        return workspaceFolders[0].uri.fsPath;
    }

    /**
     * Gets the config file path
     */
    private getConfigPath(): string | undefined {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            return undefined;
        }
        return path.join(workspaceRoot, this.configFileName);
    }

    /**
     * Reads the .docky.json config file
     */
    public readConfig(): DockyConfig {
        const configPath = this.getConfigPath();

        if (!configPath || !fs.existsSync(configPath)) {
            // Return default config
            return {
                dockyFolder: this.defaultDockyFolder,
                mappings: {}
            };
        }

        try {
            const content = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(content) as DockyConfig;

            // Ensure dockyFolder exists
            if (!config.dockyFolder) {
                config.dockyFolder = this.defaultDockyFolder;
            }

            // Ensure mappings exists
            if (!config.mappings) {
                config.mappings = {};
            }

            return config;
        } catch (error) {
            console.error('Failed to read .docky.json:', error);
            return {
                dockyFolder: this.defaultDockyFolder,
                mappings: {}
            };
        }
    }

    /**
     * Writes the config to .docky.json
     */
    public writeConfig(config: DockyConfig): void {
        const configPath = this.getConfigPath();
        if (!configPath) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        try {
            const content = JSON.stringify(config, null, 2);
            fs.writeFileSync(configPath, content, 'utf-8');
            console.log('Saved .docky.json config');
        } catch (error) {
            console.error('Failed to write .docky.json:', error);
            vscode.window.showErrorMessage('Failed to save .docky.json');
        }
    }

    /**
     * Ensures .docky.json exists, creates it if not
     */
    public ensureConfigExists(): void {
        const configPath = this.getConfigPath();
        if (!configPath) {
            return;
        }

        if (!fs.existsSync(configPath)) {
            const defaultConfig: DockyConfig = {
                dockyFolder: this.defaultDockyFolder,
                mappings: {}
            };
            this.writeConfig(defaultConfig);
            console.log('Created .docky.json config file');
        }
    }

    /**
     * Gets the docs file path for a source file
     * Returns the mapped path if exists, otherwise generates a suggested path
     */
    public getDocsPath(sourceFilePath: string): string | undefined {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            return undefined;
        }

        // Make path relative to workspace
        const relativePath = path.relative(workspaceRoot, sourceFilePath);

        const config = this.readConfig();

        // Check if mapping exists
        if (config.mappings[relativePath]) {
            return path.join(workspaceRoot, config.mappings[relativePath]);
        }

        // No mapping - return undefined (user needs to create mapping)
        return undefined;
    }

    /**
     * Suggests a docs file path based on source file structure
     * For Dart: lib/features/auth/auth_service.dart → docky/auth/auth-service.md
     */
    public suggestDocsPath(sourceFilePath: string): string | undefined {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            return undefined;
        }

        const config = this.readConfig();
        const dockyFolder = config.dockyFolder;

        // Get relative path from workspace
        const relativePath = path.relative(workspaceRoot, sourceFilePath);

        // Parse the path
        const parsed = path.parse(relativePath);
        const fileName = parsed.name; // e.g., "auth_service" from "auth_service.dart"

        // Convert snake_case to kebab-case for docs
        const docsFileName = fileName.replace(/_/g, '-') + '.md';

        // Get the parent folder name (for categorization)
        const pathParts = parsed.dir.split(path.sep);

        // For Dart structure like lib/features/auth/...
        // We want to extract the feature/module name
        let category = 'general';

        if (pathParts.includes('features') || pathParts.includes('modules')) {
            const featureIndex = pathParts.indexOf('features') || pathParts.indexOf('modules');
            if (featureIndex >= 0 && pathParts.length > featureIndex + 1) {
                category = pathParts[featureIndex + 1]; // e.g., "auth"
            }
        } else if (pathParts.includes('models')) {
            category = 'models';
        } else if (pathParts.includes('services')) {
            category = 'services';
        } else if (pathParts.includes('controllers')) {
            category = 'controllers';
        } else if (pathParts.includes('widgets') || pathParts.includes('screens')) {
            category = 'ui';
        }

        // Build suggested path: docky/{category}/{filename}.md
        const suggestedPath = path.join(workspaceRoot, dockyFolder, category, docsFileName);

        return suggestedPath;
    }

    /**
     * Adds a mapping from source file to docs file
     */
    public addMapping(sourceFilePath: string, docsFilePath: string): void {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            return;
        }

        const config = this.readConfig();

        // Make paths relative
        const relativeSource = path.relative(workspaceRoot, sourceFilePath);
        const relativeDocs = path.relative(workspaceRoot, docsFilePath);

        config.mappings[relativeSource] = relativeDocs;

        this.writeConfig(config);
        console.log(`Added mapping: ${relativeSource} -> ${relativeDocs}`);
    }

    /**
     * Removes a mapping
     */
    public removeMapping(sourceFilePath: string): void {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            return;
        }

        const config = this.readConfig();
        const relativeSource = path.relative(workspaceRoot, sourceFilePath);

        if (config.mappings[relativeSource]) {
            delete config.mappings[relativeSource];
            this.writeConfig(config);
            console.log(`Removed mapping for: ${relativeSource}`);
        }
    }

    /**
     * Gets the docky folder path
     */
    public getDockyFolderPath(): string | undefined {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            return undefined;
        }

        const config = this.readConfig();
        return path.join(workspaceRoot, config.dockyFolder);
    }

    /**
     * Ensures the docky folder exists
     */
    public ensureDockyFolderExists(): void {
        const dockyPath = this.getDockyFolderPath();
        if (!dockyPath) {
            return;
        }

        if (!fs.existsSync(dockyPath)) {
            fs.mkdirSync(dockyPath, { recursive: true });
            console.log(`Created docky folder: ${dockyPath}`);
        }
    }

    /**
     * Gets all mapped docs files
     */
    public getAllMappings(): { [sourceFile: string]: string } {
        const config = this.readConfig();
        return config.mappings;
    }

    /**
     * Checks if a source file has a mapping
     */
    public hasMapping(sourceFilePath: string): boolean {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            return false;
        }

        const config = this.readConfig();
        const relativeSource = path.relative(workspaceRoot, sourceFilePath);

        return !!config.mappings[relativeSource];
    }
}
