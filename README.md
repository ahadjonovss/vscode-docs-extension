# 📖 Inline Documentation Viewer

> Keep your code documentation organized and accessible with beautiful side-by-side markdown viewing

A powerful VS Code extension that helps you maintain comprehensive documentation alongside your code files with automatic file creation, live refresh, and intuitive breadcrumb navigation.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-1.75%2B-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 📚 Side-by-Side Documentation
View beautifully rendered markdown documentation in a panel right beside your code. No more switching between files or losing context!

### 🔍 Smart Auto-Creation
Automatically creates `.docs.md` files with intelligent templates based on file type:
- **Services** get service-specific templates
- **Controllers** get API-focused templates
- **Models** get data structure templates
- And more...

### 🧭 Breadcrumb Navigation
Navigate your project structure effortlessly. Click any folder in the breadcrumb to view module-level documentation:
```
workspace › src › modules › user › user.service.ts
            ↑ Click to view module docs
```

### 🔄 Live Refresh
Edit your `.docs.md` files and watch the documentation panel update in real-time. No manual refresh needed!

### 🎨 Beautiful Rendering
- VSCode-themed styling (works in dark and light modes)
- Syntax-highlighted code blocks
- Tables, lists, blockquotes, and more
- Emoji support 🎉

### 🌍 Language Agnostic
Works with **any programming language**:
- TypeScript/JavaScript
- Python
- Java
- Go
- Rust
- And literally any other language!

## 🚀 Quick Start

### Installation

**From VS Code Marketplace:**
1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. Search for "Inline Documentation Viewer"
4. Click **Install**

**From VSIX file:**
```bash
code --install-extension inline-docs-viewer-1.0.0.vsix
```

### Usage

1. **Open any code file** in VS Code
2. **Click the 📖 book icon** in the editor title bar (top-right)
3. **Documentation panel opens!**
   - If `.docs.md` doesn't exist, it's created automatically with a helpful template
4. **Edit the docs** and watch them update live
5. **Click breadcrumb folders** to view module documentation

## 📝 Documentation File Structure

The extension uses a simple, predictable naming convention:

| Source File | Documentation File |
|-------------|-------------------|
| `user.service.ts` | `user.service.ts.docs.md` |
| `auth.controller.js` | `auth.controller.js.docs.md` |
| `models/user.py` | `models/user.py.docs.md` |
| **Module** | `modulename.module.docs.md` |

## 🎯 Use Cases

### For Individual Developers
- Document complex logic for future you
- Add usage examples right next to implementation
- Keep notes about design decisions
- Track TODOs and known issues

### For Teams
- Onboard new team members faster
- Create living documentation that stays up-to-date
- Share implementation details without cluttering code
- Document APIs, services, and utilities

### For Open Source
- Provide comprehensive guides for contributors
- Document module architecture
- Explain design patterns and trade-offs
- Create better README-style docs for each component

## 🖼️ Screenshots

<!-- TODO: Add screenshots/GIFs here before publishing -->

**Documentation Panel:**
![Documentation Panel](screenshots/docs-panel.png)

**Breadcrumb Navigation:**
![Breadcrumb](screenshots/breadcrumb.png)

**Auto-Generated Template:**
![Template](screenshots/template.png)

## 🛠️ Development

### Prerequisites
- Node.js 16+
- VS Code 1.75+

### Building from Source

```bash
# Clone repository
git clone https://github.com/yourusername/inline-docs-viewer
cd inline-docs-viewer

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in development mode
# Press F5 in VS Code to start Extension Development Host
```

### Project Structure

```
vscode-docs-extension/
├── src/
│   ├── extension.ts                  # Main entry point
│   ├── DocumentationPanelManager.ts  # Panel lifecycle management
│   ├── DocsFileHelper.ts             # File operations & templates
│   ├── BreadcrumbBuilder.ts          # Navigation UI
│   └── FileWatcher.ts                # Auto-refresh logic
├── example/                          # Example files for testing
├── package.json                      # Extension manifest
└── tsconfig.json                     # TypeScript config
```

### Running Tests

```bash
npm test
```

### Packaging

```bash
npm install -g @vscode/vsce
vsce package
```

## 📦 Publishing

See [PUBLISHING-GUIDE.md](PUBLISHING-GUIDE.md) for detailed instructions on publishing to VS Code Marketplace.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [markdown-it](https://github.com/markdown-it/markdown-it)
- Inspired by the need for better code documentation practices
- Thanks to the VS Code extension API team

## 📞 Support

- 🐛 [Report Issues](https://github.com/yourusername/inline-docs-viewer/issues)
- 💡 [Request Features](https://github.com/yourusername/inline-docs-viewer/issues)
- ⭐ [Star on GitHub](https://github.com/yourusername/inline-docs-viewer)

---

**Made with ❤️ for developers who care about documentation**
