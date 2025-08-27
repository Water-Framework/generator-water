# Water Auto Build Generator

The `water:autoBuild` generator provides automated building capabilities with intelligent project detection and dependency resolution.

## Purpose

This generator automates the build process by:
- Automatically detecting changed projects
- Building only what needs to be rebuilt
- Managing incremental builds efficiently
- Providing continuous build monitoring

## Usage

### Interactive Mode
```bash
yo water:autoBuild
```

### Command Line Options
- `--watch` - Enable continuous file watching
- `--incremental` - Only build changed projects
- `--parallel` - Enable parallel building where possible

## Prerequisites
- Must be run within a Water workspace
- Projects should have proper dependency configuration
- Git repository recommended for change detection

## Build Strategies

### Incremental Building
- Detects changes since last successful build
- Only rebuilds affected projects and their dependents
- Maintains build state and timestamps

### Dependency-Aware Building
- Analyzes project dependency graph
- Builds dependencies before dependents
- Skips unchanged projects with unchanged dependencies

### Watch Mode
- Monitors file system for changes
- Triggers builds automatically on file modifications
- Debounces multiple changes to avoid excessive builds

## Change Detection

### File-Based Detection
```
Monitoring:
- Source files (*.java, *.kt, *.scala)
- Configuration files (*.properties, *.yml, *.xml)
- Build files (build.gradle, pom.xml)
- Resource files (*.sql, *.json)
```

### Git-Based Detection
```bash
# Detects changes since last successful build
git diff --name-only HEAD~1 HEAD

# Maps changes to affected projects
src/main/java/com/mycompany/user/ → UserService
```

### Timestamp-Based Detection
- Compares source file modification times
- Checks build artifact timestamps
- Maintains build state database

## Build Optimization

### Smart Dependency Resolution
```
Change in SharedUtils:
├── Rebuild: SharedUtils
├── Rebuild: UserService (depends on SharedUtils)
├── Rebuild: OrderService (depends on UserService)
└── Skip: ProductService (no dependency on SharedUtils)
```

### Parallel Execution
- Identifies independent projects
- Builds non-dependent projects in parallel
- Maximizes CPU and I/O utilization

### Build Caching
- Caches successful build artifacts
- Reuses cached results for unchanged components
- Invalidates cache on dependency changes

## Continuous Monitoring

### Watch Mode Operation
```bash
yo water:autoBuild --watch

[INFO] Starting auto-build in watch mode...
[INFO] Monitoring 15 projects for changes...

[14:32:15] Change detected: src/main/java/com/mycompany/user/User.java
[14:32:15] Triggering build for: UserService
[14:32:18] ✓ UserService built successfully (2.3s)
[14:32:18] Triggering dependent builds...
[14:32:21] ✓ OrderService built successfully (2.8s)
[14:32:21] Build complete. Watching for changes...
```

### Notification System
- Console notifications for build results
- Optional system notifications (desktop/email)
- Integration with IDE build systems
- Webhook notifications for CI/CD integration

## Build State Management

### State Persistence
```json
{
  "lastBuild": "2024-01-15T14:30:22Z",
  "projectStates": {
    "UserService": {
      "lastModified": "2024-01-15T14:25:10Z",
      "lastBuilt": "2024-01-15T14:30:22Z",
      "buildHash": "a1b2c3d4e5f6",
      "status": "SUCCESS"
    }
  },
  "dependencies": {
    "UserService": ["SharedUtils"],
    "OrderService": ["UserService", "SharedUtils"]
  }
}
```

### Build History
- Maintains history of build attempts
- Tracks success/failure patterns
- Provides build duration analytics
- Identifies frequently failing projects

## Error Handling

### Build Failures
```
[14:45:32] ✗ UserService build failed (compilation error)
[14:45:32] Skipping dependent builds: OrderService, WebGateway
[14:45:32] Fix errors and save files to retry automatically
```

### Recovery Strategies
- Automatic retry after file changes
- Incremental error recovery
- Dependency isolation for failures
- Graceful degradation for partial failures

## Performance Analytics

### Build Metrics
```
Auto Build Performance Report:
================================
Total Builds: 47
Success Rate: 94%
Average Build Time: 3.2 seconds
Time Saved (vs full rebuild): 73%

Fastest Builds:
- UtilityService: 0.8s avg
- ConfigService: 1.2s avg

Slowest Builds:  
- IntegrationTests: 12.4s avg
- WebGateway: 8.7s avg

Most Frequent Builds:
- UserService: 12 builds
- OrderService: 8 builds
```

### Optimization Suggestions
```
Recommendations:
1. UserService builds frequently - consider smaller modules
2. IntegrationTests slow - parallelize test execution
3. WebGateway has long compile times - check dependency graph
```

## Integration Features

### IDE Integration
- VSCode extension support
- IntelliJ IDEA plugin compatibility
- Eclipse integration capabilities
- Vim/Emacs editor notifications

### CI/CD Integration
- Jenkins pipeline hooks
- GitHub Actions workflow
- GitLab CI integration
- Custom webhook endpoints

### Development Workflow
```bash
# Start auto-build session
yo water:autoBuild --watch

# Continue development work
# Files saved automatically trigger builds
# Notifications show build results
# Fix errors and continue

# Stop auto-build with Ctrl+C
```

## Configuration

### Auto-Build Settings
```json
{
  "autoBuild": {
    "watchMode": true,
    "incremental": true,
    "parallel": true,
    "notifications": {
      "desktop": true,
      "console": true,
      "webhook": "https://hooks.company.com/builds"
    },
    "excludePatterns": [
      "**/*.tmp",
      "**/target/**",
      "**/build/**"
    ]
  }
}
```

### File Watching
- Configurable file patterns
- Exclude temporary and build files
- Debounce settings for rapid changes
- Resource usage limits

## Notes

- Auto-build is most effective in watch mode during development
- Incremental builds significantly reduce development cycle time
- Dependency analysis ensures correctness while optimizing speed
- Build state is preserved across generator restarts
- Integration with IDEs provides seamless development experience

## Example Session

```bash
yo water:autoBuild --watch --incremental

@@@  Water Auto Build
Version: 4.1.3

[INFO] Analyzing workspace projects...
[INFO] Found 8 projects with 12 dependencies
[INFO] Starting incremental auto-build with file watching

[INFO] Initial build check...
[INFO] All projects up-to-date. Watching for changes...

[15:23:45] File changed: UserService/src/main/java/User.java
[15:23:45] Building UserService... ✓ (1.8s)
[15:23:47] Building dependent OrderService... ✓ (2.1s)
[15:23:49] Build complete. 2 projects updated.

[15:28:12] File changed: SharedUtils/src/main/java/Util.java
[15:28:12] Building SharedUtils... ✓ (0.9s)  
[15:28:13] Building dependents: UserService, ProductService... ✓ (3.4s)
[15:28:16] Build complete. 3 projects updated.

Press Ctrl+C to stop auto-build...
```