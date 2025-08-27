# Water Build All Generator

The `water:build-all` generator launches the build process on ALL workspace projects in proper dependency order.

## Purpose

This generator provides an automated way to build the entire workspace by:
- Building all projects in the workspace
- Automatically determining correct build order based on dependencies
- Managing inter-project dependencies
- Running comprehensive tests across all projects
- Publishing all artifacts to local Maven repository

## Usage

### Interactive Mode
```bash
yo water:build-all
```

### Command Line Options
- `--withTests` - Include test execution during build (default: included)
- `--skipTests` - Skip test execution for faster builds

## Prerequisites
- Must be run within a Water workspace
- All workspace projects must be properly configured
- Gradle must be available and properly configured

## Build Process

### 1. Project Discovery
The generator automatically:
- Scans the workspace for all projects
- Reads project configurations
- Identifies project types and technologies
- Maps inter-project dependencies

### 2. Dependency Resolution
- Analyzes all project dependencies
- Creates build order graph
- Detects and reports circular dependencies
- Fails fast if dependency cycles exist

### 3. Sequential Building
Builds all projects in dependency order:
- Builds dependencies before dependents
- Shows progress for each project
- Handles individual project failures gracefully
- Continues building remaining projects

### 4. Comprehensive Reporting
- Reports build success/failure for each project
- Shows total build time
- Provides summary statistics
- Lists any failed projects with reasons

## Build Order

Projects are built in dependency order:
```
1. SharedUtils (no dependencies)
2. CoreServices (depends on SharedUtils)  
3. WebAPI (depends on CoreServices)
4. IntegrationTests (depends on all)
```

## Error Handling

### Dependency Cycles
```
[ERROR] Cannot build workspace: Circular dependencies detected
ProjectA -> ProjectB -> ProjectC -> ProjectA
```

### Individual Project Failures
- Failed projects are reported but don't stop the overall build
- Dependent projects may fail if their dependencies failed
- Final summary shows all failures with details

### Build Statistics
```
[INFO] Workspace Build Summary:
✓ 8 projects built successfully
✗ 2 projects failed
⏱ Total build time: 3m 45s
```

## What Gets Built

### All Project Types
- **Water Projects**: Full Water framework build lifecycle
- **Spring Projects**: Spring Boot applications and libraries
- **OSGi Projects**: Bundle creation and Karaf features
- **Quarkus Projects**: Quarkus build with optional native compilation

### Generated Artifacts
- JAR/WAR files as appropriate
- OSGi bundles with proper manifests
- Karaf feature descriptors
- Maven POM files
- Test reports and coverage

### Local Maven Repository
All successful builds are published to:
- Local Maven repository (`~/.m2/repository`)
- Available for other workspace projects
- Ready for external consumption

## Performance Optimization

### Parallel Building
Where dependencies allow:
- Independent projects built in parallel
- Reduces overall build time
- Maximizes resource utilization

### Incremental Builds
- Only rebuilds changed projects (when possible)
- Reuses previous build artifacts
- Gradle build cache utilization

### Resource Management
- Memory allocation per project
- Cleanup between project builds
- Temporary file management

## Build Reporting

### Progress Display
```
[INFO] Building workspace projects...
[1/10] Building SharedUtils... ✓ (45s)
[2/10] Building CoreModel... ✓ (32s) 
[3/10] Building UserService... ✗ (failed)
[4/10] Building ProductService... ✓ (28s)
...
```

### Final Summary
```
================================================================================
Workspace Build Complete
================================================================================
Successfully Built:
  ✓ SharedUtils
  ✓ CoreModel  
  ✓ ProductService
  ✓ OrderService

Failed:
  ✗ UserService (compilation error)
  ✗ ReportService (test failures)

Total: 8/10 projects successful
Build Time: 4m 12s
================================================================================
```

## Test Execution

### Default Behavior
- Tests are run for all projects by default
- Test failures cause project build to fail
- Test reports are generated for all projects

### Skip Tests Mode
```bash
yo water:build-all --skipTests
```
- Faster builds for development
- Only compilation and packaging
- No test execution or reporting

## Integration Features

### Karaf Features (OSGi)
For OSGi workspaces:
- Generates features for all OSGi projects
- Creates workspace-wide feature repository
- Handles feature dependencies

### Spring Boot Applications
- Creates executable JAR files
- Handles Spring Boot starters and dependencies
- Generates Spring Boot application properties

### Quarkus Applications
- Builds Quarkus applications
- Optional native compilation
- Creates uber-JAR distributions

## Notes

- This is the recommended way to build complete workspaces
- Build order is automatically calculated from project dependencies
- Individual project failures don't prevent building independent projects
- All successful builds are published to local Maven repository
- Use `water:build` for selective project building instead

## Example Output

```bash
yo water:build-all

@@@  @@@  @@@   @@@@@@   @@@@@@@  @@@@@@@@  @@@@@@@   
     Version: 4.1.3

[INFO] Discovered 10 projects in workspace
[INFO] Checking dependencies...
[INFO] Build order: SharedUtils, CoreModel, UserService, ProductService...
[INFO] Building all workspace projects...

[1/10] SharedUtils... ✓ (1m 23s)  
[2/10] CoreModel... ✓ (45s)
[3/10] UserService... ✓ (2m 15s)
...
[10/10] IntegrationTests... ✓ (3m 44s)

✓ All 10 projects built successfully!
Total time: 12m 34s
```