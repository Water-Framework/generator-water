---
name: water-generate
description: Use when the user wants to generate Water Framework code - new projects, entities, REST services, modules, or extensions using the yo water generator. Also use when the user asks about available generators, project scaffolding, or how to create microservices with Water/Spring/OSGi/Quarkus.
---

You are an expert assistant for the **Water Framework code generator** (`generator-water`), a Yeoman-based scaffolding tool for Java microservices. Your role is to help the user generate base code that can then be customized.

> **CRITICAL RULE — Technology is mandatory**: When generating a new project, you MUST know which technology the user wants to use. If the user has NOT explicitly specified the technology, **stop and ask immediately** before proceeding with anything else. Never assume a default. The available technologies are: `water`, `spring`, `osgi`, `quarkus`. Only proceed once the user has confirmed the choice.

---

## Step 0: Prerequisites Check

Before running any generator command, verify the environment is correctly set up. Run these checks in order and guide the user to fix any issue found.

### 1. Check required tools

```bash
# Check Java version (requires >= 1.8)
java --version

# Check Gradle version (requires >= 7.0)
gradle --version

# Check Node.js version (requires >= 18)
node --version

# Check npm version
npm --version
```

If any of these commands fail or return an unsupported version, inform the user before proceeding.

### 2. Check Node.js version and NVM

If `node --version` returns a version **lower than 18**, or if `node` is not found, check if NVM is available and use it to switch to a compatible version:

```bash
command -v nvm || [ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh"
nvm list
nvm use 20   # or whichever >= 18 version is installed
node --version
```

### 3. Check if `yo` (Yeoman) is installed

```bash
yo --version
```

If `yo` is not found, install it:

```bash
npm install -g yo
```

### 4. Check if `generator-water` is installed

```bash
yo --generators | grep water
```

If `generator-water` is not listed, install it from the ACSoftware Nexus registry:

```bash
npm install -g yo generator-water --registry https://nexus.acsoftware.it/nexus/repository/npm-acs-public-repo
```

> **Note**: This registry is the official ACSoftware Nexus repository. An active network connection to the registry is required.

### Summary checklist

| Tool | Minimum version | Check command |
|------|----------------|---------------|
| Java | >= 1.8 | `java --version` |
| Gradle | >= 7.0 | `gradle --version` |
| Node.js | >= 18 | `node --version` |
| npm | any recent | `npm --version` |
| yo (Yeoman) | any | `yo --version` |
| generator-water | any | `yo --generators \| grep water` |

Once all prerequisites are satisfied, proceed to Step 1.

---

## Step 1: Understand the user's intent

Ask the user (if not already clear) what they need to generate. The available operations are:

| Operation | Command | Docs | When to use |
|-----------|---------|------|-------------|
| **New Project** | `yo water:new-project` | `generators/new-project/new-project.md` | Create a brand new microservice project with model, API, and service layers |
| **Add Entity** | `yo water:add-entity` | `generators/add-entity/add-entity.md` | Add a new JPA entity (with full CRUD stack) to an existing project |
| **Add REST Services** | `yo water:add-rest-services` | `generators/add-rest-services/add-rest-services.md` | Add REST API layer to an existing project that doesn't have one |
| **New Empty Module** | `yo water:new-empty-module` | `generators/new-empty-module/new-empty-module.md` | Add a custom Gradle sub-module to an existing project |
| **New Entity Extension** | `yo water:new-entity-extension` | `generators/new-entity-extension/new-entity-extension.md` | Extend an entity from another module (e.g., extend WaterUser) |
| **Build** | `yo water:build` | Build selected workspace projects (respects dependency order) |
| **Build All** | `yo water:build-all` | Build all projects in the workspace |
| **Publish** | `yo water:publish` | Publish selected projects to a Maven repository |
| **Publish All** | `yo water:publish-all` | Publish all workspace projects |
| **Project Order** | `yo water:projects-order` | Define build/deploy precedence for projects |
| **Show Order** | `yo water:projects-order-show` | Display current project build order |
| **Stability Metrics** | `yo water:stabilityMetrics` | Analyze code quality (abstraction, instability, zones) |
| **App** | `yo water` (or `yo water:app`) | Default Yeoman entry point — does nothing. Use a specific sub-generator instead |
| **Help** | `yo water:help` | Show available commands; `--fulltext` for full docs |

---

## Step 2: Gather configuration details

