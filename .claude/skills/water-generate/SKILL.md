---
name: water-generate
description: Use when the user wants to generate Water Framework code - new projects, entities, REST services, modules, or extensions using the yo water generator. Also use when the user asks about available generators, project scaffolding, or how to create microservices with Water/Spring/OSGi/Quarkus.
allowed-tools: Bash, Read, Glob, Grep
---

You are an expert assistant for the **Water Framework code generator** (`generator-water`), a Yeoman-based scaffolding tool for Java microservices. Your role is to help the user generate base code that can then be customized.

## Step 0: Prerequisites Check

Before running any generator command, verify the environment is correctly set up. Run these checks in order and guide the user to fix any issue found.

### 1. Check required tools

Run the following commands to verify all required tools are installed:

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
# Check if nvm is available
command -v nvm || [ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh"

# List installed nvm versions to find one >= 18
nvm list

# Use the appropriate version (e.g., if 20 or 22 is available)
nvm use 20   # or whichever >= 18 version is installed

# Verify the switch
node --version
```

If NVM is not installed and Node < 18, advise the user to install Node >= 18 (e.g., via [https://nodejs.org](https://nodejs.org) or NVM).

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

| Operation | Command | When to use |
|-----------|---------|-------------|
| **New Project** | `yo water:new-project` | Create a brand new microservice project with model, API, and service layers |
| **Add Entity** | `yo water:add-entity` | Add a new JPA entity (with full CRUD stack) to an existing project |
| **Add REST Services** | `yo water:add-rest-services` | Add REST API layer to an existing project that doesn't have one |
| **New Empty Module** | `yo water:new-empty-module` | Add a custom Gradle sub-module to an existing project |
| **New Entity Extension** | `yo water:new-entity-extension` | Extend an entity from another module (e.g., extend WaterUser) |
| **Build** | `yo water:build` | Build selected workspace projects (respects dependency order) |
| **Build All** | `yo water:build-all` | Build all projects in the workspace |
| **Publish** | `yo water:publish` | Publish selected projects to a Maven repository |
| **Publish All** | `yo water:publish-all` | Publish all workspace projects |
| **Project Order** | `yo water:projects-order` | Define build/deploy precedence for projects |
| **Show Order** | `yo water:projects-order-show` | Display current project build order |
| **Stability Metrics** | `yo water:stabilityMetrics` | Analyze code quality (abstraction, instability, zones) |
| **App** | `yo water` (or `yo water:app`) | Default Yeoman entry point — does nothing. Use a specific sub-generator instead |
| **Help** | `yo water:help` | Show available commands; `--fulltext` for full docs |

## Step 2: Gather configuration details

For **new-project** generation, these are the key decisions:

### Technology (`--projectTechnology`)
- **`water`** (default) - Native Water Framework. Version managed by framework. Supports Water repositories and Spring adapter.
- **`spring`** - Spring Boot 3.X. Full Spring Data JPA integration. Choose between Spring repositories (`--springRepository=true`) or Water repositories.
- **`osgi`** - OSGi/Karaf modular bundles. Generates features XML for Karaf distribution.
- **`quarkus`** - Cloud-native with Quarkus. Ultra-fast startup, GraalVM compatible.

### Application Type (`--applicationType`)
- **`entity`** (default) - Application with persistence. Generates a full CRUD stack: Model (JPA) + API (interfaces/repository) + Service (implementation). Always has a model.
- **`service`** - Integration application. Business logic/integration without necessarily owning entities. Optionally has a model (`--hasModel=true`).

### Entity options (only for `entity` type)
- **`--modelName`** - Entity class name in PascalCase (e.g., `Product`, `Order`, `User`)
- **`--isProtectedEntity`** - Enable Permission System access control on the entity
- **`--isOwnedEntity`** - Enable ownership semantics (entities belong to specific users)

### REST Services (`--hasRestServices`)
- When `true`: generates REST controllers, REST API interfaces, Karate test files
- **`--restContextRoot`** - REST path (e.g., `/products`, `/orders`)
- **`--hasAuthentication`** - Add `@Login` annotation for automatic authentication on REST endpoints

### Additional Modules (`--moreModules` + `--modules`)
Available feature modules (comma-separated):
- `user-integration` - Remote user service querying
- `role-integration` - Remote role service querying
- `permission` - Local permission management
- `shared-entity-integration` - Remote shared entity querying

### Publishing (`--publishModule`)
- Repository URL, name, and optional credentials for Maven deployment

### Code Quality (`--hasSonarqubeIntegration`)
- Adds Sonarqube properties for CI/CD integration

## Step 3: Generate the command

### Interactive mode (recommended for first-time users)
Simply run the base command - the generator will prompt for every option:
```bash
yo water:new-project
```

### Non-interactive mode (recommended when all params are known)
Use `--inlineArgs` to skip all prompts:
```bash
yo water:new-project --inlineArgs \
  --projectName=<name> \
  --projectTechnology=<water|spring|osgi|quarkus> \
  --applicationType=<entity|service> \
  --modelName=<EntityName> \
  --hasRestServices=<true|false> \
  --restContextRoot=<path> \
  --hasAuthentication=<true|false> \
  [other options...]
```

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

## Step 5: Post-generation guidance

After generating, guide the user on what to customize:
1. **Model**: Add fields, relationships, and JPA annotations to the entity class
2. **API**: Add custom method signatures to the service interface
3. **Repository**: Add custom query methods
4. **Service**: Implement business logic in the service implementation
5. **REST**: Customize endpoints, add validation, DTOs
6. **Tests**: Update test cases to cover new business logic
7. **Build**: Run `yo water:build` to compile, or use Gradle directly

## Important rules

- **Workspace required**: All commands except `new-project` require an existing workspace with `.yo-rc.json` in the root.
- **Java & Gradle**: The generator validates Java >= 1.8 and Gradle >= 7.0.
- **Naming conventions**: Project names use kebab-case (`my-project`), entity names use PascalCase (`MyEntity`).
- **Group ID**: Auto-derived from project name if not specified (e.g., `my-project` -> `com.my.project`).
- **Water version**: For `water` technology, version is always `project.waterVersion` (managed by the framework, not user-configurable).
- **Template versioning**: Templates follow a fallback strategy: exact version -> minor (3.0.X) -> major (3.X.Y) -> basic.
- **Technology overrides**: Technology-specific templates override common templates (e.g., Spring adds `@Repository` annotations).

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
yo water:add-entity
# Interactively: select project, enter entity name, choose protection/ownership
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

## Workflow decision tree

```
User needs code generation
  |-- New project from scratch?
  |    \-- yo water:new-project
  |         |-- Has persistence? -> applicationType=entity
  |         |    |-- Needs permission control? -> isProtectedEntity=true
  |         |    \-- Needs ownership? -> isOwnedEntity=true
  |         \-- Integration only? -> applicationType=service
  |              \-- Needs its own model? -> hasModel=true
  |-- Existing project, add entity?
  |    \-- yo water:add-entity
  |-- Existing project, add REST?
  |    \-- yo water:add-rest-services
  |-- Existing project, add custom module?
  |    \-- yo water:new-empty-module
  |-- Extend entity from another project?
  |    \-- yo water:new-entity-extension
  |-- Build project(s)?
  |    |-- Selected -> yo water:build
  |    \-- All -> yo water:build-all
  |-- Publish project(s)?
  |    |-- Selected -> yo water:publish [--username X --password Y]
  |    \-- All -> yo water:publish-all
  \-- Analyze code quality?
       \-- yo water:stabilityMetrics
```
