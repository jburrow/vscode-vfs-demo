# Debugging Guide - F5 Extension Launch

This guide explains how to debug and run your Virtual File System extension in VS Code.

## 🚀 **Fixed Issues:**

✅ **Launch Configuration** - Fixed task references  
✅ **Build Tasks** - Proper TypeScript compilation  
✅ **Activation Events** - Extension activates on startup  
✅ **Debug Logging** - Added console output for troubleshooting  
✅ **Source Maps** - Enabled for debugging TypeScript  

## 🛠️ **How to Launch (F5):**

### **Method 1: Press F5**
1. **Open** `src/extension.ts` (or any file in the project)
2. **Press F5** - This will:
   - Build the extension automatically
   - Launch a new VS Code window (Extension Development Host)
   - Load your extension in the new window

### **Method 2: Debug Panel**
1. **Open Debug Panel** (`Ctrl+Shift+D`)
2. **Select** "Run Extension" from dropdown
3. **Click** the green play button ▶️

### **Method 3: Command Palette**
1. **Open Command Palette** (`Ctrl+Shift+P`)
2. **Type** "Debug: Start Debugging"
3. **Select** "Run Extension"

## 🎯 **What Should Happen:**

### **1. Build Process:**
```
> pnpm run compile
> virtual-file-system@0.0.1 compile
> tsc -p ./
```

### **2. New VS Code Window Opens:**
- **Title**: `[Extension Development Host]`
- **Your extension loads automatically**
- **Shows activation message**: "Virtual File System extension activated!"

### **3. Console Output (Developer Tools):**
```
Virtual File System extension is now active!
FileSystemProvider registered for vfs:// scheme
Commands and providers registered
```

## 🧪 **Testing Your Extension:**

### **In the Extension Development Host:**

1. **Open Command Palette** (`Ctrl+Shift+P`)
2. **Type** "Mount Virtual File System"
3. **Select** the command
4. **Should see**: "Virtual File System mounted successfully!"
5. **Check Explorer**: Files under `vfs://` scheme

### **Available Commands:**
- `VFS: Mount Virtual File System` - Mounts the virtual file system

## 🔧 **Available Debug Configurations:**

### **1. Run Extension** (Default)
- Standard debugging with all extensions enabled
- Best for normal development

### **2. Run Extension (Development)**
- Disables other extensions for cleaner testing
- Use when you suspect extension conflicts

### **3. Extension Tests**
- Runs your test suite (when you add tests)

## 📂 **Project Structure Check:**

Your extension should have:
```
📁 .vscode/
  📄 launch.json     ✅ Fixed task references
  📄 tasks.json      ✅ Build tasks configured
  📄 settings.json   ✅ TypeScript settings
📁 src/
  📄 extension.ts    ✅ Main extension code
  📄 virtualFileSystemProvider.ts ✅ FileSystem implementation
📁 out/
  📄 extension.js    ✅ Compiled output
  📄 *.js.map        ✅ Source maps
📄 package.json      ✅ Extension manifest
```

## 🐛 **Troubleshooting:**

### **F5 Doesn't Work:**
1. **Check Build Errors**: Look at Problems panel
2. **Compile Manually**: `pnpm run compile`
3. **Check Tasks**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Build Extension"

### **Extension Doesn't Activate:**
1. **Check Console**: `Help` → `Toggle Developer Tools` → `Console`
2. **Look for Error Messages**: Red errors in console
3. **Check package.json**: Verify `main` field points to `./out/extension.js`

### **Command Not Found:**
1. **Check package.json**: Verify command is in `contributes.commands`
2. **Check Activation**: Extension should show activation message
3. **Reload Window**: `Ctrl+Shift+P` → "Developer: Reload Window"

### **Files Not Accessible:**
1. **Try Mount Command**: Should register file system
2. **Check URI**: Use `vfs://` scheme
3. **Look at FileSystemProvider**: Check for initialization errors

## 📊 **Debug Output Locations:**

### **1. VS Code Output Panel:**
- **View** → **Output** → Select "Extension Host"

### **2. Developer Tools Console:**
- **Help** → **Toggle Developer Tools** → **Console** tab

### **3. Debug Console:**
- Available when debugging is active

## 🚀 **Ready to Debug!**

Your extension is now properly configured for F5 debugging. When you press F5:

1. ✅ **Builds automatically** using the "Build Extension" task
2. ✅ **Launches Extension Development Host** 
3. ✅ **Activates your extension** with `*` activation event
4. ✅ **Shows activation message** 
5. ✅ **Registers VFS provider** for `vfs://` scheme
6. ✅ **Ready for testing** with mount command

**Just press F5 and start developing!** 🎯