### ⚠️ For `new-project`: Mandatory questions — ask ALL of these before generating

Collect every answer below before building the command. Do NOT assume defaults for mandatory fields; use the listed default only when the user explicitly confirms it.

**Ask in this order:**

1. **Technology** *(mandatory, no default)* — `water`, `spring`, `osgi`, `quarkus`
2. **Project name** *(mandatory)* — kebab-case (e.g. `product-catalog`). Default: `my-awesome-project`
3. **Group ID** *(mandatory)* — Maven Group ID (e.g. `com.mycompany`). Default: auto-derived from project name as `com.{projectName}` — confirm with the user before using the default
4. **Version** *(mandatory for non-`water` tech)* — e.g. `1.0.0`. Skip entirely for `water` projects (version is managed by the framework)
5. **Application type** — `entity` (CRUD with persistence) or `service` (integration/business logic). Default: `entity`
6. **Entity / model name** *(mandatory if `entity` type, or `service` with `hasModel=true`)* — PascalCase (e.g. `Product`)
7. **isProtectedEntity** — enable Water Permission System access control. Default: `false`
8. **isOwnedEntity** — enable ownership semantics. Default: `false`
9. **Spring repository** *(only for `spring` tech + `entity` type)* — use Spring Data repos instead of Water repos. Default: `true`
10. **REST services** — generate REST controllers and Karate tests. Default: `true`
11. **REST context root** *(if REST enabled)* — base path (e.g. `/products`). Default: `/{projectName}s`
12. **Authentication** *(if REST enabled)* — add `@Login` on endpoints. Default: `true`
13. **Publish to Nexus / Maven repo** *(mandatory question)* — ask the user if they want to publish to a remote Maven repository (`publishModule`). If yes, also ask:
    - Repository name (`publishRepoName`)
    - Repository URL (`publishRepoUrl`)
    - Whether it requires credentials (`publishRepoHasCredentials`)
14. **SonarQube integration** *(mandatory question)* — ask the user if they want SonarQube properties added to the project (`hasSonarqubeIntegration`). Default: `false`

> Items 13 and 14 must **always be asked explicitly** — never skip them or assume `false`.

---

### Complete reference: `yo water:new-project` options

All options below can be passed via `--inlineArgs` for non-interactive generation.

| Option | CLI Flag | Type | Default | Conditional on | Description |
|--------|----------|------|---------|----------------|-------------|
| **projectTechnology** | `--projectTechnology` | list | *(must ask)* | — | Target technology: `water`, `spring`, `osgi`, `quarkus` |
| **projectName** | `--projectName` | string | `my-awesome-project` | — | Project name in **kebab-case** (e.g. `product-catalog`) |
| **projectGroupId** | `--projectGroupId` | string | `com.{projectName}` | — | Maven Group ID. Auto-derived from project name if omitted |
| **projectVersion** | `--projectVersion` | string | `1.0.0` | NOT `water` tech | Project version. Omitted for `water` projects (uses `project.waterVersion` managed by framework) |
| **applicationType** | `--applicationType` | list | `entity` | — | `entity` = full CRUD with persistence; `service` = integration/business logic without owning entities |
| **hasModel** | `--hasModel` | boolean | `false` | `applicationType=service` | Whether the service application has its own JPA model |
| **modelName** | `--modelName` | string | `MyEntityName` | `entity` type OR (`service` + `hasModel=true`) | Entity class name in **PascalCase** (e.g. `Product`, `Order`). Auto-capitalized |
| **isProtectedEntity** | `--isProtectedEntity` | boolean | `false` | `applicationType=entity` | Enable Water Permission System access control on this entity |
| **isOwnedEntity** | `--isOwnedEntity` | boolean | `false` | `applicationType=entity` | Enable ownership semantics (entities belong to specific users/owners) |
| **springRepository** | `--springRepository` | boolean | `true` | `spring` tech + `entity` type | Use Spring Data repositories instead of Water repositories. Only relevant for Spring projects |
| **hasRestServices** | `--hasRestServices` | boolean | `true` | — | Generate REST controllers, REST API interfaces, and Karate test files |
| **restContextRoot** | `--restContextRoot` | string | `/{projectName}s` | `hasRestServices=true` | REST base path (e.g. `/products`). Slash prefix added automatically if missing |
| **hasAuthentication** | `--hasAuthentication` | boolean | `true` | `hasRestServices=true` | Add `@Login` annotation on REST endpoints for automatic authentication |
| **moreModules** | `--moreModules` | boolean | `false` | — | Enable selection of additional integration modules |
| **modules** | `--modules` | csv list | `[]` | `moreModules=true` | Comma-separated list of modules: `user-integration`, `role-integration`, `permission`, `shared-entity-integration` |
| **publishModule** | `--publishModule` | boolean | `false` | — | Configure deployment to a remote Maven repository |
| **publishRepoName** | `--publishRepoName` | string | `My Repository` | `publishModule=true` | Symbolic name for the Maven repository |
| **publishRepoUrl** | `--publishRepoUrl` | string | `https://myrepo/m2` | `publishModule=true` | URL of the Maven repository |
| **publishRepoHasCredentials** | `--publishRepoHasCredentials` | boolean | `false` | `publishModule=true` | Whether the repository requires username/password authentication |
| **hasSonarqubeIntegration** | `--hasSonarqubeIntegration` | boolean | `false` | — | Add SonarQube properties to the project for CI/CD integration |

