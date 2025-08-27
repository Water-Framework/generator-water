# Water New Entity Extension Generator

The `water:new-entity-extension` generator scaffolds classes to create an entity extension inside a new or existing project.

## Purpose

This generator creates entity extension functionality by:
- Generating extension classes that extend existing entities
- Creating specialized repositories and services for extensions
- Setting up proper inheritance hierarchies
- Maintaining compatibility with the base entity system

## Usage

### Interactive Mode
```bash
yo water:new-entity-extension
```

## Prerequisites
- Must be run within a Water workspace
- Base entity must exist (either in workspace or external dependency)
- Understanding of entity extension patterns

## Interactive Prompts

The generator will prompt you for:

1. **Target Project**: Choose project to create extension in (or create new project)
2. **Base Entity**: Specify the entity to extend
3. **Extension Name**: Name of the extension entity
4. **Extension Properties**: Additional fields for the extension
5. **Extension Type**: Type of extension (inheritance, composition, etc.)

## Extension Types

### Inheritance Extension
Extends an entity using JPA inheritance:
```java
@Entity
@Table(name = "premium_users")
public class PremiumUser extends User {
    
    @Column(name = "membership_level")
    private String membershipLevel;
    
    @Column(name = "discount_rate")
    private BigDecimal discountRate;
    
    // Additional premium user functionality
}
```

### Composition Extension
Extends functionality through composition:
```java
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "bio")
    private String bio;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    // Profile-specific functionality
}
```

### Mixin Extension
Adds functionality through traits/mixins:
```java
@Entity
@Table(name = "auditable_users")
public class AuditableUser extends User implements Auditable {
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;
}
```

## Generated Components

### Model Layer
- **Extension Entity**: The extended entity class with additional fields
- **Extension Interfaces**: Marker interfaces for extension capabilities
- **Value Objects**: Additional value objects if needed

### Repository Layer
- **Extension Repository Interface**: Specialized repository for extension
- **Extension Repository Implementation**: Implementation with extension-specific queries
- **Base Repository Extension**: Methods that work with base entity queries

### Service Layer  
- **Extension Service Interface**: Service contract for extension operations
- **Extension Service Implementation**: Business logic for extension
- **Extension System Service**: System-level operations

### REST Layer (if enabled)
- **Extension REST API**: REST endpoints for extension operations
- **Extension REST Controller**: Implementation of REST operations
- **Extension DTOs**: Data transfer objects for REST operations

## Extension Patterns

### Single Table Inheritance
```sql
-- Single table with discriminator
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    user_type VARCHAR(50), -- Discriminator column
    username VARCHAR(255),
    email VARCHAR(255),
    -- Base user fields
    membership_level VARCHAR(50), -- Premium user field
    discount_rate DECIMAL(5,2)    -- Premium user field
);
```

### Table Per Class
```sql  
-- Base user table
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255)
);

-- Extension table
CREATE TABLE premium_users (
    id BIGINT PRIMARY KEY, -- FK to users.id
    membership_level VARCHAR(50),
    discount_rate DECIMAL(5,2)
);
```

### Joined Table
```sql
-- Base table
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(255), 
    email VARCHAR(255)
);

-- Extension table with foreign key
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    bio TEXT,
    avatar_url VARCHAR(500)
);
```

## Use Cases

### User System Extensions
```bash
yo water:new-entity-extension
# Base Entity: User
# Extension: PremiumUser
# Type: Inheritance
# Fields: membershipLevel, discountRate, privileges
```

### Product Variants
```bash
yo water:new-entity-extension  
# Base Entity: Product
# Extension: DigitalProduct
# Type: Inheritance
# Fields: downloadUrl, licenseKey, fileSize
```

### Audit Extensions
```bash
yo water:new-entity-extension
# Base Entity: Order  
# Extension: AuditableOrder
# Type: Mixin
# Fields: createdBy, createdDate, modifiedBy, modifiedDate
```

## Integration Features

### Base Entity Compatibility
- Generated extensions maintain full compatibility with base entity operations
- Base entity repositories can work with extension instances
- Polymorphic queries supported

### Service Layer Integration
- Extension services can delegate to base entity services
- Override specific methods for extension-specific behavior
- Maintain transaction boundaries properly

### REST API Extensions
- Extension endpoints complement base entity endpoints
- Support for polymorphic responses
- Proper content negotiation for different entity types

## Configuration Options

### JPA Configuration
```yaml
jpa:
  inheritance:
    strategy: TABLE_PER_CLASS
    discriminator:
      column: entity_type
      value: PREMIUM_USER
```

### Extension Metadata
```json
{
  "baseEntity": "User",
  "extensionEntity": "PremiumUser", 
  "extensionType": "inheritance",
  "additionalFields": [
    {"name": "membershipLevel", "type": "String"},
    {"name": "discountRate", "type": "BigDecimal"}
  ]
}
```

## Testing Support

### Generated Tests
- Unit tests for extension entity
- Repository tests with inheritance scenarios
- Service tests for extension-specific operations
- Integration tests for polymorphic behavior

### Test Data
- Test builders for extension entities
- Mock data generators
- Test scenarios for inheritance hierarchies

## Notes

- Extension entities must properly handle inheritance relationships
- Database schema considerations vary by inheritance strategy
- Extension services should delegate to base services where appropriate
- REST endpoints need to handle polymorphic serialization correctly
- Testing should cover both extension-specific and base entity behavior

## Example Generated Structure

For `PremiumUser` extension of `User`:

```
MyProject/
├── MyProject-model/
│   └── src/main/java/.../model/
│       ├── User.java (base entity)
│       └── PremiumUser.java (extension entity)
├── MyProject-api/
│   └── src/main/java/.../api/
│       ├── PremiumUserApi.java
│       ├── PremiumUserSystemApi.java
│       └── PremiumUserRepository.java
├── MyProject-service/
│   └── src/main/java/.../service/
│       ├── PremiumUserServiceImpl.java
│       ├── PremiumUserSystemServiceImpl.java
│       └── repository/PremiumUserRepositoryImpl.java
└── tests with inheritance scenarios
```