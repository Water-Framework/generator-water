package <%-repositoryPackage%>;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;
import it.water.core.interceptors.annotations.*;
import it.water.repository.jpa.BaseJpaRepositoryImpl;

import <%-persistenceLib%>.transaction.Transactional;

import org.osgi.service.cdi.annotations.Bean;
import org.osgi.service.cdi.annotations.Reference;
import org.osgi.service.cdi.annotations.Service;
import org.osgi.service.cdi.annotations.SingleComponent;
import org.osgi.service.component.annotations.*;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.transaction.Transactional;


/**
 * @Generated by Water Generator
 * Repository Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@SingleComponent
@Bean
@Service(value = <%- projectSuffixUpperCase %>Repository.class)
@Transactional
public class <%- projectSuffixUpperCase %>RepositoryImpl extends BaseJpaRepositoryImpl<<%- projectSuffixUpperCase %>> implements <%- projectSuffixUpperCase %>Repository {
    public static final String PERSISTENCE_UNIT_NAME = "<%- projectSuffixLowerCase %>-default-persistence-unit";

    public <%- projectSuffixUpperCase %>RepositoryImpl() {
        super(<%- projectSuffixUpperCase %>.class,PERSISTENCE_UNIT_NAME);
    }

    @Inject
    @Reference(target = "(osgi.unit.name=" + PERSISTENCE_UNIT_NAME + ")")
    @PersistenceUnit
    EntityManagerFactory entityManagerFactory;

    @Override
    public EntityManager getEntityManager() {
        return entityManagerFactory.createEntityManager();
    }

    //todo: add custom logic here...
    //use method getEntityManager to retrieve JPA Entity manager.
    //use getLog to retrieve Logger instance automatically instantiated for this class

}
