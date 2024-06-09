package <%-repositoryPackage%>;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;
import it.water.core.interceptors.annotations.*;
import it.water.repository.jpa.WaterJpaRepositoryImpl;

import <%-persistenceLib%>.transaction.Transactional;

/**
 * @Generated by Water Generator
 * Repository Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@FrameworkComponent
public class <%- projectSuffixUpperCase %>RepositoryImpl extends WaterJpaRepositoryImpl<<%- projectSuffixUpperCase %>> implements <%- projectSuffixUpperCase %>Repository {
    
    private static final String <%- projectSuffixUpperCase.toUpperCase() %>__PERSISTENCE_UNIT = "<%-projectSuffixLowerCase%>-persistence-unit";

    public <%- projectSuffixUpperCase %>RepositoryImpl() {
        super(<%- projectSuffixUpperCase %>.class,<%- projectSuffixUpperCase.toUpperCase() %>__PERSISTENCE_UNIT);
    }

    //todo: add custom logic here...
    //use method getEntityManager to retrieve JPA Entity manager.
    //use getLog to retrieve Logger instance automatically instantiated for this class

}