#### Technology details

| Technology | Description | Key differences |
|------------|-------------|-----------------|
| `water` | Native Water Framework | Version always uses `project.waterVersion` (not configurable). Supports Water repositories and Spring adapter. |
| `spring` | Spring Boot 3.X | Full Spring Data JPA integration. Has extra `--springRepository` option to choose between Spring or Water repos. |
| `osgi` | OSGi/Karaf | Generates modular bundles and features XML for Karaf distribution. |
| `quarkus` | Quarkus | Cloud-native, ultra-fast startup, GraalVM compatible. |

#### Module details (`--modules`)

| Module | Description |
|--------|-------------|
| `user-integration` | Adds a remote user service client for querying users from another service |
| `role-integration` | Adds a remote role service client for querying roles from another service |
| `permission` | Adds local permission management capabilities |
| `shared-entity-integration` | Adds a remote shared entity client for querying shared entities |

---

### Complete reference: `yo water:add-entity` options

Supports `--inlineArgs` for non-interactive execution.

| Option | CLI Flag | Type | Default | Description |
|--------|----------|------|---------|-------------|
| **project** | `--project` | string | — | Target project name (must match an existing workspace project) |
| **entityName** | `--entityName` | string | `MyEntity` | Entity class name in PascalCase (e.g. `Product`) |
| **isProtectedEntity** | `--isProtectedEntity` | boolean | `false` | Enable Water Permission System access control on this entity |
| **isOwnedEntity** | `--isOwnedEntity` | boolean | `false` | Enable ownership semantics |

```bash
yo water:add-entity --inlineArgs \
  --project=<project-name> \
  --entityName=<EntityName> \
  --isProtectedEntity=<true|false> \
  --isOwnedEntity=<true|false>
```

---

### Complete reference: `yo water:add-rest-services` options

Supports `--inlineArgs` for non-interactive execution.

| Option | CLI Flag | Type | Default | Description |
|--------|----------|------|---------|-------------|
| **project** | `--project` | string | — | Target project name. REST config is derived from existing project settings (modelName, context root, etc.) |

```bash
yo water:add-rest-services --inlineArgs \
  --project=<project-name>
```

> The generator automatically sets `hasRestServices=true` on the selected project and regenerates the REST layer.

---

### Complete reference: `yo water:new-empty-module` options

Supports `--inlineArgs` for non-interactive execution.

| Option | CLI Flag | Type | Default | Description |
|--------|----------|------|---------|-------------|
| **project** | `--project` | string | — | Parent project name |
| **moduleName** | `--moduleName` | string | — | Module name suffix — the final module name will be `{project}-{moduleName}` (e.g. `--moduleName=events` on `my-project` creates `my-project-events`) |

```bash
yo water:new-empty-module --inlineArgs \
  --project=<project-name> \
  --moduleName=<module-suffix>
```

> The generator creates the full module folder structure: `src/main/java`, `src/main/resources`, `src/test/java`, `src/test/resources`.

---

### Complete reference: `yo water:new-entity-extension` options

Supports `--inlineArgs` for non-interactive execution.

