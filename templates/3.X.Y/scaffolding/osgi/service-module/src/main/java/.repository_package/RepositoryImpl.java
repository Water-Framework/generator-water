package <%-repositoryPackage%>;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;
import it.water.repository.jpa.osgi.OsgiBaseJpaRepository;

import <%-persistenceLib%>.transaction.Transactional;

import org.osgi.service.cdi.annotations.Bean;
import org.osgi.service.cdi.annotations.Reference;
import org.osgi.service.cdi.annotations.Service;
import org.osgi.service.cdi.annotations.SingleComponent;


/**
 * @Generated by Water Generator
 * Repository Class for <%- modelName %> entity.
 *
 */
@SingleComponent
@Bean
@Service(value = <%- modelName %>Repository.class)
@Transactional
public class <%- modelName %>RepositoryImpl extends OsgiBaseJpaRepository<<%- modelName %>> implements <%- modelName %>Repository {
    public static final String PERSISTENCE_UNIT_NAME = "<%- modelNameLowerCase %>-default-persistence-unit";

    public <%- modelName %>RepositoryImpl() {
        super(<%- modelName %>.class,PERSISTENCE_UNIT_NAME);
    }

    //todo: add custom logic here...
    //use method getEntityManager to retrieve JPA Entity manager.
    //use getLog to retrieve Logger instance automatically instantiated for this class

}
