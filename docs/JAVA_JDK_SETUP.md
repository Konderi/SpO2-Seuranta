# Java/JDK Setup for VS Code

## Problem
VS Code Java extension requires JDK 17 or higher, showing error:
```
JDK 17 or higher is required. Please set a valid Java home path to 'java.jdt.ls.java.home' setting or JAVA_HOME environment variable.
```

## Solution (macOS)

### 1. Using Android Studio's Bundled JDK (Recommended)

Android Studio comes with JDK 21, which is perfect for development.

**JDK Location:**
```bash
/Applications/Android Studio.app/Contents/jbr/Contents/Home
```

### 2. Configure VS Code

Created `.vscode/settings.json` with:

```json
{
  "java.jdt.ls.java.home": "/Applications/Android Studio.app/Contents/jbr/Contents/Home",
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-21",
      "path": "/Applications/Android Studio.app/Contents/jbr/Contents/Home",
      "default": true
    }
  ],
  "java.import.gradle.java.home": "/Applications/Android Studio.app/Contents/jbr/Contents/Home"
}
```

### 3. Configure Shell Environment

Added to `~/.zshrc`:

```bash
# Java Configuration for Android Development
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```

**Apply changes:**
```bash
source ~/.zshrc
```

### 4. Verify Installation

```bash
# Check JAVA_HOME
echo $JAVA_HOME
# Output: /Applications/Android Studio.app/Contents/jbr/Contents/Home

# Check Java version
java -version
# Output: openjdk version "21.0.9" 2025-10-21

# Check Java home
/usr/libexec/java_home
# Should show Android Studio JDK path
```

## Restart Required

After configuration:
1. **Reload VS Code Window:** 
   - Command Palette (Cmd+Shift+P)
   - Type: "Developer: Reload Window"
   - Or completely quit and restart VS Code

2. **New Terminal Sessions:**
   - Close all existing terminal tabs
   - Open new terminal to load updated environment

## Verification

After restart, the Java Language Server should start without errors:

1. Open any `.java` file in the project
2. Check VS Code status bar (bottom right)
3. Should show "Java: Ready" or similar
4. No error notifications about Java

## Alternative: Install Oracle JDK or OpenJDK

If you don't have Android Studio or prefer standalone JDK:

### Option A: Homebrew
```bash
# Install OpenJDK 21
brew install openjdk@21

# Link it
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Add to ~/.zshrc
export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```

### Option B: Oracle JDK
1. Download from: https://www.oracle.com/java/technologies/downloads/
2. Install the .dmg file
3. Set JAVA_HOME to the installation path

## Troubleshooting

### Issue: Still shows error after configuration

**Solution 1: Reload VS Code**
```
Cmd+Shift+P → "Developer: Reload Window"
```

**Solution 2: Clear Java workspace**
```bash
# Delete Java workspace cache
rm -rf ~/Library/Application\ Support/Code/User/workspaceStorage/*/
```

**Solution 3: Reinstall Java extension**
1. Uninstall "Extension Pack for Java"
2. Reload VS Code
3. Reinstall extension

### Issue: Command `java` not found

**Solution:**
```bash
# Reload shell configuration
source ~/.zshrc

# Or restart terminal
```

### Issue: Multiple Java versions conflict

**Solution: Use specific version**
```bash
# List all Java installations
/usr/libexec/java_home -V

# Select specific version for current session
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

## Project-Specific Configuration

The `.vscode/settings.json` is project-specific and committed to the repository, so all team members will use the same Java configuration.

**Team members should:**
1. Have Android Studio installed, OR
2. Install JDK 17+ and update `settings.json` with their path

## Files Modified

1. **Created:** `.vscode/settings.json`
   - Java Language Server configuration
   - Gradle configuration
   - Project-specific settings

2. **Modified:** `~/.zshrc`
   - JAVA_HOME environment variable
   - PATH updated to include Java bin

## Success Indicators

✅ No Java-related errors in VS Code  
✅ Java Language Server starts successfully  
✅ Code completion works in .java files  
✅ Import statements resolve correctly  
✅ Gradle tasks can be run from VS Code  
✅ `java -version` shows JDK 21  
✅ `echo $JAVA_HOME` shows correct path  

## Summary

**What was done:**
1. ✅ Identified Android Studio's JDK 21 installation
2. ✅ Created `.vscode/settings.json` with Java path
3. ✅ Updated `~/.zshrc` with JAVA_HOME
4. ✅ Verified Java is accessible from terminal
5. ⏳ **Next: Reload VS Code window to apply changes**

**Status:** Ready to use! Just reload VS Code.

---

**Last Updated:** February 12, 2026  
**JDK Version:** OpenJDK 21.0.9  
**Location:** Android Studio bundled JDK  
**Platform:** macOS
