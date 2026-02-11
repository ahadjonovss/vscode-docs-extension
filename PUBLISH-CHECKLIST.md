# 📦 Publishing Checklist

## ✅ Pre-publish Tasks

### 1. Account Setup
- [ ] Create Publisher account: https://marketplace.visualstudio.com/manage
- [ ] Get Personal Access Token (PAT): https://dev.azure.com
  - Scope: **Marketplace → Manage**

### 2. Extension Files
- [x] Icon created: `assets/images/open_doc.png`
- [x] LICENSE file exists
- [x] README.md updated
- [ ] Add screenshots/GIFs to README
- [ ] Create CHANGELOG.md

### 3. package.json Check
- [x] `name`: "docky"
- [x] `publisher`: "ahadjonovss"
- [x] `version`: "1.0.0"
- [x] `icon`: "assets/images/open_doc.png"
- [ ] `repository.url`: Update with actual GitHub repo
- [ ] `bugs.url`: Update with actual GitHub issues
- [ ] `homepage`: Update with actual GitHub homepage

### 4. Code Quality
- [x] TypeScript compiles without errors
- [ ] Test extension (F5)
- [ ] No console errors
- [ ] All features working

### 5. Documentation
- [ ] README with:
  - [ ] Clear description
  - [ ] Installation instructions
  - [ ] Usage examples
  - [ ] Screenshots/GIFs
  - [ ] Features list
- [ ] CHANGELOG with version history

## 🚀 Publishing Steps

### Step 1: Install vsce
```bash
npm install -g @vscode/vsce
```

### Step 2: Login
```bash
vsce login ahadjonovss
# Enter your PAT token
```

### Step 3: Package (Optional - for testing)
```bash
vsce package
# Creates: docky-1.0.0.vsix
# Test install: code --install-extension docky-1.0.0.vsix
```

### Step 4: Publish
```bash
vsce publish
# or with version bump:
vsce publish patch   # 1.0.0 → 1.0.1
vsce publish minor   # 1.0.0 → 1.1.0
vsce publish major   # 1.0.0 → 2.0.0
```

## 📝 TODO Before Publishing

1. **GitHub Repository yaratish**
   ```bash
   cd ~/Desktop/vscode-docs-extension
   git init
   git add .
   git commit -m "Initial commit: Docky extension"
   # GitHub da repo yarating, keyin:
   git remote add origin https://github.com/ahadjonovss/docky.git
   git push -u origin main
   ```

2. **package.json URLlarni yangilash**
   - repository.url → actual GitHub URL
   - bugs.url → GitHub issues URL
   - homepage → GitHub repo URL

3. **Screenshots qo'shish**
   ```
   screenshots/
   ├── demo.gif           # Extension ishlab turgan GIF
   ├── panel.png          # Docs panel screenshot
   └── breadcrumb.png     # Breadcrumb feature
   ```

4. **README ni yaxshilash**
   - Demo GIF qo'shish
   - Feature screenshots
   - Usage examples with Dart code

## 🎯 After Publishing

Extension bu yerda ko'rinadi:
```
https://marketplace.visualstudio.com/items?itemName=ahadjonovss.docky
```

Install command:
```
ext install ahadjonovss.docky
```

## 📊 Analytics

Marketplace dashboard:
```
https://marketplace.visualstudio.com/manage/publishers/ahadjonovss
```

## ⚠️ Important Notes

- **Icon**: Must be 128x128 or 256x256 PNG
- **README**: Will be shown on marketplace page
- **Version**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Keywords**: Help users find your extension
- **Category**: Important for discoverability

## 🔄 Update Workflow

1. Make changes to code
2. Update version in package.json
3. Update CHANGELOG.md
4. Commit and push to GitHub
5. Run: `vsce publish`
