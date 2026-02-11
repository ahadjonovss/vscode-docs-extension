# 🧪 Extension Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
cd ~/Desktop/vscode-docs-extension
npm install
```

### 2. Open in VS Code
```bash
code .
```

### 3. Run Extension (Press F5)
This will open a new VS Code window called **Extension Development Host**

### 4. Open Example Files
In the Extension Development Host window:
```bash
# Open the extension project folder
File → Open Folder → ~/Desktop/vscode-docs-extension

# Navigate to example files:
example/user.service.ts
example/auth/auth.service.ts
```

## ✨ Features to Test

### Feature 1: View Documentation
1. Open `example/user.service.ts`
2. Click the **📖 book icon** in the top-right editor toolbar
3. Documentation panel opens on the right side
4. See the beautiful rendered markdown!

### Feature 2: Breadcrumb Navigation
1. In the docs panel header, you'll see breadcrumb:
   ```
   vscode-docs-extension › example › user.service.ts
   ```
2. Click on **"example"** folder
3. Module documentation opens (`example.module.docs.md` - will be created automatically)

### Feature 3: Live Refresh
1. Keep docs panel open
2. Open the `.docs.md` file (e.g., `user.service.ts.docs.md`)
3. Edit the markdown content
4. Save the file (Cmd+S)
5. **Watch the docs panel update automatically!** ✨

### Feature 4: Auto-Create Docs
1. Create a new file: `example/test.ts`
2. Add some code:
   ```typescript
   export function hello() {
       return "Hello World";
   }
   ```
3. Click the book icon 📖
4. The extension **automatically creates** `test.ts.docs.md` with a template!

### Feature 5: Switch Files
1. Keep docs panel open
2. Switch between `user.service.ts` and `auth/auth.service.ts`
3. **Docs panel automatically updates** to show the relevant documentation!

## 📂 Example Files Included

| File | Description |
|------|-------------|
| `example/user.service.ts` | User management service |
| `example/user.service.ts.docs.md` | Rich documentation with examples |
| `example/auth/auth.service.ts` | Authentication service |
| `example/auth/auth.service.ts.docs.md` | Auth service documentation |
| `example/auth/auth.module.docs.md` | Module-level documentation |

## 🎨 What You'll See

### Beautiful Documentation Features:
- ✅ **Styled headers** (H1, H2, H3...)
- ✅ **Code blocks** with syntax highlighting
- ✅ **Tables** for structured data
- ✅ **Blockquotes** for important notes
- ✅ **Lists** (bulleted and numbered)
- ✅ **Links** (clickable)
- ✅ **Emoji support** 📝 🔑 🎯
- ✅ **VSCode theme colors** (dark/light mode compatible)

## 🐛 Troubleshooting

### Extension doesn't activate?
- Make sure you pressed **F5** to start debugging
- Check the Debug Console for errors

### Book icon doesn't appear?
- Make sure a file is open and focused
- Icon appears in the editor title bar (top-right)

### Docs panel doesn't refresh?
- Check that the `.docs.md` file exists
- Try closing and reopening the panel
- Check the Output panel (View → Output → Extension Host)

### Can't see example files?
- Make sure you opened the correct folder in Extension Development Host
- Navigate to: `~/Desktop/vscode-docs-extension/example/`

## 📦 Building for Production

Once testing is complete:

```bash
# Install packaging tool
npm install -g @vscode/vsce

# Package the extension
vsce package

# Install the .vsix file
# Extensions → ... → Install from VSIX → inline-docs-viewer-1.0.0.vsix
```

## 🎉 Success Checklist

- [ ] Extension runs without errors (F5)
- [ ] Book icon appears in editor toolbar
- [ ] Clicking icon opens docs panel
- [ ] Docs render beautifully with markdown
- [ ] Breadcrumb navigation works
- [ ] Clicking folders opens module docs
- [ ] Editing `.docs.md` files auto-refreshes panel
- [ ] Switching files updates docs panel
- [ ] New files get auto-generated docs templates

Enjoy your new documentation extension! 🚀
