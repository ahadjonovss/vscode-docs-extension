# 📦 VS Code Marketplace ga Publish qilish

## Tayyorgarlik

### 1. Publisher account yaratish

1. [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage) ga boring
2. Microsoft account bilan login qiling
3. **"Create publisher"** bosing
4. Ma'lumotlarni to'ldiring:
   ```
   Name: Sizning ismingiz
   ID: ahadjonovss (yoki boshqa unique ID)
   ```
5. Saqlang

### 2. Personal Access Token (PAT) olish

1. [Azure DevOps](https://dev.azure.com) ga boring
2. O'ng yuqorida **User Settings** (profil icon) → **Personal Access Tokens**
3. **"+ New Token"** bosing
4. Sozlash:
   - **Name**: `vscode-marketplace-token`
   - **Organization**: `All accessible organizations`
   - **Expiration**: Custom defined (365 days)
   - **Scopes**:
     - ✅ **Marketplace** → **Manage** (tanlang)
5. **Create** bosing
6. ⚠️ **Tokenni copy qiling va xavfsiz joyda saqlang!** (bir marta ko'rinadi)

### 3. vsce o'rnatish (Publishing tool)

```bash
npm install -g @vscode/vsce
```

### 4. package.json ni tekshirish

Quyidagilar to'ldirilgan bo'lishi kerak:

```json
{
  "name": "inline-docs-viewer",
  "displayName": "Inline Documentation Viewer",
  "description": "...",
  "version": "1.0.0",
  "publisher": "ahadjonovss",  // ← Sizning publisher ID
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo"  // ← GitHub repo
  },
  "license": "MIT",
  "icon": "icon.png",  // ← 128x128 PNG icon
  "keywords": [...]
}
```

### 5. README.md yaxshilash

Marketplace da README ko'rsatiladi. Qo'shimcha qiling:
- Screenshots (GIF yoki PNG)
- Features ro'yxati
- Usage instructions
- Installation guide

### 6. Icon yaratish (ixtiyoriy, lekin tavsiya etiladi)

128x128 yoki 256x256 PNG fayl yarating:

```bash
# Icon nomi: icon.png
# O'lcham: 128x128 px yoki 256x256 px
# Format: PNG
```

### 7. LICENSE fayl yaratish

```bash
# MIT License yarating
touch LICENSE
```

LICENSE ichiga:
```
MIT License

Copyright (c) 2026 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 🚀 Publishing qilish

### Varaint 1: Login va publish

```bash
cd ~/Desktop/vscode-docs-extension

# 1. PAT token bilan login qiling
vsce login ahadjonovss
# Token so'raladi - paste qiling (ko'rinmaydi, bu normal)

# 2. Package qilish va publish qilish
vsce publish
```

### Variant 2: Bir buyruqda publish qilish

```bash
vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN
```

### Variant 3: Avval package, keyin publish

```bash
# 1. .vsix fayl yaratish (local test uchun)
vsce package

# 2. Manual ravishda publish qilish
vsce publish -p YOUR_TOKEN
```

## 📈 Version yangilash

Har safar yangilash uchun:

```bash
# Minor version (1.0.0 → 1.1.0)
vsce publish minor

# Patch version (1.0.0 → 1.0.1)
vsce publish patch

# Major version (1.0.0 → 2.0.0)
vsce publish major
```

## ✅ Pre-publish Checklist

Publish qilishdan oldin tekshiring:

- [ ] `npm install` ishlaydimi?
- [ ] `npm run compile` xatosiz tugaydimi?
- [ ] Extension test qilganmisiz (F5)?
- [ ] README.md to'liqmi? (screenshots bilan)
- [ ] package.json da publisher to'g'rimi?
- [ ] LICENSE fayl bormi?
- [ ] Icon bormi (128x128 PNG)?
- [ ] Version to'g'rimi?
- [ ] .vscodeignore sozlanganmi?

## 🔍 Publish qilgandan keyin

### Extension topish

```
https://marketplace.visualstudio.com/items?itemName=ahadjonovss.inline-docs-viewer
```

### VS Code da o'rnatish

1. VS Code da Extensions (Ctrl+Shift+X)
2. "Inline Documentation Viewer" qidiring
3. Install bosing

### Analytics ko'rish

[Marketplace Dashboard](https://marketplace.visualstudio.com/manage/publishers/ahadjonovss)
- Downloads count
- Ratings
- Install statistics

## 🐛 Muammolar va yechimlar

### "Error: Missing publisher name"
```bash
# package.json da publisher qo'shing:
"publisher": "ahadjonovss"
```

### "Error: Not authenticated"
```bash
# Qayta login qiling:
vsce login ahadjonovss
```

### "Error: Extension validation failed"
```bash
# package.json tekshiring:
vsce package --allow-missing-repository
```

### "Icon not found"
```bash
# icon.png yaratish yoki package.json dan olib tashlash:
# "icon": "icon.png" ← bu qatorni o'chiring
```

## 📝 Unpublish qilish

Agar xato publish qilgan bo'lsangiz:

```bash
# Extension o'chirish (EHTIYOT!)
vsce unpublish ahadjonovss.inline-docs-viewer

# Faqat bitta versionni o'chirish
vsce unpublish ahadjonovss.inline-docs-viewer@1.0.0
```

## 🎯 Keyingi qadamlar

1. ✅ Marketplace ga publish qiling
2. 📸 Screenshots va demo GIF qo'shing
3. 📝 Changelog.md yarating
4. 🌟 GitHub da repo yaratib, code push qiling
5. 📢 Twitter/LinkedIn da e'lon qiling
6. 👥 Feedback to'plang va yangilang

## 📚 Qo'shimcha resurslar

- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Marketplace](https://marketplace.visualstudio.com/)

---

**Omad tilaymiz!** 🚀 Extensioningiz minglab developerlar tomonidan ishlatiladi!
