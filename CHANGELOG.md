# Change Log

All notable changes to the "Docky - Documentation Companion" extension will be documented in this file.

## [1.1.17] - 2026-02-13

### Fixed
- 🐛 **Critical Fix:** Module documentation path no longer duplicates "docky" folder
- 🔧 Fixed breadcrumb navigation from within module docs creating incorrect paths
- Before: Clicking folder from module docs created `docky/docky/lib/...`
- After: Correctly creates `docky/lib/...` regardless of starting point
- ✅ Both file docs and module docs now consistently mirror project structure

## [1.1.16] - 2026-02-12

### Fixed
- 🐛 **Critical Fix:** Module documentation now created in `docky/` folder instead of source folder
- 📁 Module docs now mirror exact project structure
- Before: `lib/features/auth/auth.module.docs.md` (in source folder)
- After: `docky/lib/features/auth/auth.module.md` (in docky folder)

### Changed
- 🎨 Module docs filename format: `module-name.module.md` (kebab-case)
- ✨ Both file and module docs now consistently mirror project structure

## [1.1.15] - 2026-02-12

### Documentation
- 📝 Updated README with complete folder structure examples
- 📖 Updated changelog with versions 1.1.12, 1.1.13, and 1.1.14
- 🎯 Clarified that Docky mirrors exact project structure
- ✨ Republished to show updated documentation on marketplace

## [1.1.14] - 2026-02-12

### Changed
- 🔄 **Major:** Docky folder now mirrors exact project structure
- 📁 Changed from simplified categories to full path mirroring
- Before: `lib/features/auth/data/auth_service.dart` → `docky/auth/auth-service.md`
- After: `lib/features/auth/data/auth_service.dart` → `docky/lib/features/auth/data/auth-service.md`
- 🎯 Makes navigation more intuitive and maintains parallel structures

### Documentation
- 📝 Updated README to show new folder structure
- 📖 Updated comments to reflect mirrored structure

## [1.1.13] - 2026-02-12

### Fixed
- 🐛 **Critical Fix:** Included `node_modules` in package to fix `markdown-it` dependency error
- 📦 Fixed `.vscodeignore` excluding all dependencies
- ✅ Extension now works properly when installed from marketplace
- 🔧 Removed redundant activation events as VSCode auto-generates them

### Changed
- 🎨 Updated `when` clause to `resourceScheme == file` for better reliability
- 🧹 Cleaned up debug logging for production release

### Technical
- Removed `node_modules/**` from `.vscodeignore`
- Changed activation to `"*"` for immediate activation
- Package size increased to 3.4 MB (includes markdown-it and dependencies)

## [1.1.12] - 2026-02-12

### Fixed
- 🐛 Attempted to fix command registration issues
- 🔧 Updated when clause and removed redundant activation event

## [1.1.11] - 2026-02-12

### Fixed
- 🐛 **Critical Fix:** Simplified `when` clause to fix command registration issue
- ✅ Changed to simpler `editorTextFocus` context for better compatibility
- 🔧 Added explicit activation event for the command
- ⚡ Extension now activates and registers command properly

### Technical
- Updated `when` clause to: `editorTextFocus`
- Added `onCommand:docky.openDocumentation` to activation events
- Ensures extension activates before command execution

## [1.1.10] - 2026-02-12

### Fixed
- 🐛 **Critical Fix:** Corrected invalid `when` clause that caused "command not found" error
- ✅ Changed from `activeEditor.isReadonly` to proper `editorReadonly` context
- 🔧 Fixed menu contribution to use valid VSCode context keys
- ⚡ Command now properly registers and works as expected

### Technical
- Updated `when` clause to: `resourceScheme == file && !editorReadonly`
- Ensures icon only appears for valid file URIs and non-readonly editors

## [1.1.9] - 2026-02-12

### Fixed
- 🐛 Fixed "No active file to show documentation for" error by adding proper menu conditions
- ✅ Added `when` clause to only show icon when editor is open and not readonly
- 🔒 Added URI scheme validation to ensure documentation only works with file:// URIs
- 🐞 Added debug logging for better troubleshooting

### Changed
- 🎨 Icon now only appears when a valid text file is open
- 📝 Improved error messages for better user experience

## [1.1.8] - 2026-02-12

### Fixed
- 🐛 Fixed "command 'docky.openDocumentation' not found" error by correcting .vscodeignore configuration
- 📦 Ensured all compiled JavaScript files are properly included in published extension package

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
