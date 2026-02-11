import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper class for managing documentation files
 * Handles path resolution, file creation, and default content generation
 *
 * Naming convention: <filename>.<ext>.docs.md
 * Example: user.service.ts -> user.service.ts.docs.md
 */
export class DocsFileHelper {
    /**
     * Gets the documentation file path for a source file
     * Pattern: <filename>.docs.md (placed in same directory)
     */
    public getDocsFilePath(sourceFilePath: string): string {
        const dir = path.dirname(sourceFilePath);
        const fileName = path.basename(sourceFilePath);
        return path.join(dir, `${fileName}.docs.md`);
    }

    /**
     * Ensures a documentation file exists
     * Creates it with default template if it doesn't exist
     */
    public async ensureDocsFileExists(
        docsPath: string,
        sourceFilePath: string
    ): Promise<void> {
        if (fs.existsSync(docsPath)) {
            return;
        }

        const defaultContent = this.generateDefaultFileContent(sourceFilePath);

        try {
            fs.writeFileSync(docsPath, defaultContent, 'utf-8');
            console.log(`Created documentation file: ${docsPath}`);
        } catch (error) {
            console.error(`Failed to create docs file: ${error}`);
            throw error;
        }
    }

    /**
     * Ensures a module documentation file exists
     */
    public async ensureModuleDocsFileExists(
        moduleDocsPath: string,
        moduleName: string
    ): Promise<void> {
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
     * Generates default content for file-level documentation
     */
    private generateDefaultFileContent(sourceFilePath: string): string {
        const fileName = path.basename(sourceFilePath);
        const ext = path.extname(sourceFilePath);
        const baseName = path.basename(sourceFilePath, ext);
        const fileType = this.inferFileType(fileName);
        const language = this.getLanguageFromExtension(ext);
        const date = new Date().toISOString().split('T')[0];

        return `# ${baseName}

> **File:** \`${fileName}\`
> **Type:** ${fileType}
> **Created:** ${date}

## 📋 Overview

Brief description of what this file does and its purpose in the project.

## 🔑 Key Components

### Main Functions/Classes

- **FunctionName**: Description of what it does
- **ClassName**: Purpose and responsibilities

## 📖 Usage

\`\`\`${language}
// Example usage
import { Something } from './${baseName}';

const result = Something();
\`\`\`

## 🔗 Dependencies

- List key external dependencies
- List internal module dependencies

## 📝 Notes

- Important implementation details
- Known issues or limitations
- TODOs and future improvements
- Related files or modules

## 📅 Changelog

- **${date}**: Initial documentation created
`;
    }

    /**
     * Generates default content for module-level documentation
     */
    private generateDefaultModuleContent(moduleName: string): string {
        const date = new Date().toISOString().split('T')[0];

        return `# ${moduleName} Module

> **Module:** \`${moduleName}\`
> **Created:** ${date}

## 📋 Overview

High-level description of the **${moduleName}** module and its responsibilities within the application.

## 🏗️ Architecture

### Module Structure

\`\`\`
${moduleName}/
├── index.ts                 # Module entry point
├── ${moduleName}.service.ts # Core business logic
├── ${moduleName}.model.ts   # Data models/types
├── ${moduleName}.controller.ts
└── ${moduleName}.module.docs.md
\`\`\`

### Key Components

1. **Service Layer**
   - Handles business logic
   - Data processing and validation

2. **Controller Layer**
   - API endpoints
   - Request/response handling

3. **Model Layer**
   - Data structures
   - Type definitions

## 📖 Usage

\`\`\`typescript
import { ${this.capitalize(moduleName)}Service } from './${moduleName}';

const service = new ${this.capitalize(moduleName)}Service();
const result = await service.doSomething();
\`\`\`

## 🔌 API Reference

### Public Methods

#### \`methodName(params): ReturnType\`

Description of what this method does.

**Parameters:**
- \`param1: Type\` - Description
- \`param2: Type\` - Description

**Returns:** Description of return value

**Example:**
\`\`\`typescript
const result = methodName(param1, param2);
\`\`\`

## 🔗 Dependencies

### External Dependencies
- List npm packages used
- Third-party libraries

### Internal Dependencies
- Other modules this depends on
- Shared utilities

## 🎯 Design Decisions

- **Why this approach?** Explanation of architectural choices
- **Trade-offs:** What was considered and why
- **Future plans:** Planned improvements or refactoring

## 🧪 Testing

### Running Tests
\`\`\`bash
npm test ${moduleName}
\`\`\`

### Test Coverage
- Unit tests
- Integration tests
- Key test scenarios

## 📅 Changelog

- **${date}**: Module documentation created
`;
    }

    /**
     * Infers file type from filename patterns
     */
    private inferFileType(fileName: string): string {
        const lower = fileName.toLowerCase();

        if (lower.includes('service')) return 'Service';
        if (lower.includes('controller')) return 'Controller';
        if (lower.includes('component')) return 'Component';
        if (lower.includes('model') || lower.includes('entity')) return 'Model/Entity';
        if (lower.includes('util') || lower.includes('helper')) return 'Utility';
        if (lower.includes('test') || lower.includes('spec')) return 'Test File';
        if (lower.includes('config')) return 'Configuration';
        if (lower.includes('type') || lower.includes('interface')) return 'Type Definitions';
        if (lower.includes('middleware')) return 'Middleware';
        if (lower.includes('route') || lower.includes('router')) return 'Router';
        if (lower.includes('repository') || lower.includes('repo')) return 'Repository';
        if (lower.includes('dto')) return 'Data Transfer Object';
        if (lower.includes('guard')) return 'Guard';
        if (lower.includes('interceptor')) return 'Interceptor';
        if (lower.includes('decorator')) return 'Decorator';
        if (lower.includes('pipe')) return 'Pipe';
        if (lower.includes('module')) return 'Module';

        return 'Source File';
    }

    /**
     * Gets language identifier for code blocks
     */
    private getLanguageFromExtension(ext: string): string {
        const langMap: { [key: string]: string } = {
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.py': 'python',
            '.java': 'java',
            '.cs': 'csharp',
            '.go': 'go',
            '.rs': 'rust',
            '.cpp': 'cpp',
            '.c': 'c',
            '.rb': 'ruby',
            '.php': 'php',
            '.swift': 'swift',
            '.kt': 'kotlin',
            '.dart': 'dart',
            '.vue': 'vue',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.sh': 'bash',
        };

        return langMap[ext.toLowerCase()] || 'javascript';
    }

    /**
     * Capitalizes first letter of a string
     */
    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
