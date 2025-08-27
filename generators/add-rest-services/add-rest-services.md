# Water Add REST Services Generator

The `water:add-rest-services` generator adds REST service modules to an existing Water project that doesn't currently have REST services enabled.

## Purpose

This generator retrofits an existing project with REST capabilities by:
- Adding REST API interfaces for existing entities
- Creating REST controller implementations
- Setting up REST service configuration
- Adding integration tests for REST endpoints
- Updating project dependencies

## Usage

### Interactive Mode
```bash
yo water:add-rest-services
```

### Prerequisites
- Must be run within a Water workspace
- Target project must exist and have entities defined
- Project should not already have REST services enabled

## Interactive Prompts

The generator will prompt you for:

1. **Project Selection**: Choose which existing project to add REST services to
2. **REST Context Root**: Base path for all REST endpoints (e.g., "/api/users")
3. **Authentication**: Whether to enable automatic login management (@Login annotation)

## Generated Components

### REST API Interfaces
For each entity in the project, creates REST API interfaces with standard CRUD operations:
- `GET /{contextRoot}` - List entities
- `GET /{contextRoot}/{id}` - Get entity by ID
- `POST /{contextRoot}` - Create new entity
- `PUT /{contextRoot}/{id}` - Update entity
- `DELETE /{contextRoot}/{id}` - Delete entity

### REST Controllers
Implements the REST API interfaces with:
- Request/response handling
- Data validation
- Error handling
- Authentication integration (if enabled)
- Permission checks (for protected entities)

### Integration Tests
- **Karate Tests**: BDD-style integration tests for each REST endpoint
- **Unit Tests**: Controller-level tests
- **Test Configuration**: Test-specific configuration files

### Dependencies
Automatically adds required dependencies:
- REST framework libraries
- Jackson for JSON serialization
- Swagger/OpenAPI documentation (if configured)
- Authentication libraries (if enabled)

## REST Context Root

The context root defines the base URL path for your REST API:

### Examples
- Entity: `User`, Context: `/api/users`
  - `GET /api/users` - List all users
  - `POST /api/users` - Create user
  - `GET /api/users/123` - Get user by ID

- Entity: `Product`, Context: `/shop/products`  
  - `GET /shop/products` - List products
  - `PUT /shop/products/456` - Update product

## Authentication Integration

When authentication is enabled:
- `@Login` annotation added to protected endpoints
- Automatic token validation
- User context injection
- Permission-based access control

## Technology-Specific Implementation

### Water Framework
- Uses Water's native REST framework
- Integrated with Water security model
- Optimized for Water's component architecture

### Spring Boot
- Spring Web MVC controllers
- Spring Security integration (if enabled)
- Spring Boot auto-configuration

### OSGi
- JAX-RS based implementation
- OSGi service registration
- Blueprint/SCR configuration

### Quarkus
- Quarkus REST (JAX-RS) implementation
- Native compilation support
- Quarkus security integration

## File Structure

After running the generator on a project with a `User` entity:

```
MyProject/
├── MyProject-api/
│   └── src/main/java/.../api/rest/
│       └── UserRestApi.java
├── MyProject-service/
│   ├── src/main/java/.../service/rest/
│   │   └── UserRestControllerImpl.java
│   └── src/test/
│       ├── java/.../UserRestApiTest.java
│       └── resources/karate/User-crud.feature
└── build.gradle (updated with REST dependencies)
```

## Configuration Updates

The generator automatically updates:
- `build.gradle` - Adds REST service dependencies
- Project configuration files
- Test configuration
- Documentation generation (if enabled)

## Notes

- Only works on projects that don't already have REST services
- Generates REST endpoints for all existing entities in the project
- Follows RESTful conventions and best practices
- Respects existing security and permission configurations
- Context root should start with "/" and follow URL path conventions

## Example Usage

```bash
yo water:add-rest-services
# Select project: MyECommerceApp
# REST context root: /api/ecommerce  
# Authentication: Yes
```

This adds REST services to MyECommerceApp with endpoints like:
- `GET /api/ecommerce/products`
- `POST /api/ecommerce/orders`
- `PUT /api/ecommerce/customers/123`