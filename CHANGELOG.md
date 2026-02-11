# Change Log

All notable changes to the "Inline Documentation Viewer" extension will be documented in this file.

## [1.0.0] - 2026-02-11

### Added
- ✨ Initial release
- 📖 Documentation panel with side-by-side view
- 🧭 Breadcrumb navigation for folder structure
- 📝 Auto-create `.docs.md` files with smart templates
- 🔄 Live refresh when documentation files change
- 🎨 Beautiful markdown rendering with VS Code theming
- 📁 Module-level documentation support
- 🌍 Language-agnostic (works with any file type)
- 🎯 Smart file type detection for template generation
- ⚡ File watcher with debouncing for performance
- 🔒 Secure webview with Content Security Policy

### Features
- Click book icon in editor title bar to open docs
- Automatically creates documentation files if they don't exist
- Clickable breadcrumb to navigate to module documentation
- Real-time updates when editing `.docs.md` files
- Automatic panel updates when switching between files
- Rich markdown templates for different file types (Service, Controller, etc.)

### Technical
- TypeScript implementation
- Modular architecture
- markdown-it for rendering
- Native VS Code theming support
- Efficient file watching
- Single panel instance management

## [Unreleased]

### Planned Features
- [ ] Search within documentation
- [ ] Export documentation to HTML/PDF
- [ ] Custom template support
- [ ] Multi-language support (i18n)
- [ ] Documentation TOC (Table of Contents)
- [ ] Inline code documentation extraction
- [ ] Git integration (show docs for specific commits)
- [ ] Collaboration features (comments, reviews)
