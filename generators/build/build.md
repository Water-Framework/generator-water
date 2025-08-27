# Water Build Generator

The `water:build` generator launches the build process on selected workspace projects with comprehensive dependency management and build ordering.

## Purpose

This generator provides a controlled way to build specific projects in your workspace by:
- Allowing selective project building
- Managing build dependencies and order
- Checking for dependency cycles
- Running tests (optionally)
- Publishing to local Maven repository
- Generating Karaf features (for OSGi projects)

## Usage

### Interactive Mode
```bash
yo water:build
```

### Command Line Options
- `--withTests` - Include test execution during build (default: included)
- `--skipTests` - Skip test execution during build

## Prerequisites
- Must be run within a Water workspace
- Target projects must exist and be properly configured
- Gradle must be available and properly configured

## Interactive Prompts

The generator will prompt you for:

1. **Project Selection**: Choose which projects to build (multiple selection allowed)

## Build Process

### 1. Dependency Cycle Check
Before building, the generator:
- Analyzes project dependencies
- Detects circular dependencies
- Fails fast if cycles are found
- Provides clear error messages about dependency issues

### 2. Build Execution
For each selected project:
- Executes `gradle clean build` (with or without tests)
- Shows build progress and output
- Handles build failures gracefully
- Continues with remaining projects if one fails

### 3. Local Maven Publishing
After successful build:
- Runs `gradle publishToMavenLocal`
- Makes artifacts available to other workspace projects
- Updates local Maven cache

### 4. Karaf Features Generation
For OSGi projects with features configuration:
- Detects `features-src.xml` files
- Runs `gradle generateFeatures`
- Creates Karaf feature descriptors

## Build Configuration

### Test Execution
By default, tests are included in the build. You can control this with:

```bash
# Build with tests (default)
yo water:build

# Build without tests  
yo water:build --skipTests
```

### Build Commands
The generator executes these Gradle commands in sequence:

1. **Clean Build**: `gradle clean build`
   - Or `gradle clean build -x test` if tests are skipped
2. **Local Publish**: `gradle publishToMavenLocal`
3. **Feature Generation**: `gradle generateFeatures` (OSGi projects only)

## Error Handling

### Dependency Cycles
If circular dependencies are detected:
```
[ERROR] Circular dependency detected: ProjectA -> ProjectB -> ProjectC -> ProjectA
```

### Build Failures
For each project that fails to build:
- Shows complete error output
- Continues with remaining projects
- Provides final summary of successes/failures

### Missing Dependencies
If required dependencies are not found:
- Clear error messages about missing artifacts
- Suggestions for build order or dependency resolution

## Build Output

### Success Messages
```
[OK] Build of MyProject completed successfully
[OK] MyProject published to Maven local repository
```

### Feature Generation
For OSGi projects:
```
[INFO] Generating Karaf features for MyProject
[INFO] Features generated successfully
```

## Multi-Project Builds

When building multiple projects:
- Projects are built in dependency order
- Failed projects don't block others
- Final summary shows overall results
- Build time tracking for performance analysis

## Integration with Project Types

### Water Projects
- Standard Water build lifecycle
- Automatic dependency resolution
- Integration with Water modules

### Spring Projects  
- Spring Boot build configuration
- Test execution with Spring context
- JAR/WAR packaging as configured

### OSGi Projects
- Bundle generation
- Karaf feature creation
- OSGi metadata validation

### Quarkus Projects
- Quarkus build pipeline
- Native compilation support (if configured)
- Uber-jar creation

## Performance Considerations

### Build Time Optimization
- Parallel builds where possible
- Incremental compilation
- Dependency caching
- Skip unnecessary tasks when possible

### Resource Management
- Memory allocation for large projects
- Cleanup after build completion
- Temporary file management

## Notes

- Build order respects project dependencies
- Local Maven publishing makes artifacts available to other workspace projects
- Karaf features are only generated for OSGi projects with features configuration
- Test execution can be controlled but is recommended for quality assurance
- Build failures in one project don't prevent building others

## Example Usage

```bash
yo water:build
# Select projects: [MyService, SharedUtils]
# Builds SharedUtils first (dependency), then MyService
# Publishes both to local Maven repository
```