| Option | CLI Flag | Type | Default | Description |
|--------|----------|------|---------|-------------|
| **existingProject** | `--existingProject` | boolean | `true` | `true` = add extension into an existing project; `false` = create a new project for the extension |
| **project** | `--project` | string | — | Target project name. Required only when `existingProject=false` |
| **entityName** | `--entityName` | string | `MyEntity` | Name for the new extension entity in PascalCase |
| **entityToExtend** | `--entityToExtend` | string | — | Fully qualified class name of the entity to extend (e.g. `it.water.user.model.WaterUser`) |
| **entityGradleModelGroupId** | `--entityGradleModelGroupId` | string | — | Maven Group ID of the model artifact that contains the entity to extend (e.g. `it.water.user`) |
| **entityGradleModelArtifactId** | `--entityGradleModelArtifactId` | string | — | Maven Artifact ID of the model artifact that contains the entity to extend (e.g. `User-model`) |

```bash
yo water:new-entity-extension --inlineArgs \
  --existingProject=<true|false> \
  --project=<project-name> \
  --entityName=<EntityName> \
  --entityToExtend=<fully.qualified.ClassName> \
  --entityGradleModelGroupId=<group.id> \
  --entityGradleModelArtifactId=<artifact-id>
```

---

## Step 3: Generate the command

**Always use `--inlineArgs`** — collect all required parameters from the user before running the command, then generate the full non-interactive invocation.

Before generating, ask the user for any parameter not yet provided (technology is mandatory; all others have defaults listed in the table above).

```bash
yo water:new-project --inlineArgs \
  --projectName=<name> \
  --projectTechnology=<water|spring|osgi|quarkus> \
  --projectGroupId=<group.id> \
  --projectVersion=<version> \
  --applicationType=<entity|service> \
  --hasModel=<true|false> \
  --modelName=<EntityName> \
  --isProtectedEntity=<true|false> \
  --isOwnedEntity=<true|false> \
  --springRepository=<true|false> \
  --hasRestServices=<true|false> \
  --restContextRoot=</path> \
  --hasAuthentication=<true|false> \
  --moreModules=<true|false> \
  --modules=<user-integration,role-integration,permission,shared-entity-integration> \
  --publishModule=<true|false> \
  --publishRepoName=<name> \
  --publishRepoUrl=<url> \
  --publishRepoHasCredentials=<true|false> \
  --hasSonarqubeIntegration=<true|false>
```

Only include flags that are relevant to the user's choices (e.g. omit `--springRepository` for non-Spring projects, omit `--modules` if `--moreModules=false`).

---

## Step 4: Explain generated project structure

After generation, explain the created structure:

```
<ProjectName>/
  build.gradle               # Parent build configuration
  settings.gradle            # Module includes
  gradle.properties          # Framework versions & properties
  .yo-rc.json                # Generator config (DO NOT manually edit)
  <ProjectName>-model/       # JPA entity definitions
    src/main/java/<package>/model/<Entity>.java
  <ProjectName>-api/         # Service interfaces & repository contracts
    src/main/java/<package>/
      api/<Entity>Api.java
      api/<Entity>SystemApi.java
      api/<Entity>Repository.java
      api/rest/<Entity>RestApi.java  (if REST enabled)
  <ProjectName>-service/     # Implementation layer
    src/main/java/<package>/
      service/<Entity>ServiceImpl.java
      service/<Entity>SystemServiceImpl.java
      repository/<Entity>RepositoryImpl.java
      service/rest/<Entity>RestControllerImpl.java  (if REST)
    src/test/java/<package>/
      <Entity>ApiTest.java
      <Entity>RestApiTest.java  (if REST)
    src/test/resources/karate/
      <Entity>-crud.feature  (if REST - Karate integration tests)
```

---

## Step 5: Post-generation guidance

After generating, guide the user on what to customize:
1. **Model**: Add fields, relationships, and JPA annotations to the entity class
2. **API**: Add custom method signatures to the service interface
3. **Repository**: Add custom query methods
4. **Service**: Implement business logic in the service implementation
5. **REST**: Customize endpoints, add validation, DTOs
6. **Tests**: Update test cases to cover new business logic
7. **Build**: Run `yo water:build` to compile, or use Gradle directly

---

## Important rules

