package <%-repositoryPackage%>;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;
import it.water.core.interceptors.annotations.*;
import it.water.repository.jpa.BaseJpaRepositoryImpl;

/**
 * @Generated by Water Generator
 * Repository Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@FrameworkComponent
public class <%- projectSuffixUpperCase %>RepositoryImpl extends BaseJpaRepositoryImpl<<%- projectSuffixUpperCase %>> implements <%- projectSuffixUpperCase %>Repository {
    
    public <%- projectSuffixUpperCase %>RepositoryImpl() {
        super(<%- projectSuffixUpperCase %>.class);
    }

    //todo: add custom logic here...
    //use method getEntityManager to retrieve JPA Entity manager.
    //use getLog to retrieve Logger instance automatically instantiated for this class

}
