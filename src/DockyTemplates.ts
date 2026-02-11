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

## 📋 Umumiy ma'lumot

\`${className}\` - biznes logikasini boshqaruvchi servis.

## 🔑 Asosiy metodlar

### \`methodName()\`
- **Vazifasi:** Metodning vazifasini yozing
- **Parametrlar:**
  - \`param1\`: Parametr tavsifi
- **Qaytaradi:** Qaytaradigan qiymat tavsifi

## 📖 Foydalanish

\`\`\`dart
final service = ${className}();
final result = await service.methodName();
\`\`\`

## 🔗 Bog'liqliklar

- **Dependencies:**
  - \`package:some_package\`
- **Related files:**
  - \`file_name.dart\`

## 📝 Izohlar

- Muhim implementation detallari
- Ma'lum muammolar yoki cheklovlar
- TODO va kelajakdagi yaxshilashlar

## 📅 O'zgarishlar tarixi

- **${date}**: Hujjat yaratildi
`;
    }

    private static generateModelTemplate(className: string, fileName: string, date: string): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** Data Model
> **Created:** ${date}

## 📋 Umumiy ma'lumot

\`${className}\` - ma'lumotlar modeli.

## 🏗️ Struktura

\`\`\`dart
class ${className} {
  final String id;
  final String name;
  // ... boshqa fieldlar

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

## 📊 Fieldlar

| Field | Type | Tavsif |
|-------|------|--------|
| \`id\` | \`String\` | Unique identifier |
| \`name\` | \`String\` | Nomi |

## 🔄 Metodlar

### \`fromJson()\`
JSON dan model obyektiga o'tkazish.

### \`toJson()\`
Model obyektidan JSON ga o'tkazish.

### \`copyWith()\`
Yangi nusxa yaratish (immutable pattern).

## 📖 Foydalanish

\`\`\`dart
final model = ${className}.fromJson(jsonData);
final updated = model.copyWith(name: 'New Name');
\`\`\`

## 📅 O'zgarishlar tarixi

- **${date}**: Model yaratildi
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

## 📋 Umumiy ma'lumot

\`${className}\` - state management uchun ${type}.

## 🎯 Holatlar (States)

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

## ⚡ Eventlar (Events)

\`\`\`dart
abstract class ${className}Event {}

class LoadData extends ${className}Event {}
class UpdateData extends ${className}Event {
  final Data data;
  UpdateData(this.data);
}
\`\`\`

## 🔄 Oqim (Flow)

\`\`\`
User Action → Event → ${type} → State → UI Update
\`\`\`

## 📖 Foydalanish

\`\`\`dart
BlocProvider(
  create: (context) => ${className}(),
  child: MyWidget(),
)

// Widget ichida
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

## 📅 O'zgarishlar tarixi

- **${date}**: ${type} yaratildi
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

## 📋 Umumiy ma'lumot

\`${className}\` - Flutter ${type.toLowerCase()}.

## 🎨 UI Struktura

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

## 🔧 Parametrlar

| Parameter | Type | Required | Tavsif |
|-----------|------|----------|--------|
| \`param1\` | \`String\` | ✅ | Parametr tavsifi |

## 📖 Foydalanish

\`\`\`dart
${className}(
  param1: 'value',
)
\`\`\`

## 🎯 Key Features

- Feature 1
- Feature 2
- Feature 3

## 📅 O'zgarishlar tarixi

- **${date}**: Widget yaratildi
`;
    }

    private static generateRepositoryTemplate(className: string, fileName: string, date: string): string {
        return `# ${className}

> **File:** \`${fileName}\`
> **Type:** Repository
> **Created:** ${date}

## 📋 Umumiy ma'lumot

\`${className}\` - ma'lumotlar bilan ishlash uchun repository.

## 🔄 CRUD Operatsiyalar

### \`fetch()\`
Ma'lumotlarni olish.

### \`create()\`
Yangi ma'lumot yaratish.

### \`update()\`
Ma'lumotni yangilash.

### \`delete()\`
Ma'lumotni o'chirish.

## 📖 Foydalanish

\`\`\`dart
final repository = ${className}();
final data = await repository.fetch();
\`\`\`

## 🔗 Data Sources

- **Local:** SQLite, Hive, SharedPreferences
- **Remote:** REST API, GraphQL, Firebase

## 📅 O'zgarishlar tarixi

- **${date}**: Repository yaratildi
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

## 📋 Umumiy ma'lumot

\`${className}\` tavsifi.

## 📖 Foydalanish

\`\`\`dart
// Foydalanish misoli
\`\`\`

## 📝 Izohlar

- Muhim ma'lumotlar
- Cheklovlar
- TODO

## 📅 O'zgarishlar tarixi

- **${date}**: Hujjat yaratildi
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
