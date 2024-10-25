package <%-repositoryPackage%>;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;
import it.water.core.api.repository.BaseRepository;
import it.water.repository.jpa.spring.SpringBaseJpaRepositoryImpl;
import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;

/**
 * @Generated by Water Generator
 * Repository Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@Repository
public class <%- projectSuffixUpperCase %>RepositoryImpl extends SpringBaseJpaRepositoryImpl<<%- projectSuffixUpperCase %>> implements BaseRepository<<%- projectSuffixUpperCase %>> {
    
    public <%- projectSuffixUpperCase %>RepositoryImpl(EntityManager em) {
        super(<%- projectSuffixUpperCase %>.class,em);
    }

    //todo: add custom logic here...
    //use method getEntityManager to retrieve JPA Entity manager.
    //use getLog to retrieve Logger instance automatically instantiated for this class

}
