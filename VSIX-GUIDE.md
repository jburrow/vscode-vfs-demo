# VSIX Packaging Guide

This guide explains how to package and install your Virtual File System extension as a VSIX file.

## 📦 What is a VSIX file?

A VSIX file is a Visual Studio Code extension package that contains all the necessary files to install and run your extension. It's a ZIP archive with a `.vsix` extension that can be:
- Shared with others
- Installed locally
- Published to the VS Code Marketplace
- Stored for backup purposes

## 🛠️ Building and Packaging

### Prerequisites
- Node.js and pnpm installed
- All dependencies installed (`pnpm install`)
- Code compiled successfully (`pnpm run compile`)

### Package Scripts Available

```bash
# Create a production VSIX package
pnpm run package

# Create a pre-release VSIX package
pnpm run package:pre-release

# Publish to VS Code Marketplace (requires setup)
pnpm run publish

# Publish pre-release to marketplace
pnpm run publish:pre-release
```

### Manual Packaging
```bash
# Using npx directly
npx @vscode/vsce package

# With specific version
npx @vscode/vsce package --out virtual-file-system-v1.0.0.vsix

# Pre-release version
npx @vscode/vsce package --pre-release
```

## 📂 Package Contents

Your VSIX includes:
- ✅ Compiled JavaScript (`out/` directory)
- ✅ Package manifest (`package.json`)
- ✅ README and CHANGELOG
- ✅ Extension metadata
- ❌ Source TypeScript files (excluded via `.vscodeignore`)
- ❌ Development dependencies
- ❌ Git files and IDE configurations

## 🚀 Installing the VSIX

### Method 1: VS Code UI
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Click the "..." menu → "Install from VSIX..."
4. Select your `virtual-file-system-0.0.1.vsix` file
5. Restart VS Code if prompted

### Method 2: Command Line
```bash
# Install the VSIX
code --install-extension virtual-file-system-0.0.1.vsix

# List installed extensions
code --list-extensions

# Uninstall if needed
code --uninstall-extension example-publisher.virtual-file-system
```

### Method 3: Command Palette
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Extensions: Install from VSIX..."
3. Select your VSIX file

## 🔧 Troubleshooting

### Common Issues

**Error: "Publisher name required"**
- Solution: Set a valid `publisher` field in `package.json`

**Error: "Repository field missing"**
- Solution: Add repository URL in `package.json` or use `--allow-missing-repository`

**Error: "Icon not found"**
- Solution: Remove icon reference or add a valid PNG icon file

**Large package size**
- Solution: Check `.vscodeignore` to exclude unnecessary files

### Package Validation
```bash
# Check package contents without creating VSIX
npx @vscode/vsce ls

# Validate package.json
npx @vscode/vsce package --dry-run
```

## 📊 Package Information

Current package details:
- **Name**: virtual-file-system
- **Version**: 0.0.1
- **Publisher**: example-publisher
- **Size**: ~50KB (compiled)
- **Files**: Extension code, manifest, documentation

## 🔄 Version Management

To create new versions:

1. Update version in `package.json`:
   ```json
   {
     "version": "0.0.2"
   }
   ```

2. Update `CHANGELOG.md` with new features

3. Repackage:
   ```bash
   pnpm run package
   ```

## 🌐 Publishing to Marketplace

To publish to the VS Code Marketplace:

1. Create a publisher account at https://marketplace.visualstudio.com/
2. Get a Personal Access Token from Azure DevOps
3. Login with vsce:
   ```bash
   npx @vscode/vsce login your-publisher-name
   ```
4. Publish:
   ```bash
   pnpm run publish
   ```

## 🎯 Next Steps

Your extension is now packaged! You can:
- Share the VSIX file with team members
- Install it on multiple machines
- Submit it to the VS Code Marketplace
- Create automated builds in CI/CD pipelines

The VSIX file `virtual-file-system-0.0.1.vsix` is ready to use! 🚀
