# Water New Project Generator

The `water:new-project` generator scaffolds a complete Water Framework microservice project with model, API, service, and optional REST layers.

## Usage

```bash
yo water:new-project --inlineArgs [options...]
```

Use `--inlineArgs` to skip all interactive prompts. Collect all required parameters before running the command.

## Available Arguments

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--projectName` | string | `my-awesome-project` | Project name in kebab-case (e.g. `product-catalog`) |
| `--projectTechnology` | string | `water` | Target technology: `water`, `spring`, `osgi`, `quarkus` |
| `--projectGroupId` | string | auto-derived | Maven Group ID. Auto-derived from project name as `com.{projectName}` if omitted |
| `--projectVersion` | string | `1.0.0` | Project version. Ignored for `water` projects (version managed by framework) |
| `--applicationType` | string | `entity` | `entity` = CRUD with persistence; `service` = integration without own entities |
| `--hasModel` | boolean | `false` | Whether a `service` project defines its own JPA model |
| `--modelName` | string | `MyEntityName` | Entity class name in PascalCase. Required for `entity` type or `service` with `hasModel=true` |
| `--isProtectedEntity` | boolean | `false` | Enable Water Permission System access control on the entity |
| `--isOwnedEntity` | boolean | `false` | Enable ownership semantics (entities belong to specific users/owners) |
| `--springRepository` | boolean | `true` | Use Spring Data repositories instead of Water repositories. Spring tech + entity type only |
| `--hasRestServices` | boolean | `true` | Generate REST controllers, REST API interfaces, and Karate test files |
| `--restContextRoot` | string | `/{projectName}s` | REST base path (e.g. `/products`). Slash prefix added automatically if missing |
| `--hasAuthentication` | boolean | `true` | Add `@Login` annotation on REST endpoints for automatic authentication |
| `--moreModules` | boolean | `false` | Enable selection of additional integration modules |
| `--modules` | string (csv) | — | Comma-separated modules: `user-integration`, `role-integration`, `permission`, `shared-entity-integration` |
| `--publishModule` | boolean | `false` | Configure deployment to a remote Maven repository |
| `--publishRepoName` | string | `My Repository` | Symbolic name for the Maven repository |
| `--publishRepoUrl` | string | `https://myrepo/m2` | URL of the Maven repository |
| `--publishRepoHasCredentials` | boolean | `false` | Whether the repository requires username/password authentication |
| `--hasSonarqubeIntegration` | boolean | `false` | Add SonarQube properties to the project for CI/CD integration |

## Examples

### Water CRUD project with REST
```bash
yo water:new-project --inlineArgs \
  --projectName=home-library \
  --projectTechnology=water \
  --projectGroupId=it.acsoftware.library \
  --applicationType=entity \
  --modelName=Book \
  --isProtectedEntity=true \
  --isOwnedEntity=true \
  --hasRestServices=true \
  --restContextRoot=/books \
  --hasAuthentication=true \
  --publishModule=true \
  --publishRepoName="ACSoftware Nexus" \
  --publishRepoUrl=https://nexus.acsoftware.it/nexus/repository/maven-releases \
  --publishRepoHasCredentials=true \
  --hasSonarqubeIntegration=true
```

### Spring project with permission and modules
```bash
yo water:new-project --inlineArgs \
  --projectName=user-management \
  --projectTechnology=spring \
  --projectGroupId=com.mycompany.users \
  --projectVersion=1.0.0 \
  --applicationType=entity \
  --modelName=User \
  --isProtectedEntity=true \
  --hasRestServices=true \
  --hasAuthentication=true \
  --moreModules=true \
  --modules=user-integration,permission
```

### Integration service without persistence
```bash
yo water:new-project --inlineArgs \
  --projectName=notification-service \
  --projectTechnology=water \
  --applicationType=service \
  --hasModel=false \
  --hasRestServices=true \
  --restContextRoot=/notifications
```

### OSGi modular project
```bash
yo water:new-project --inlineArgs \
  --projectName=iot-gateway \
  --projectTechnology=osgi \
  --applicationType=entity \
  --modelName=Device \
  --hasRestServices=true
```

## Notes

- Boolean arguments accept `true`/`false` values
- All conditional logic from the interactive prompts is preserved (e.g. `--springRepository` is ignored for non-Spring projects)
- `--projectGroupId` is auto-derived from the project name if not provided
- For `water` projects, `--projectVersion` is ignored — version is always managed by the framework
- `--modules` values must be comma-separated without spaces