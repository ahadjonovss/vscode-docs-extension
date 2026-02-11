import * as fs from 'fs';
import * as path from 'path';
import { MappingManager } from './MappingManager';
import { DockyTemplates } from './DockyTemplates';

/**
 * Helper class for managing documentation files
 * NOW USES: Separate docky/ folder with .docky.json mapping
 *
 * OLD: user.service.ts → user.service.ts.docs.md (same folder)
 * NEW: lib/services/auth_service.dart → docky/services/auth-service.md
 */
export class DocsFileHelper {
    private mappingManager: MappingManager;

    constructor() {
        this.mappingManager = new MappingManager();
    }

    /**
     * Gets the documentation file path for a source file
     * Uses mapping from .docky.json
     */
    public getDocsFilePath(sourceFilePath: string): string | undefined {
        return this.mappingManager.getDocsPath(sourceFilePath);
    }

    /**
     * Suggests a documentation file path
     * For Dart: lib/features/auth/auth_service.dart → docky/auth/auth-service.md
     */
    public suggestDocsPath(sourceFilePath: string): string | undefined {
        return this.mappingManager.suggestDocsPath(sourceFilePath);
    }

    /**
     * Creates a new docs file and adds mapping
     */
    public async ensureDocsFileExists(
        docsFilePath: string,
        sourceFilePath: string
    ): Promise<void> {
        // Ensure docky folder exists
        this.mappingManager.ensureDockyFolderExists();

        // Ensure parent directory exists
        const docsDir = path.dirname(docsFilePath);
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }

        // If file already exists, don't overwrite
        if (fs.existsSync(docsFilePath)) {
            return;
        }

        // Generate default content
        const defaultContent = this.generateDefaultContent(sourceFilePath);

        try {
            fs.writeFileSync(docsFilePath, defaultContent, 'utf-8');
            console.log(`Created docs file: ${docsFilePath}`);

            // Add mapping to .docky.json
            this.mappingManager.addMapping(sourceFilePath, docsFilePath);
        } catch (error) {
            console.error(`Failed to create docs file: ${error}`);
            throw error;
        }
    }

    /**
     * Creates module documentation
     */
    public async ensureModuleDocsFileExists(
        moduleDocsPath: string,
        moduleName: string
    ): Promise<void> {
        // Ensure parent directory exists
        const docsDir = path.dirname(moduleDocsPath);
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }

        if (fs.existsSync(moduleDocsPath)) {
            return;
        }

        const defaultContent = this.generateDefaultModuleContent(moduleName);

        try {
            fs.writeFileSync(moduleDocsPath, defaultContent, 'utf-8');
            console.log(`Created module documentation: ${moduleDocsPath}`);
        } catch (error) {
            console.error(`Failed to create module docs: ${error}`);
            throw error;
        }
    }

    /**
     * Generates default content for Dart files
     */
    private generateDefaultContent(sourceFilePath: string): string {
        const fileName = path.basename(sourceFilePath);
        const ext = path.extname(sourceFilePath);

        // Check if it's a Dart file
        if (ext === '.dart') {
            const fileType = DockyTemplates.inferDartFileType(fileName);
            return DockyTemplates.generateDartTemplate(fileName, fileType);
        }

        // Fallback to generic template for non-Dart files
        return this.generateGenericTemplate(sourceFilePath);
    }

    /**
     * Generic template for non-Dart files
     */
    private generateGenericTemplate(sourceFilePath: string): string {
        const fileName = path.basename(sourceFilePath);
        const ext = path.extname(sourceFilePath);
        const baseName = path.basename(sourceFilePath, ext);
        const date = new Date().toISOString().split('T')[0];

        return `# ${baseName}

> **File:** \`${fileName}\`
> **Created:** ${date}

## 📋 Overview

File description.

## 📖 Usage

\`\`\`
// Code example
\`\`\`

## 📝 Notes

- Important information
- TODO

## 📅 Change History

- **${date}**: Documentation created
`;
    }

    /**
     * Generates default module content
     */
    private generateDefaultModuleContent(moduleName: string): string {
        const date = new Date().toISOString().split('T')[0];
        const pascalName = this.toPascalCase(moduleName);

        return `# ${pascalName} Module

> **Module:** \`${moduleName}\`
> **Created:** ${date}

## 📋 Overview

**${pascalName}** module - ${moduleName} section of the application.

## 🏗️ Structure

\`\`\`
${moduleName}/
├── ${moduleName}_service.dart
├── ${moduleName}_model.dart
├── ${moduleName}_controller.dart
└── widgets/
    └── ${moduleName}_widget.dart
\`\`\`

## 🔑 Key Components

### Service Layer
- **${pascalName}Service** - Business logic

### Data Layer
- **${pascalName}Model** - Data model

### Presentation Layer
- **${pascalName}Controller** - State management
- **${pascalName}Widget** - UI components

## 📖 Usage

\`\`\`dart
// Module usage
import 'package:app/${moduleName}/${moduleName}_service.dart';

final service = ${pascalName}Service();
\`\`\`

## 🔗 Dependencies

### External
- \`package:flutter/material.dart\`

### Internal
- Other modules

## 📅 Change History

- **${date}**: Module created
`;
    }

    /**
     * Converts string to PascalCase
     */
    private toPascalCase(str: string): string {
        return str
            .split(/[-_\s]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * Checks if source file has a mapping
     */
    public hasMapping(sourceFilePath: string): boolean {
        return this.mappingManager.hasMapping(sourceFilePath);
    }

    /**
     * Gets the MappingManager instance
     */
    public getMappingManager(): MappingManager {
        return this.mappingManager;
    }
}