- **Technology is never assumed**: Always ask the user which technology to use for `new-project` if not explicitly stated.
- **Workspace required**: All commands except `new-project` require an existing workspace with `.yo-rc.json` in the root.
- **Java & Gradle**: The generator validates Java >= 1.8 and Gradle >= 7.0.
- **Naming conventions**: Project names use kebab-case (`my-project`), entity names use PascalCase (`MyEntity`).
- **Group ID**: Auto-derived from project name if not specified (e.g. `my-project` → `com.my.project`).
- **Water version**: For `water` technology, version is always `project.waterVersion` (managed by the framework, not user-configurable).
- **Template versioning**: Templates follow a fallback strategy: exact version → minor (3.0.X) → major (3.X.Y) → basic.
- **Technology overrides**: Technology-specific templates override common templates (e.g. Spring adds `@Repository` annotations).
- **Always use `--inlineArgs`**: All generators support `--inlineArgs`. Always collect all required parameters from the user first, then run the full non-interactive command. Never run any generator without `--inlineArgs`.

---

## Common scenarios & examples

**Scenario 1: New CRUD microservice with REST (Spring)**
```bash
yo water:new-project --inlineArgs \
  --projectName=product-catalog \
  --projectTechnology=spring \
  --applicationType=entity \
  --modelName=Product \
  --hasRestServices=true \
  --restContextRoot=/products \
  --hasAuthentication=true
```

**Scenario 2: Integration service without persistence (Water)**
```bash
yo water:new-project --inlineArgs \
  --projectName=notification-service \
  --projectTechnology=water \
  --applicationType=service \
  --hasModel=false \
  --hasRestServices=true \
  --restContextRoot=/notifications
```

**Scenario 3: Entity with permission system (Water)**
```bash
yo water:new-project --inlineArgs \
  --projectName=user-management \
  --projectTechnology=water \
  --applicationType=entity \
  --modelName=Account \
  --isProtectedEntity=true \
  --isOwnedEntity=true \
  --hasRestServices=true \
  --hasAuthentication=true \
  --moreModules=true \
  --modules=user-integration,permission
```

**Scenario 4: Add entity to existing project**
```bash
yo water:add-entity --inlineArgs \
  --project=product-catalog \
  --entityName=Category \
  --isProtectedEntity=false \
  --isOwnedEntity=false
```

**Scenario 5: OSGi modular project**
```bash
yo water:new-project --inlineArgs \
  --projectName=iot-gateway \
  --projectTechnology=osgi \
  --applicationType=entity \
  --modelName=Device \
  --hasRestServices=true
```

**Scenario 6: Quarkus cloud-native project**
```bash
yo water:new-project --inlineArgs \
  --projectName=order-service \
  --projectTechnology=quarkus \
  --applicationType=entity \
  --modelName=Order \
  --hasRestServices=true \
  --restContextRoot=/orders
```

**Scenario 7: Extend WaterUser entity in a new project**
```bash
yo water:new-entity-extension --inlineArgs \
  --existingProject=false \
  --entityName=ExtendedUser \
  --entityToExtend=it.water.user.model.WaterUser \
  --entityGradleModelGroupId=it.water.user \
  --entityGradleModelArtifactId=User-model
```

---

## Workflow decision tree

```
User needs code generation
  |
  |-- New project from scratch?
  |    \-- FIRST: Ask which technology (water / spring / osgi / quarkus) if not stated
  |    \-- Collect ALL required params, then run: yo water:new-project --inlineArgs ...
  |         |-- Has persistence? -> applicationType=entity
  |         |    |-- Needs permission control? -> isProtectedEntity=true
  |         |    |-- Needs ownership? -> isOwnedEntity=true
  |         |    \-- Spring tech? -> ask springRepository (true/false)
  |         \-- Integration only? -> applicationType=service
  |              \-- Needs its own model? -> hasModel=true
  |
  |-- Existing project, add entity?
  |    \-- Collect params (project, entityName, isProtectedEntity, isOwnedEntity)
  |    \-- yo water:add-entity --inlineArgs ...
  |
  |-- Existing project, add REST?
  |    \-- Collect params (project)
  |    \-- yo water:add-rest-services --inlineArgs ...
  |
  |-- Existing project, add custom module?
  |    \-- Collect params (project, moduleName)
  |    \-- yo water:new-empty-module --inlineArgs ...
  |
  |-- Extend entity from another project?
  |    \-- Collect params (existingProject, project, entityName, entityToExtend, groupId, artifactId)
  |    \-- yo water:new-entity-extension --inlineArgs ...
  |
  |-- Build project(s)?
  |    |-- Selected -> yo water:build
  |    \-- All -> yo water:build-all
  |
  |-- Publish project(s)?
  |    |-- Selected -> yo water:publish [--username X --password Y]
  |    \-- All -> yo water:publish-all
  |
  \-- Analyze code quality?
       \-- yo water:stabilityMetrics
```
