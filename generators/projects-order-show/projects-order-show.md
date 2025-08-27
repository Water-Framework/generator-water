# Water Projects Order Show Generator

The `water:projects-order-show` generator displays the current project dependency order and build configuration for the workspace.

## Purpose

This generator provides visibility into:
- Current project build and deployment order
- Project dependency relationships  
- Parallel build group configurations
- Potential dependency issues

## Usage

### Interactive Mode
```bash
yo water:projects-order-show
```

## Prerequisites
- Must be run within a Water workspace
- Projects order should be configured (via `water:projects-order`)

## Display Output

### Build Order Visualization
```
================================================================================
Workspace Project Build Order
================================================================================

Build Sequence:
1. SharedUtils
2. [CoreServices, UtilityLibrary] (parallel group)
3. [UserService, ProductService] (parallel group) 
4. OrderService
5. WebGateway
6. IntegrationTests

Total Projects: 7
Parallel Groups: 2
Estimated Build Time: ~15 minutes (with parallelization)
```

### Dependency Graph
```
Project Dependencies:

SharedUtils
├── CoreServices
├── UtilityLibrary
├── UserService
└── ProductService

CoreServices
├── OrderService
└── WebGateway

UserService
└── OrderService

ProductService  
└── OrderService

OrderService
└── WebGateway

WebGateway
└── IntegrationTests
```

### Deployment Order
```
Deployment Sequence:
1. SharedUtils
2. CoreServices  
3. UserService
4. ProductService
5. OrderService
6. WebGateway

Note: IntegrationTests excluded from deployment
```

## Analysis Information

### Parallel Opportunities
- **Group 1**: CoreServices, UtilityLibrary (no interdependencies)
- **Group 2**: UserService, ProductService (both depend only on SharedUtils)
- **Bottleneck**: OrderService (waits for UserService and ProductService)

### Critical Path Analysis
```
Critical Path: SharedUtils → UserService → OrderService → WebGateway
Estimated Duration: 12 minutes

Alternative Paths:
Path 1: SharedUtils → CoreServices → WebGateway (8 minutes)
Path 2: SharedUtils → ProductService → OrderService → WebGateway (11 minutes)
```

### Build Time Estimates
Based on historical data or project size:
- SharedUtils: ~2 minutes
- CoreServices: ~3 minutes  
- UserService: ~4 minutes
- ProductService: ~3 minutes
- OrderService: ~5 minutes
- WebGateway: ~2 minutes
- IntegrationTests: ~6 minutes

## Dependency Validation

### Circular Dependency Check
```
✓ No circular dependencies detected

All dependencies form a valid DAG (Directed Acyclic Graph)
Safe for parallel and sequential builds
```

### Missing Dependencies
```
⚠ Potential Issues Found:

WebGateway references UserService classes but no dependency declared
Recommendation: Add UserService to WebGateway dependencies

ProductService uses SharedUtils v2.0 but depends on v1.5  
Recommendation: Update SharedUtils dependency version
```

## Configuration Details

### Current Configuration Source
```
Configuration loaded from: .yo-rc.json
Last modified: 2024-01-15 14:30:22
Modified by: water:projects-order generator
```

### Environment Overrides
```
Environment-specific configurations:
- Development: Includes IntegrationTests in build
- Production: Excludes test projects from deployment
- Staging: Uses alternative UserService configuration
```

## Build Performance Insights

### Optimization Suggestions
```
Performance Recommendations:

1. Parallel Build Efficiency: 67%
   - Current: 2 parallel groups
   - Potential: 3 parallel groups possible
   - Suggestion: Move UtilityLibrary to separate group

2. Bottleneck Analysis:
   - OrderService is a critical bottleneck (depends on 3 projects)
   - Consider splitting OrderService into smaller modules
   - WebGateway blocks IntegrationTests

3. Build Cache Opportunities:
   - SharedUtils rarely changes, good cache candidate
   - CoreServices has stable API, cacheable
```

### Historical Build Times
```
Average Build Times (last 10 builds):
- Sequential: 23m 45s
- With Current Parallelization: 15m 22s  
- Potential Optimized: 12m 30s (19% improvement)
```

## Integration Information

### Used By Commands
This configuration is automatically used by:
- `yo water:build-all` - Respects build order
- `yo water:publish-all` - Uses deployment order
- `yo water:build` - Shows dependencies when selecting projects

### Configuration Files
```
Affects these files:
- .yo-rc.json (main configuration)
- settings.gradle (project inclusion order)
- Individual build.gradle files (dependency declarations)
```

## Troubleshooting

### Common Issues
```
Issue: Build failures in parallel groups
Solution: Check for hidden dependencies between parallel projects

Issue: Deployment order different from build order
Solution: Review runtime vs build-time dependencies

Issue: Slow builds despite parallelization  
Solution: Examine resource utilization and consider build machine limits
```

### Validation Commands
```
# Validate current configuration
yo water:projects-order-show

# Test build with current order
yo water:build-all

# Modify order if needed
yo water:projects-order
```

## Notes

- Display reflects current workspace configuration
- Build time estimates are based on project complexity and historical data
- Dependency analysis helps identify potential issues before building
- Configuration can be modified using `water:projects-order`
- Parallel groups improve build performance but require careful dependency management

## Example Output

```bash
yo water:projects-order-show

================================================================================
Workspace: MyECommerceApp
Projects: 6 | Parallel Groups: 2 | Estimated Build Time: 14m 32s
================================================================================

Build Order:
1. shared-utils (2m 15s)
2. [user-service, product-service] (4m 30s max, parallel)
3. order-service (5m 20s) 
4. web-gateway (2m 27s)

Dependencies:
✓ No circular dependencies
✓ All projects properly ordered
⚠ 1 optimization suggestion available

Run 'yo water:projects-order' to modify configuration.
```