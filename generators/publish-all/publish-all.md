# Water Publish All Generator

The `water:publish-all` generator publishes ALL workspace projects to remote Maven repositories in proper dependency order.

## Purpose

This generator provides automated publishing of the entire workspace by:
- Building all projects in dependency order
- Running comprehensive tests across all projects
- Publishing all successful builds to configured repositories
- Managing authentication for batch operations
- Providing comprehensive reporting

## Usage

### Interactive Mode
```bash
yo water:publish-all
```

### Command Line Options
- `--skipTest` - Skip test execution before publishing
- `--sonarHost <url>` - Sonar server URL for quality analysis  
- `--sonarToken <token>` - Sonar authentication token

## Prerequisites
- Must be run within a Water workspace
- All projects must be configured for publishing
- Repository credentials must be available (if required)
- All projects must have valid versions

## Authentication

### Repository Credentials
If any projects require authenticated repositories:
```bash
? Repository Username: ci-user
? Repository Password: [hidden]
```

Credentials are used for all projects that require authentication.

## Publishing Process

### 1. Workspace Analysis
- Discovers all projects in workspace
- Analyzes project dependencies
- Determines publishing order
- Validates publishing configurations

### 2. Dependency Ordering
Projects are processed in dependency order:
```
1. SharedUtils (no dependencies)
2. CoreServices (depends on SharedUtils)
3. WebAPI (depends on CoreServices)
4. ClientSDK (depends on WebAPI)
```

### 3. Build and Test Phase
For each project in order:
- **Build**: `gradle clean build`
- **Test**: Comprehensive test execution (unless `--skipTest`)
- **Quality**: Sonar analysis (if configured)
- **Validate**: Verify artifacts are ready for publishing

### 4. Quality Gate Validation
When Sonar is configured:
- Runs static code analysis
- Checks code coverage
- Validates security standards
- Enforces quality gates

### 5. Publishing Phase
For each successful build:
- **Publish**: `gradle publish` with credentials
- **Verify**: Confirm successful upload
- **Features**: Publish Karaf features (OSGi projects)
- **Report**: Track publish status

## Batch Operations

### Credential Reuse
- Single credential input for all authenticated repositories
- Secure credential handling across all projects
- No re-prompting during batch operation

### Parallel Processing
Where dependencies allow:
- Independent projects can be built in parallel
- Reduces overall processing time
- Maximizes resource utilization

### Error Isolation
- Failed projects don't block independent projects
- Dependent projects are skipped if dependencies fail
- Clear reporting of failures and their impact

## Comprehensive Reporting

### Build Progress
```
[INFO] Publishing workspace projects...
[1/8] Building SharedUtils... ✓ (2m 15s)
[2/8] Building CoreModel... ✓ (1m 45s)
[3/8] Building UserService... ✗ (test failure)
[4/8] Building ProductService... ✓ (3m 20s)
[5/8] Building OrderService... ⚠ (skipped - depends on UserService)
...
```

### Final Summary
```
================================================================================
Workspace Publish Summary
================================================================================
Successfully Published:
  ✓ SharedUtils v1.2.0 
  ✓ CoreModel v1.1.0
  ✓ ProductService v2.0.0
  ✓ ReportingService v1.0.0

Failed to Publish:
  ✗ UserService v1.1.0 (test failures)
  
Skipped (dependency failures):
  ⚠ OrderService v1.0.0 (depends on UserService)
  ⚠ AdminDashboard v1.0.0 (depends on UserService)

Total: 4/7 projects published successfully
Build Time: 18m 32s
Publish Time: 4m 15s
================================================================================
```

## Quality Integration

### Sonar Quality Gates
When Sonar credentials are provided:
```bash
yo water:publish-all --sonarHost=https://sonar.company.com --sonarToken=abc123
```

- Runs quality analysis on all projects
- Enforces quality gates before publishing
- Generates quality reports
- Blocks publishing for quality failures

### Test Coverage
- Comprehensive test execution across all projects
- Code coverage reporting
- Integration test validation
- Performance test execution (if configured)

## Repository Management

### Multi-Repository Support
Projects can publish to different repositories:
- Internal repositories for snapshots
- Public repositories for releases
- Private repositories for proprietary code
- Different credentials per repository

### Artifact Types
Publishes all configured artifacts:
- **Main JARs**: Application and library artifacts
- **Source JARs**: Source code for developers
- **Documentation**: Javadoc and other docs
- **Features**: OSGi/Karaf feature descriptors
- **Native Images**: Quarkus native executables (if built)

## Error Recovery

### Partial Failures
- Continue with remaining projects after individual failures
- Clear identification of failure causes
- Suggestions for resolution
- Option to retry failed projects

### Network Issues
- Automatic retry for network failures
- Resume interrupted uploads
- Timeout handling for slow connections
- Connection pooling optimization

## Performance Optimization

### Build Performance
- Gradle build cache utilization  
- Incremental compilation where possible
- Parallel execution of independent builds
- Resource allocation optimization

### Network Performance
- Concurrent uploads where supported
- Artifact compression
- Connection reuse
- Progress monitoring

## Security Considerations

### Credential Management
- Secure credential input and storage
- No credential logging or display
- Memory cleanup after operations
- Support for encrypted credential stores

### Artifact Security
- GPG signing (if configured)
- Checksum generation and validation
- Secure transport (HTTPS)
- Access control validation

## Use Cases

### Release Management
```bash
# Publish release version of entire workspace
yo water:publish-all
```

### Continuous Integration
```bash
# Automated publishing with quality gates
yo water:publish-all --sonarHost=$SONAR_URL --sonarToken=$SONAR_TOKEN
```

### Development Snapshots
```bash  
# Quick publish without extensive testing
yo water:publish-all --skipTest
```

## Notes

- All projects in the workspace are included automatically
- Dependency order is calculated automatically
- Failed projects don't prevent independent projects from publishing
- Quality gates (when configured) must pass for publishing to proceed
- Single credential input handles all authenticated repositories

## Example Session

```bash
yo water:publish-all --sonarHost=https://sonar.company.com --sonarToken=xyz789

[INFO] Discovered 8 projects in workspace
[INFO] Repository credentials required

? Repository Username: ci-publisher
? Repository Password: [hidden]

[INFO] Building and publishing workspace...
[INFO] Quality analysis enabled

[1/8] SharedUtils... ✓ Build ✓ Test ✓ Sonar ✓ Publish (3m 22s)
[2/8] CoreModel... ✓ Build ✓ Test ✓ Sonar ✓ Publish (2m 45s)
...

✓ 7/8 projects published successfully
Total time: 24m 18s
```