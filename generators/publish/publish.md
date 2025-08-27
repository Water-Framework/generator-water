# Water Publish Generator

The `water:publish` generator publishes selected workspace projects to a remote Maven repository, making them available for external consumption.

## Purpose

This generator provides controlled publishing of projects by:
- Building projects before publishing
- Running comprehensive tests (optionally)
- Publishing artifacts to configured Maven repositories
- Managing authentication and credentials
- Providing publish status and error reporting

## Usage

### Interactive Mode
```bash
yo water:publish
```

### Command Line Options
- `--skipTest` - Skip test execution before publishing
- `--sonarHost <url>` - Sonar server URL for quality analysis
- `--sonarToken <token>` - Sonar authentication token

## Prerequisites
- Must be run within a Water workspace
- Target projects must be configured for publishing
- Repository credentials must be configured (if required)
- Projects must have valid version numbers

## Interactive Prompts

The generator will prompt you for:

1. **Project Selection**: Choose which projects to publish (multiple selection allowed)
2. **Repository Credentials** (if required):
   - Repository username
   - Repository password

## Publishing Process

### 1. Pre-Publish Validation
- Verifies projects are configured for publishing
- Checks repository configuration
- Validates authentication credentials
- Confirms project versions are appropriate

### 2. Build Phase
For each selected project:
- Executes clean build (`gradle clean build`)
- Runs all tests (unless `--skipTest` is specified)
- Validates build artifacts
- Checks code quality (if Sonar is configured)

### 3. Test Execution
Unless skipped, runs comprehensive tests:
- Unit tests
- Integration tests  
- Code coverage analysis
- Quality gate validation (if Sonar is configured)

### 4. Sonar Quality Analysis
When Sonar is configured:
- Executes `gradle sonar` with provided credentials
- Waits for quality gate results
- Fails publish if quality gate fails
- Reports quality metrics

### 5. Publishing Phase
For successful builds:
- Executes `gradle publish` with credentials
- Uploads artifacts to configured repository
- Publishes Karaf features (for OSGi projects)
- Verifies successful upload

## Repository Configuration

Projects must be configured with publishing information in their `build.gradle`:

```gradle
publishing {
    repositories {
        maven {
            name = "MyRepository"
            url = "https://myrepo.com/maven2"
            credentials {
                username = project.findProperty("publishRepoUsername")
                password = project.findProperty("publishRepoPassword")
            }
        }
    }
}
```

## Credential Management

### Interactive Input
If credentials are required:
```bash
? Repository Username: myuser
? Repository Password: [hidden]
```

### Command Line Properties
Credentials can be passed via Gradle properties:
```bash
yo water:publish -DpublishRepoUsername=myuser -DpublishRepoPassword=mypass
```

### Environment Variables
Set credentials in environment:
```bash
export PUBLISH_REPO_USERNAME=myuser
export PUBLISH_REPO_PASSWORD=mypass
yo water:publish
```

## Build and Test Integration

### Standard Build
```bash
gradle clean build
```
- Compiles all source code
- Processes resources
- Runs all tests
- Creates JAR/WAR artifacts

### Sonar Integration
When `--sonarHost` and `--sonarToken` are provided:
```bash
gradle clean test jacocoRootReport sonar
```
- Runs tests with coverage
- Generates coverage reports
- Performs static code analysis
- Checks quality gates

### Quality Gates
Sonar quality gate validation:
- Code coverage thresholds
- Code quality metrics
- Security vulnerability checks
- Code duplication analysis

## Published Artifacts

### Standard Artifacts
- **JAR Files**: Main artifact with compiled classes
- **Sources JAR**: Source code for development
- **Javadoc JAR**: API documentation
- **POM Files**: Maven metadata and dependencies

### OSGi Specific
- **Bundles**: OSGi-enabled JAR files with manifests
- **Features**: Karaf feature descriptors
- **Feature Repository**: XML feature repositories

### Technology-Specific
- **Spring Boot**: Executable JAR with embedded server
- **Quarkus**: Uber-JAR or native executables
- **Water**: Water module artifacts with framework metadata

## Error Handling

### Build Failures
```
[ERROR] Build of ProjectName completed with errors
[INFO] Skipping publish due to build failure
```

### Test Failures
```
[ERROR] Tests failed for ProjectName
[INFO] Publish cancelled due to test failures
```

### Quality Gate Failures
```
[ERROR] Sonarqube Quality Gate for ProjectName failed!
[INFO] Publish blocked by quality gate
```

### Repository Errors
```
[ERROR] Failed to publish ProjectName to repository
[INFO] Check credentials and repository configuration
```

## Multi-Project Publishing

When publishing multiple projects:
- Projects are built and published in dependency order
- Failed projects don't prevent others from publishing
- Final summary shows success/failure for each project
- Credentials are reused across all publications

## Performance Considerations

### Build Optimization
- Incremental builds where possible
- Parallel test execution
- Build cache utilization
- Skip unnecessary tasks

### Network Optimization
- Artifact compression
- Concurrent uploads where supported
- Resume interrupted uploads
- Connection pooling

## Security

### Credential Security
- Passwords are never logged or displayed
- Credentials are cleared from memory after use
- Support for encrypted credential storage
- Integration with credential managers

### Artifact Signing
For projects configured with signing:
- GPG signing of artifacts
- Checksum generation and verification
- Digital signature validation

## Notes

- Only projects configured for publishing are available for selection
- Build and test must succeed before publishing occurs
- Sonar quality gate failures prevent publishing (when configured)
- Credentials are required only if the repository demands authentication
- Published artifacts are immediately available in the target repository

## Example Usage

```bash
yo water:publish

# Select projects: MyService, SharedLibrary
# Repository Username: mycompany-ci
# Repository Password: [entered securely]

[INFO] Building MyService... ✓
[INFO] Testing MyService... ✓  
[INFO] Publishing MyService... ✓
[INFO] Building SharedLibrary... ✓
[INFO] Testing SharedLibrary... ✓
[INFO] Publishing SharedLibrary... ✓

✓ 2/2 projects published successfully
```