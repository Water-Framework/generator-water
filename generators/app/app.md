# Water App Generator

The `water:app` generator provides general information about the Water generator framework and performs initial workspace setup and validation.

## Purpose

This generator serves as the foundation for the Water generator system by:
- Displaying the Water framework splash screen and version
- Checking for generator updates
- Validating workspace requirements (Java, Gradle)
- Initializing workspace configuration
- Setting up project linking and dependencies

## Usage

### Interactive Mode
```bash
yo water:app
```

### Command Line Options
- `--skipUpdate` - Skip checking for generator updates
- `--skipWorkspaceCheck` - Skip workspace version validation
- `--taskHelp` - Display detailed help for any generator task

## Prerequisites

### Required Tools
- **Java**: Version 1.8 or higher (JDK 17+ recommended)
- **Gradle**: Version 7.0 or higher
- **Node.js**: For running the Yeoman generators

### Workspace Requirements
- Must be run within a Water workspace directory
- Workspace should contain a `.yo-rc.json` configuration file

## What It Does

### 1. Environment Validation
- Checks Java version and availability
- Verifies Gradle installation and version
- Validates workspace structure

### 2. Version Management
- Displays current Water framework version
- Checks for generator updates (unless `--skipUpdate` is used)
- Synchronizes workspace version with framework version

### 3. Workspace Setup
- Initializes or updates `.yo-rc.json` configuration
- Sets up project linking and dependency management
- Configures workspace-wide settings

### 4. Help System
When used with `--taskHelp`, provides access to detailed documentation for any generator task:
```bash
yo water:new-project --taskHelp
yo water:add-entity --taskHelp
yo water:build --taskHelp
```

## Configuration

The generator manages workspace configuration in `.yo-rc.json`:

```json
{
  "generator-water": {
    "waterVersion": "4.1.3",
    "workspaceTechnology": "water",
    "projects": {
      "MyProject": {
        "projectName": "MyProject",
        "projectPath": "./MyProject",
        "projectTechnology": "water"
      }
    }
  }
}
```

## Version Synchronization

The generator automatically:
- Detects the workspace Water framework version from Gradle
- Updates the generator configuration to match
- Ensures consistency between workspace and generator versions

## Update Checking

By default, the generator checks for updates by:
- Querying the configured distribution repository
- Comparing current version with latest available
- Notifying about available updates (but not auto-updating)

To skip update checks:
```bash
yo water:app --skipUpdate
```

## Error Handling

The generator validates requirements and exits with clear error messages if:
- Java is not installed or is too old
- Gradle is not installed or is incompatible
- Workspace structure is invalid
- Required dependencies are missing

### Common Error Messages

**Java Version Error:**
```
Java is not the correct version (>1.8_X) or is not installed generator will exit...
```

**Gradle Version Error:**
```
Gradle Version, is not the correct version (>= 7.0.x) found X.X or is not installed, generator will exit...
```

## Integration with Other Generators

The `app` generator is automatically composed with other generators, providing:
- Common workspace validation
- Shared configuration management
- Consistent environment setup
- Version compatibility checking

## Splash Screen

Displays the Water framework ASCII art logo with version information:
```
@@@  @@@  @@@   @@@@@@   @@@@@@@  @@@@@@@@  @@@@@@@   
@@@  @@@  @@@  @@@@@@@@  @@@@@@@  @@@@@@@@  @@@@@@@@  
@@!  @@!  @@!  @@!  @@@    @@!    @@!       @@!  @@@  
!@!  !@!  !@!  !@!  @!@    !@!    !@!       !@!  @!@  
@!!  !!@  @!@  @!@!@!@!    @!!    @!!!:!    @!@!!@!   
!@!  !!!  !@!  !!!@!!!!    !!!    !!!!!:    !!@!@!    
!!:  !!:  !!:  !!:  !!!    !!:    !!:       !!: :!!   
:!:  :!:  :!:  :!:  !:!    :!:    :!:       :!:  !:!  
:::: :: :::   ::   :::     ::     :: ::::  ::   :::   
:: :  : :     :   : :     :     : :: ::    :   : :    

         Version: 4.1.3
```

## Notes

- This generator is typically run automatically when using other generators
- Direct execution is useful for workspace validation and setup
- The help system (`--taskHelp`) works with any Water generator task
- Version synchronization ensures workspace and generator compatibility