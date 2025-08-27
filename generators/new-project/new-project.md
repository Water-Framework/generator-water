# Water New Project Generator - Command Line Arguments

The `water:new-project` generator now supports command-line arguments to skip the interactive prompting phase and run in batch mode.

## Usage

### Interactive Mode (Default)
```bash
yo water:new-project
```
This runs the generator with interactive prompts as before.

### Non-Interactive Mode with Arguments
```bash
yo water:new-project --inlineArgs [options...]
```
When `--inlineArgs` is specified, the generator skips all interactive prompts and uses the provided command-line arguments.

## Available Arguments

### Required/Common Arguments
- `--projectName` - Project name (default: "my-awesome-project")
- `--projectTechnology` - Technology to use: water, spring, osgi, quarkus (default: "water")
- `--applicationType` - Application type: entity, service (default: "entity")

### Optional Arguments
- `--projectGroupId` - Group ID (default: auto-generated from project name)
- `--projectVersion` - Project version (default: "1.0.0", ignored for water projects)
- `--hasModel` - Whether service project has model (default: false)
- `--modelName` - Model name (default: "MyEntityName")
- `--isProtectedEntity` - Whether entity is protected by permission system (default: false)
- `--isOwnedEntity` - Whether entity is an owned entity (default: false)
- `--springRepository` - Use Spring repository instead of Water repositories (default: true)
- `--hasRestServices` - Whether project has REST services (default: true)
- `--restContextRoot` - REST context root path (default: auto-generated)
- `--hasAuthentication` - Add automatic login management (default: true)
- `--moreModules` - Add additional modules (default: false)
- `--modules` - Comma-separated list of modules: user-integration, role-integration, permission, shared-entity-integration
- `--publishModule` - Deploy to remote maven repository (default: false)
- `--publishRepoName` - Repository symbolic name (default: "My Repository")
- `--publishRepoUrl` - Repository URL (default: "https://myrepo/m2")
- `--publishRepoHasCredentials` - Repository requires authentication (default: false)
- `--hasSonarqubeIntegration` - Add Sonarqube integration (default: false)

## Examples

### Create a basic Water project
```bash
yo water:new-project --inlineArgs --projectName=my-service --applicationType=entity
```

### Create a Spring project with custom settings
```bash
yo water:new-project --inlineArgs \
  --projectName=user-management \
  --projectTechnology=spring \
  --applicationType=entity \
  --modelName=User \
  --isProtectedEntity=true \
  --hasRestServices=true \
  --hasAuthentication=true
```

### Create a service project with modules
```bash
yo water:new-project --inlineArgs \
  --projectName=notification-service \
  --applicationType=service \
  --hasModel=true \
  --modelName=Notification \
  --moreModules=true \
  --modules=user-integration,permission
```

### Using arguments in interactive mode
You can also provide arguments in interactive mode to pre-fill the prompts:
```bash
yo water:new-project --projectName=my-project --projectTechnology=spring
```
The prompts will show your provided values as defaults.

## Notes

- Boolean arguments accept `true`/`false` values
- When using `--inlineArgs`, all conditional logic from the interactive prompts is preserved
- The `--projectGroupId` is auto-generated from the project name if not provided
- For Water projects, the version is always managed by the framework
- Module names for `--modules` should be comma-separated without spaces