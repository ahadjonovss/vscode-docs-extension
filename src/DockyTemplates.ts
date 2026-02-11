/**
 * Template generator for Dart-specific documentation
 * Provides smart templates based on Dart file types
 */
export class DockyTemplates {
    /**
     * Generates default documentation for Dart files
     */
    public static generateDartTemplate(
        fileName: string,
        fileType: string
    ): string {
        const date = new Date().toISOString().split('T')[0];
        const baseName = fileName.replace(/\.dart$/, '');
        const className = this.snakeToPascal(baseName);

        if (fileType === 'Service') {
            return this.generateServiceTemplate(className, fileName, date);
        } else if (fileType === 'Model') {
            return this.generateModelTemplate(className, fileName, date);
        } else if (fileType === 'Controller' || fileType === 'Bloc' || fileType === 'Cubit') {
            return this.generateStateManagementTemplate(className, fileType, fileName, date);
        } else if (fileType === 'Widget' || fileType === 'Screen') {
            return this.generateWidgetTemplate(className, fileType, fileName, date);
        } else if (fileType === 'Repository') {
            return this.generateRepositoryTemplate(className, fileName, date);
        }

        return this.generateGenericTemplate(className, fileName, fileType, date);
    }

    private static generateServiceTemplate(className: string, fileName: string, date: string): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** Service
> **Created:** ${date}

## 📋 Overview

\`${className}\` - Service that manages business logic.

## 🔑 Key Methods

### \`methodName()\`
- **Purpose:** Describe what this method does
- **Parameters:**
  - \`param1\`: Parameter description
- **Returns:** Return value description

## 📖 Usage

\`\`\`dart
final service = ${className}();
final result = await service.methodName();
\`\`\`

## 🔗 Dependencies

- **Dependencies:**
  - \`package:some_package\`
- **Related files:**
  - \`file_name.dart\`

## 📝 Notes

- Important implementation details
- Known issues or limitations
- TODO and future improvements

## 📅 Change History

- **${date}**: Documentation created
`;
    }

    private static generateModelTemplate(className: string, fileName: string, date: string): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** Data Model
> **Created:** ${date}

## 📋 Overview

\`${className}\` - Data model class.

## 🏗️ Structure

\`\`\`dart
class ${className} {
  final String id;
  final String name;
  // ... other fields

  ${className}({
    required this.id,
    required this.name,
  });

  factory ${className}.fromJson(Map<String, dynamic> json) {
    // JSON parsing
  }

  Map<String, dynamic> toJson() {
    // JSON serialization
  }
}
\`\`\`

## 📊 Fields

| Field | Type | Description |
|-------|------|-------------|
| \`id\` | \`String\` | Unique identifier |
| \`name\` | \`String\` | Name |

## 🔄 Methods

### \`fromJson()\`
Converts JSON to model object.

### \`toJson()\`
Converts model object to JSON.

### \`copyWith()\`
Creates a copy with updated fields (immutable pattern).

## 📖 Usage

\`\`\`dart
final model = ${className}.fromJson(jsonData);
final updated = model.copyWith(name: 'New Name');
\`\`\`

## 📅 Change History

- **${date}**: Model created
`;
    }

    private static generateStateManagementTemplate(
        className: string,
        type: string,
        fileName: string,
        date: string
    ): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** ${type}
> **Created:** ${date}

## 📋 Overview

\`${className}\` - ${type} for state management.

## 🎯 States

\`\`\`dart
abstract class ${className}State {}

class ${className}Initial extends ${className}State {}
class ${className}Loading extends ${className}State {}
class ${className}Loaded extends ${className}State {
  final Data data;
  ${className}Loaded(this.data);
}
class ${className}Error extends ${className}State {
  final String message;
  ${className}Error(this.message);
}
\`\`\`

## ⚡ Events

\`\`\`dart
abstract class ${className}Event {}

class LoadData extends ${className}Event {}
class UpdateData extends ${className}Event {
  final Data data;
  UpdateData(this.data);
}
\`\`\`

## 🔄 Flow

\`\`\`
User Action → Event → ${type} → State → UI Update
\`\`\`

## 📖 Usage

\`\`\`dart
BlocProvider(
  create: (context) => ${className}(),
  child: MyWidget(),
)

// Inside widget
context.read<${className}>().add(LoadData());
\`\`\`

## 🧪 Testing

\`\`\`dart
blocTest<${className}, ${className}State>(
  'description',
  build: () => ${className}(),
  act: (bloc) => bloc.add(LoadData()),
  expect: () => [
    ${className}Loading(),
    ${className}Loaded(data),
  ],
);
\`\`\`

## 📅 Change History

- **${date}**: ${type} created
`;
    }

    private static generateWidgetTemplate(
        className: string,
        type: string,
        fileName: string,
        date: string
    ): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** ${type}
> **Created:** ${date}

## 📋 Overview

\`${className}\` - Flutter ${type.toLowerCase()}.

## 🎨 UI Structure

\`\`\`dart
class ${className} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Title')),
      body: // Widget tree
    );
  }
}
\`\`\`

## 🔧 Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| \`param1\` | \`String\` | ✅ | Parameter description |

## 📖 Usage

\`\`\`dart
${className}(
  param1: 'value',
)
\`\`\`

## 🎯 Key Features

- Feature 1
- Feature 2
- Feature 3

## 📅 Change History

- **${date}**: Widget created
`;
    }

    private static generateRepositoryTemplate(className: string, fileName: string, date: string): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** Repository
> **Created:** ${date}

## 📋 Overview

\`${className}\` - Repository for data operations.

## 🔄 CRUD Operations

### \`fetch()\`
Fetches data from the data source.

### \`create()\`
Creates new data entry.

### \`update()\`
Updates existing data.

### \`delete()\`
Deletes data entry.

## 📖 Usage

\`\`\`dart
final repository = ${className}();
final data = await repository.fetch();
\`\`\`

## 🔗 Data Sources

- **Local:** SQLite, Hive, SharedPreferences
- **Remote:** REST API, GraphQL, Firebase

## 📅 Change History

- **${date}**: Repository created
`;
    }

    private static generateGenericTemplate(
        className: string,
        fileName: string,
        fileType: string,
        date: string
    ): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** ${fileType}
> **Created:** ${date}

## 📋 Overview

\`${className}\` description.

## 📖 Usage

\`\`\`dart
// Usage example
\`\`\`

## 📝 Notes

- Important information
- Limitations
- TODO

## 📅 Change History

- **${date}**: Documentation created
`;
    }

    /**
     * Converts snake_case to PascalCase
     */
    private static snakeToPascal(str: string): string {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    /**
     * Infers Dart file type from filename
     */
    public static inferDartFileType(fileName: string): string {
        const lower = fileName.toLowerCase();

        if (lower.includes('_service')) return 'Service';
        if (lower.includes('_model')) return 'Model';
        if (lower.includes('_entity')) return 'Model';
        if (lower.includes('_bloc')) return 'Bloc';
        if (lower.includes('_cubit')) return 'Cubit';
        if (lower.includes('_controller')) return 'Controller';
        if (lower.includes('_repository')) return 'Repository';
        if (lower.includes('_widget')) return 'Widget';
        if (lower.includes('_screen') || lower.includes('_page')) return 'Screen';
        if (lower.includes('_provider')) return 'Provider';
        if (lower.includes('_notifier')) return 'Notifier';
        if (lower.includes('_helper')) return 'Helper';
        if (lower.includes('_util')) return 'Utility';
        if (lower.includes('_config')) return 'Configuration';
        if (lower.includes('_constant')) return 'Constants';

        return 'Dart File';
    }
}
