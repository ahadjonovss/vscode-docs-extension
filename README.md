# Inline Documentation Viewer

A VS Code extension that helps you maintain documentation alongside your code files.

## Features

- **📚 Side-by-side Documentation**: View markdown documentation in a panel beside your code
- **🔍 Auto-create Docs**: Automatically creates `.docs.md` files with helpful templates
- **🧭 Breadcrumb Navigation**: Navigate through folder structure to view module-level documentation
- **🔄 Live Refresh**: Auto-refreshes when you edit the documentation file
- **🎨 Beautiful Rendering**: Clean, VSCode-themed markdown rendering
- **🌍 Language Agnostic**: Works with any programming language

## Usage

1. Open any file in VS Code
2. Click the **book icon** (📖) in the editor title bar
3. A documentation panel will open beside your code
4. If the `.docs.md` file doesn't exist, it will be created automatically
5. Edit the documentation file and see changes in real-time

## Documentation File Structure

- **File docs**: `filename.ext.docs.md` (e.g., `user.service.ts.docs.md`)
- **Module docs**: `modulename.module.docs.md` (e.g., `user.module.docs.md`)

## Breadcrumb Navigation

The breadcrumb at the top of the docs panel shows your file's location:

```
workspace › src › modules › user › user.service.ts
```

Click on any folder to view module-level documentation.

## Development

### Prerequisites

- Node.js 16+
- VS Code 1.75+

### Building

```bash
npm install
npm run compile
```

### Running

Press `F5` in VS Code to open an Extension Development Host

### Packaging

```bash
npm install -g @vscode/vsce
vsce package
```

This will create a `.vsix` file that can be installed in VS Code.

## License

MIT
