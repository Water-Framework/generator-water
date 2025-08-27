# Water Stability Metrics Generator

The `water:stabilityMetrics` generator analyzes and reports on software quality metrics for all modules in the workspace.

## Purpose

This generator provides comprehensive code quality analysis by:
- Calculating stability and quality metrics for each module
- Identifying potential design issues and technical debt
- Generating detailed reports on code structure
- Providing actionable insights for improvement

## Usage

### Interactive Mode
```bash
yo water:stabilityMetrics
```

## Prerequisites
- Must be run within a Water workspace
- Projects must be properly compiled (for accurate analysis)
- Java source code must be available

## Analysis Metrics

### Stability Metrics
- **Afferent Coupling (Ca)**: Number of classes outside the package that depend on classes within the package
- **Efferent Coupling (Ce)**: Number of classes inside the package that depend on classes outside the package  
- **Instability (I)**: Ce / (Ca + Ce) - Ranges from 0 (stable) to 1 (unstable)
- **Abstractness (A)**: Number of abstract classes / Total number of classes

### Quality Metrics
- **Distance from Main Sequence (D)**: |A + I - 1| - Ideal packages have D close to 0
- **Package Dependencies**: Inter-package dependency analysis
- **Cyclic Dependencies**: Detection of circular dependencies
- **Complexity Metrics**: Cyclomatic complexity analysis

## Generated Reports

### Console Output
```
================================================================================
Workspace Stability Metrics Analysis
================================================================================

Package: com.mycompany.core
  Classes: 45
  Afferent Coupling (Ca): 12
  Efferent Coupling (Ce): 8
  Instability (I): 0.40
  Abstractness (A): 0.22
  Distance (D): 0.38
  Status: ✓ STABLE

Package: com.mycompany.utils
  Classes: 23
  Afferent Coupling (Ca): 18
  Efferent Coupling (Ce): 2
  Instability (I): 0.10
  Abstractness (A): 0.13
  Distance (D): 0.77
  Status: ⚠ NEEDS ATTENTION

================================================================================
Summary:
Total Packages: 8
Stable Packages: 5
Unstable Packages: 2
Packages Needing Attention: 1
================================================================================
```

### Detailed Analysis

#### Stable Packages
Packages with good balance of stability and abstractness:
- Low instability with appropriate abstractness
- Good separation of concerns
- Well-defined interfaces

#### Unstable Packages  
Packages requiring attention:
- High instability (I > 0.7)
- Poor balance of abstract/concrete classes
- High coupling with other packages

#### Main Sequence Deviation
Packages far from the main sequence (D > 0.7):
- "Zone of Pain": Highly stable and concrete (hard to change)
- "Zone of Uselessness": Abstract and unstable (not used)

## Interpretation Guide

### Instability (I)
- **0.0 - 0.3**: Stable packages (good for core utilities)
- **0.3 - 0.7**: Balanced packages (most application code)
- **0.7 - 1.0**: Unstable packages (UI, configurations)

### Abstractness (A)
- **0.0 - 0.2**: Concrete packages (implementations)
- **0.2 - 0.5**: Mixed packages (balanced design)
- **0.5 - 1.0**: Abstract packages (interfaces, base classes)

### Distance from Main Sequence (D)
- **0.0 - 0.1**: Excellent design
- **0.1 - 0.2**: Good design  
- **0.2 - 0.5**: Acceptable design
- **> 0.5**: Needs refactoring

## Actionable Insights

### For High Instability
```
Package com.mycompany.service (I: 0.85)
Recommendations:
- Reduce dependencies on external packages
- Extract stable interfaces
- Move volatile code to separate packages
- Consider dependency injection patterns
```

### For High Distance
```
Package com.mycompany.data (D: 0.72)
Recommendations:  
- Increase abstraction with interfaces
- Reduce concrete dependencies
- Apply dependency inversion principle
- Extract abstract base classes
```

### For Cyclic Dependencies
```
Cycle Detected: 
com.mycompany.user → com.mycompany.order → com.mycompany.user

Recommendations:
- Extract common interfaces to shared package
- Use event-driven patterns to break cycles
- Introduce mediator patterns
- Refactor shared responsibilities
```

## Multi-Module Analysis

### Cross-Module Dependencies
- Inter-module coupling analysis
- Identification of tightly coupled modules
- Suggestions for module boundary improvements

### Workspace Overview
- Overall workspace stability score
- Module ranking by quality metrics
- Trend analysis (when run repeatedly)

## Integration with Development Process

### Pre-Commit Analysis
Run before major commits to ensure quality:
```bash
yo water:stabilityMetrics
# Review metrics before committing
```

### Continuous Integration
Include in CI pipeline for quality gates:
- Fail builds if metrics exceed thresholds
- Track metric trends over time
- Generate reports for code reviews

### Refactoring Guidance
- Prioritize packages with highest distance scores
- Focus on breaking cyclic dependencies first
- Gradually improve instability of core packages

## Technology-Specific Analysis

### Water Framework
- Analysis of Water component dependencies
- Service interface stability evaluation
- Module boundary recommendations

### Spring Applications
- Bean dependency analysis
- Configuration class stability
- Auto-configuration impact assessment

### OSGi Bundles
- Bundle dependency analysis
- Service import/export evaluation
- Bundle lifecycle stability

## Historical Tracking

When run multiple times:
- Tracks metric improvements/degradations
- Identifies trends in code quality
- Provides before/after refactoring comparisons

## Notes

- Metrics are calculated based on compiled bytecode analysis
- Abstract classes and interfaces are properly identified
- Package-private dependencies are included in calculations
- Analysis respects module boundaries in multi-module projects
- Results guide architectural decisions and refactoring efforts

## Example Workflow

```bash
# Analyze current workspace quality
yo water:stabilityMetrics

# Review recommendations and refactor problem areas
# ... perform refactoring ...

# Re-analyze to verify improvements  
yo water:stabilityMetrics

# Compare before/after metrics to validate changes
```