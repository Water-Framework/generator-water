# Water Help Generator

The `water:help` generator displays comprehensive help information for all available Water generator tasks.

## Purpose

This generator provides a complete overview of the Water generator system by:
- Listing all available generator tasks
- Providing brief descriptions for each task
- Explaining how to get detailed help for specific tasks
- Serving as the main entry point for generator documentation

## Usage

### Interactive Mode
```bash
yo water:help
```

## What It Shows

### Available Tasks
The help generator displays a formatted list of all Water generator tasks:

```
Available Water Generator Tasks:
--------------------------------------------------------------------------------
yo water:add-entity              Adds new entity on existing project
yo water:add-rest-services       Adds rest service modules on existing project  
yo water:app                     Print info about the water generator
yo water:build                   Launch build on workspace projects
yo water:build-all               Launch build on all workspace projects
yo water:help                    Show help
yo water:new-empty-module        Creates a new empty module into an existing project
yo water:new-entity-extension    Scaffolds classes to create an entity extension
yo water:new-project             Scaffolds a new project
yo water:projects-order          Define projects precedence for build and deploy
yo water:projects-order-show     Generates karaf runtime with Dockerfile
yo water:publish                 Publish project to Maven repository
yo water:publish-all             Publish ALL workspace projects to Maven repository
yo water:stabilityMetrics        Prints stability metrics about software quality
```

### Detailed Help Information
Explains how to access comprehensive documentation for any specific task:

```
💡 TIP: For detailed help on any specific task, add --taskHelp to the command:
   Example: yo water:new-project --taskHelp
   This will display comprehensive documentation including usage examples,
   available options, and detailed explanations for that specific task.
```

## Task Categories

### Project Creation
- `new-project` - Create complete new projects
- `new-empty-module` - Add empty modules to existing projects
- `new-entity-extension` - Create entity extensions

### Development
- `add-entity` - Add entities to existing projects
- `add-rest-services` - Add REST capabilities to projects

### Build & Deploy
- `build` - Build selected projects
- `build-all` - Build entire workspace
- `publish` - Publish single project
- `publish-all` - Publish entire workspace

### Management
- `projects-order` - Configure build dependencies
- `projects-order-show` - Display dependency information
- `stabilityMetrics` - Analyze code quality metrics

### Utilities
- `app` - Framework information and validation
- `help` - This help system

## Detailed Help System

Each generator task has comprehensive documentation available via `--taskHelp`:

### Usage Pattern
```bash
yo water:[task-name] --taskHelp
```

### What You Get
- **Purpose**: What the generator does
- **Usage**: How to run it and available options
- **Prerequisites**: Requirements before running
- **Interactive Prompts**: What questions will be asked
- **Generated Files**: What gets created
- **Examples**: Real-world usage scenarios
- **Notes**: Important considerations and tips

### Examples
```bash
# Get help for creating new projects
yo water:new-project --taskHelp

# Get help for adding entities
yo water:add-entity --taskHelp

# Get help for building projects
yo water:build --taskHelp
```

## Prerequisites

### For General Help
- No specific prerequisites
- Can be run from any directory
- Does not require a Water workspace

### For Task-Specific Help
- Some tasks may require being in a Water workspace
- Task-specific help (`--taskHelp`) respects individual task requirements

## Integration

### Workspace Integration
The help generator integrates with the workspace system:
- Shows workspace-specific information when available
- Displays current Water framework version
- Validates environment when run in workspace context

### Cross-References
- Links between related tasks
- Suggested workflows and task sequences
- References to external documentation

## Navigation Tips

### Quick Reference
- Run `yo water:help` for complete task list
- Use `--taskHelp` for detailed documentation
- Check task descriptions to understand purpose

### Common Workflows
1. **New Project**: `new-project` → `add-entity` → `add-rest-services`
2. **Development**: `add-entity` → `build` → `publish`
3. **Deployment**: `build-all` → `publish-all`
4. **Analysis**: `stabilityMetrics` → review and improve

### Getting Started
1. `yo water:help` - See all available tasks
2. `yo water:new-project --taskHelp` - Learn about project creation
3. `yo water:new-project` - Create your first project
4. `yo water:build --taskHelp` - Learn about building

## Notes

- Help is always available without requiring workspace setup
- Task-specific help provides comprehensive usage information
- The help system is the recommended starting point for new users
- All generator tasks support the `--taskHelp` option

## Example Session

```bash
# Start with general help
yo water:help

# Get detailed help for specific task
yo water:new-project --taskHelp

# Run the task after understanding it
yo water:new-project --projectName=MyApp --applicationType=entity

# Get help for next steps
yo water:build --taskHelp
```