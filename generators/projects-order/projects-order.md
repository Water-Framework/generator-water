# Water Projects Order Generator

The `water:projects-order` generator defines the precedence and dependency order for building and deploying workspace projects.

## Purpose

This generator manages project build order by:
- Defining explicit project dependencies and precedence
- Configuring build and deployment sequences
- Managing complex inter-project relationships
- Optimizing build performance through proper ordering

## Usage

### Interactive Mode
```bash
yo water:projects-order
```

## Prerequisites
- Must be run within a Water workspace
- Multiple projects should exist in the workspace
- Understanding of project dependencies is recommended

## Interactive Configuration

The generator provides an interface to:
- View current project dependencies
- Define build precedence rules
- Set deployment order
- Configure parallel build opportunities

## Project Dependencies

### Dependency Types

#### Build Dependencies
Projects that must be built before others:
```
CoreUtils → BusinessLogic → WebAPI
```

#### Runtime Dependencies
Projects that depend on others at runtime but can build independently:
```
ServiceA ← ConfigService (runtime only)
```

#### Test Dependencies
Projects needed only for testing:
```
IntegrationTests → All Services (test only)
```

## Configuration Management

### Build Order Configuration
Stored in workspace `.yo-rc.json`:
```json
{
  "projectsOrder": {
    "buildOrder": [
      "SharedUtils",
      "CoreServices", 
      "BusinessLogic",
      "WebAPI",
      "IntegrationTests"
    ],
    "deployOrder": [
      "SharedUtils",
      "CoreServices",
      "WebAPI", 
      "BusinessLogic"
    ],
    "parallelGroups": [
      ["BusinessLogic", "ReportingService"],
      ["WebAPI", "AdminAPI"]
    ]
  }
}
```

### Dependency Graph
Visual representation of dependencies:
```
SharedUtils
    ├── CoreServices
    │   ├── BusinessLogic
    │   └── ReportingService
    └── WebAPI
        └── AdminAPI
```

## Build Optimization

### Parallel Builds
Define groups of projects that can build simultaneously:
- Projects with no interdependencies
- Independent service modules
- Utility libraries with no shared components

### Sequential Requirements
Enforce strict ordering for:
- Database migration projects
- Configuration services
- Core infrastructure components

## Use Cases

### Complex Microservices
```
1. DatabaseMigrations (must be first)
2. ConfigService (configuration for others)
3. [UserService, ProductService] (parallel)
4. OrderService (depends on User & Product)
5. WebGateway (depends on all services)
```

### Layered Architecture
```
1. DataAccessLayer
2. BusinessLogicLayer  
3. ServiceLayer
4. PresentationLayer
5. IntegrationTests
```

### Multi-Technology Stack
```
1. SharedJavaLibrary
2. [SpringBootApp, QuarkusApp] (parallel)
3. NodeJSFrontend (depends on APIs)
4. IntegrationSuite
```

## Integration with Build Tools

### Gradle Multi-Project
- Configures `settings.gradle` inclusion order
- Sets up proper `dependencies` blocks
- Enables parallel execution where safe

### Maven Multi-Module
- Configures `pom.xml` module order
- Sets up reactor build sequence
- Manages profile-based builds

## Deployment Coordination

### Rolling Deployments
Define safe deployment order:
1. Database/Infrastructure changes
2. Backend services (in dependency order)  
3. API gateways and proxies
4. Frontend applications
5. Monitoring and logging

### Blue-Green Deployments
Coordinate simultaneous deployments:
- Group compatible services together
- Ensure database compatibility
- Manage service discovery updates

## Validation and Testing

### Dependency Validation
- Checks for circular dependencies
- Validates build order correctness
- Tests parallel build compatibility

### Build Time Optimization
- Measures build times for different orders
- Identifies bottlenecks
- Suggests optimizations

## Command Integration

Other generators respect the configured order:

```bash
# Uses configured build order
yo water:build-all

# Uses configured deployment order  
yo water:publish-all
```

## Advanced Configuration

### Conditional Dependencies
```json
{
  "conditionalDeps": {
    "WebAPI": {
      "condition": "profile=web",
      "dependencies": ["AuthService"]
    }
  }
}
```

### Environment-Specific Orders
```json
{
  "environments": {
    "development": {
      "buildOrder": ["Core", "Web", "Tests"]
    },
    "production": {
      "buildOrder": ["Core", "Web"]
    }
  }
}
```

## Notes

- Project order affects build performance and success
- Circular dependencies are detected and reported
- Configuration is shared across all build/deploy operations
- Order can be environment-specific
- Parallel execution improves overall build times

## Example Session

```bash
yo water:projects-order

Current Projects:
1. SharedUtils
2. UserService  
3. ProductService
4. OrderService
5. WebGateway

Configure build dependencies:
? UserService depends on: [SharedUtils]
? ProductService depends on: [SharedUtils]
? OrderService depends on: [SharedUtils, UserService, ProductService]
? WebGateway depends on: [UserService, ProductService, OrderService]

Parallel build groups:
? Group 1: [UserService, ProductService] ✓
? Group 2: [OrderService] ✓  
? Group 3: [WebGateway] ✓

✓ Project build order configured successfully!
```