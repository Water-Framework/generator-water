# Water Add Entity Generator

The `water:add-entity` generator adds a new entity to an existing Water project, generating all the necessary classes and configurations for a complete entity implementation.

## Purpose

This generator creates a new entity within an existing project, including:
- Model class with JPA annotations
- Repository interface and implementation  
- Service interface and implementation
- REST API interface and controller (if REST services are enabled)
- Test classes

## Usage

### Interactive Mode
```bash
yo water:add-entity
```

### Prerequisites
- Must be run within a Water workspace
- At least one project must exist in the workspace
- The target project should be configured for entities

## Interactive Prompts

The generator will prompt you for:

1. **Project Selection**: Choose which existing project to add the entity to
2. **Entity Name**: Name of the new entity (e.g., "User", "Product", "Order")
3. **Protected Entity**: Whether the entity should be controlled by the Permission System
4. **Owned Entity**: Whether the entity is an "owned entity" with ownership semantics

## Generated Files

For an entity named `User` in project `MyProject`, the generator creates:

### Model Layer
- `MyProject-model/src/main/java/.../model/User.java` - Entity class with JPA annotations

### API Layer  
- `MyProject-api/src/main/java/.../api/UserApi.java` - Service interface
- `MyProject-api/src/main/java/.../api/UserSystemApi.java` - System service interface
- `MyProject-api/src/main/java/.../api/UserRepository.java` - Repository interface

### Service Layer
- `MyProject-service/src/main/java/.../service/UserServiceImpl.java` - Service implementation
- `MyProject-service/src/main/java/.../service/UserSystemServiceImpl.java` - System service implementation
- `MyProject-service/src/main/java/.../repository/UserRepositoryImpl.java` - Repository implementation (if not using Spring repos)

### REST Layer (if enabled)
- `MyProject-api/src/main/java/.../api/rest/UserRestApi.java` - REST API interface  
- `MyProject-service/src/main/java/.../service/rest/UserRestControllerImpl.java` - REST controller

### Tests
- `MyProject-service/src/test/java/.../UserApiTest.java` - Service tests
- `MyProject-service/src/test/java/.../UserRestApiTest.java` - REST API tests (if enabled)
- `MyProject-service/src/test/resources/karate/User-crud.feature` - Karate integration tests (if enabled)

## Entity Types

### Standard Entity
A regular entity without special security or ownership features.

### Protected Entity
An entity controlled by the Water Permission System:
- Access controlled by permissions
- Automatic permission checks in generated code
- Integration with Water security framework

### Owned Entity  
An entity with ownership semantics:
- Entities belong to specific users/owners
- Automatic ownership filtering
- Owner-based access control

## Integration with Existing Project

The generator automatically:
- Updates project dependencies if needed
- Integrates with existing REST services configuration
- Follows the project's existing patterns and conventions
- Maintains consistency with the project's technology stack (Water, Spring, OSGi, Quarkus)

## Notes

- Entity names should follow Java class naming conventions (PascalCase)
- The generator respects the existing project configuration
- REST services are only generated if the project has REST services enabled
- Repository implementation varies based on the project's repository strategy (Water vs Spring)

## Example

```bash
yo water:add-entity
# Select project: MyECommerceApp  
# Entity name: Product
# Protected entity: Yes
# Owned entity: No
```

This creates a `Product` entity with permission-based access control in the MyECommerceApp project.