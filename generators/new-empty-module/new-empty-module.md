# Water New Empty Module Generator

The `water:new-empty-module` generator creates a new empty module within an existing Water project, providing a foundation for custom functionality.

## Purpose

This generator creates a minimal module structure for:
- Adding custom business logic modules to existing projects
- Creating utility or helper modules
- Setting up modules for future development
- Establishing module structure with proper configuration

## Usage

### Interactive Mode
```bash
yo water:new-empty-module
```

## Prerequisites
- Must be run within a Water workspace
- At least one project must exist in the workspace
- Target project should be properly configured

## Interactive Prompts

The generator will prompt you for:

1. **Project Selection**: Choose which existing project to add the module to
2. **Module Name**: Name of the new module (e.g., "utils", "integration", "custom")

## Generated Structure

For a module named `utils` in project `MyProject`:

```
MyProject/
├── MyProject-utils/
│   ├── build.gradle                    # Module build configuration
│   ├── .yo-rc.json                     # Generator configuration
│   ├── .gitignore                      # Git ignore patterns
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/myproject/utils/  # Empty package structure
│       │   └── resources/               # Resource files
│       └── test/
│           ├── java/
│           │   └── com/myproject/utils/ # Test package structure  
│           └── resources/               # Test resources
└── settings.gradle                      # Updated to include new module
```

## Module Configuration

### Build Configuration (`build.gradle`)
The generated module includes:
- Basic Java/Gradle configuration
- Integration with parent project
- Standard dependency declarations
- Test framework setup
- Publication configuration (if project publishes modules)

### Package Structure
- Creates proper Java package hierarchy based on project groupId
- Follows project naming conventions
- Sets up separate main and test source directories
- Includes resource directories for configuration files

### Integration
- Automatically added to parent project's `settings.gradle`
- Integrated with project's build system
- Inherits project-wide configuration and dependencies
- Follows project's technology stack (Water, Spring, OSGi, Quarkus)

## Use Cases

### Utility Module
```bash
yo water:new-empty-module
# Project: MyECommerceApp
# Module name: utils
```
Creates `MyECommerceApp-utils` for shared utility classes.

### Integration Module  
```bash
yo water:new-empty-module
# Project: MyService
# Module name: integration
```
Creates `MyService-integration` for external system integration.

### Custom Business Logic
```bash
yo water:new-empty-module  
# Project: UserManagement
# Module name: analytics
```
Creates `UserManagement-analytics` for analytics functionality.

## Technology-Specific Features

### Water Framework
- Water component configuration
- Integration with Water module system
- Water-specific annotations and patterns

### Spring Boot
- Spring Boot starter dependencies
- Spring configuration classes templates
- Spring component scanning setup

### OSGi
- OSGi bundle configuration
- Blueprint or SCR service definitions
- Bundle manifest generation

### Quarkus
- Quarkus extension setup
- CDI configuration
- Native compilation support

## Development Workflow

After creating an empty module:

1. **Add Dependencies**: Update `build.gradle` with required dependencies
2. **Create Packages**: Add Java packages for your functionality
3. **Implement Classes**: Add your custom classes and interfaces
4. **Write Tests**: Create unit and integration tests
5. **Configure Services**: Set up any services or components
6. **Document**: Add README and documentation

## Module Types

### Library Module
- Pure Java library functionality
- Shared utilities and helpers
- No external service dependencies

### Service Module
- Business service implementations
- Database or external service integration
- REST or messaging endpoints

### Integration Module
- External system connectors
- API clients and adapters
- Message queue handlers

## Configuration Files

### Generated Files
- `.gitignore` - Standard Git ignore patterns
- `.yo-rc.json` - Generator configuration for future operations
- `build.gradle` - Module build configuration

### Inherited Configuration
- Inherits parent project's Gradle configuration
- Uses project-wide dependency versions
- Follows project's coding standards and patterns

## Notes

- Module names should follow Java package naming conventions
- The module is automatically integrated into the parent project's build
- Generated structure follows the project's existing patterns
- Empty modules provide a clean foundation for custom development
- Module can be extended later with additional generator tasks

## Next Steps

After creating an empty module:

1. **Review Structure**: Understand the generated file layout
2. **Add Dependencies**: Configure required libraries in `build.gradle`
3. **Create Classes**: Implement your functionality
4. **Build and Test**: Use project build system to validate module
5. **Integration**: Connect module with other project components

## Example Usage

```bash
yo water:new-empty-module

# Select project: MyECommerceApp
# Module name: payment-gateway

# Creates: MyECommerceApp-payment-gateway/
# Ready for payment processing implementation
```

The module is now ready for development and will be included in all project build and deployment operations.