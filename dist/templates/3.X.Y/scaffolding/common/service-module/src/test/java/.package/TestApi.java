package <%-projectGroupId%>;

import it.water.core.api.model.PaginableResult;
import it.water.core.api.registry.ComponentRegistry;
import it.water.core.api.repository.query.Query;
import it.water.core.api.service.Service;
import it.water.core.interceptors.annotations.Inject;
import it.water.core.model.exceptions.ValidationException;
import it.water.core.model.exceptions.WaterRuntimeException;
import it.water.core.testing.utils.junit.WaterTestExtension;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;

import lombok.Setter;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;

/**
 * Generated with Water Generator.
 * Test class for <%- projectSuffixUpperCase %> Services.
<%if(hasRestServices){-%> * 
 * Please use <%- projectSuffixUpperCase %>RestTestApi for ensuring format of the json response
<% } -%> 
 */
@ExtendWith(WaterTestExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class <%- projectSuffixUpperCase %>ApiTest implements Service {
    
    @Inject
    @Setter
    private ComponentRegistry componentRegistry;
    
    @Inject
    @Setter
    private <%- projectSuffixUpperCase %>Api <%- projectSuffixLowerCase %>Api;
    
    @Inject
    @Setter
    private <%- projectSuffixUpperCase %>Repository <%- projectSuffixLowerCase %>Repository;

    /**
     * Testing basic injection of basic component for <%- projectSuffixLowerCase %> entity.
     */
    @Test
    @Order(1)
    public void componentsInsantiatedCorrectly() {
        this.<%- projectSuffixLowerCase %>Api = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Api.class, null);
        this.<%- projectSuffixLowerCase %>Repository = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Repository.class, null);
        Assertions.assertNotNull(this.<%- projectSuffixLowerCase %>Api);
        Assertions.assertNotNull(this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>SystemApi.class, null));
        Assertions.assertNotNull(this.<%- projectSuffixLowerCase %>Repository);
    }

    /**
     * Testing simple save and version increment
     */
    @Test
    @Order(2)
    public void saveOk() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(0);
        u = this.<%- projectSuffixLowerCase %>Api.save(entity);
        Assertions.assertEquals(1, entity.getEntityVersion());
        Assertions.assertTrue(u.getId() > 0);
        Assertions.assertEquals("exampleField0", u.getExampleField());
    }

    /**
     * Testing update logic, basic test
     */
    @Test
    @Order(3)
    public void updateShouldWork() {
        Query q = this.<%- projectSuffixLowerCase %>Repository.getQueryBuilderInstance().createQueryFilter("exampleField=exampleField0");
        <%- projectSuffixUpperCase %> entity = this.<%- projectSuffixLowerCase %>Api.find(q);
        Assertions.assertNotNull(entity);
        entity.setExampleField("exampleFieldUpdated");
        entity = this.this.<%- projectSuffixLowerCase %>Api.update(entity);
        Assertions.assertEquals("exampleFieldUpdated", u.getExampleField());
        Assertions.assertEquals(2, entity.getEntityVersion());
    }

    /**
     * Testing update logic, basic test
     */
    @Test
    @Order(4)
    public void updateShouldFailWithWrongVersion() {
        Query q = this.<%- projectSuffixLowerCase %>Repository.getQueryBuilderInstance().createQueryFilter("exampleField=exampleFieldUpdated");
        <%- projectSuffixUpperCase %> errorEntity = this.<%- projectSuffixLowerCase %>Api.find(q);
        Assertions.assertEquals("exampleFieldUpdated", errorEntity.getUsername());
        Assertions.assertEquals(2, errorEntity.getEntityVersion());
        errorEntity.setEntityVersion(1);
        Assertions.assertThrows(WaterRuntimeException.class, () -> this.<%- projectSuffixLowerCase %>Api.update(errorEntity));
    }

    /**
     * Testing finding all entries with no pagination
     */
    @Test
    @Order(5)
    public void findAllShouldWork() {
        PaginableResult<<%- projectSuffixUpperCase %>> all = this.this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null);
        Assertions.assertTrue(all.getResults().size() == 1);
    }

    /**
     * Testing finding all entries with settings related to pagination.
     * Searching with 5 items per page starting from page 1.
     */
    @Test
    @Order(6)
    public void findAllPaginatedShouldWork() {
        for (int i = 2; i < 11; i++) {
            User u = create<%- projectSuffixUpperCase %>(i);
            this.userApi.save(u);
        }
        PaginableResult<<%- projectSuffixUpperCase %>> paginated = this.this.<%- projectSuffixLowerCase %>Api.findAll(null, 7, 1, null);
        Assertions.assertEquals(7, paginated.getResults().size());
        Assertions.assertEquals(1, paginated.getCurrentPage());
        Assertions.assertEquals(2, paginated.getNextPage());
        paginated = this.userApi.findAll(null, 7, 2, null);
        Assertions.assertEquals(3, paginated.getResults().size());
        Assertions.assertEquals(2, paginated.getCurrentPage());
        Assertions.assertEquals(1, paginated.getNextPage());
    }

    /**
     * Testing removing all entities using findAll method.
     */
    @Test
    @Order(7)
    public void removeAllShouldWork() {
        PaginableResult<<%- projectSuffixUpperCase %>> paginated = this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null);
        paginated.getResults().forEach(entity -> {
            this.<%- projectSuffixLowerCase %>Api.remove(entity.getId());
        });
        Assertions.assertTrue(this.this.<%- projectSuffixLowerCase %>Api.countAll(null) == 0);
    }

    /**
     * Testing failure on duplicated entity
     */
    @Test
    @Order(8)
    public void saveShouldFailOnDuplicatedEntity() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(1);
        this.<%- projectSuffixLowerCase %>Api.save(u);
        User duplicated = this.create<%- projectSuffixLowerCase %>Api(1);
        //cannot insert new entity wich breaks unique constraint
        Assertions.assertThrows(DuplicateEntityException.class,() -> this.<%- projectSuffixLowerCase %>Api.save(duplicated));
        <%- projectSuffixUpperCase %> secondEntity = create<%- projectSuffixUpperCase %>(2);
        this.<%- projectSuffixLowerCase %>Api.save(secondEntity);
        entity.setExampleField("exampleField2");
        //cannot update an entity colliding with other entity on unique constraint
        Assertions.assertThrows(DuplicateEntityException.class,() -> this.<%- projectSuffixLowerCase %>Api.update(u));
    }

    /**
     * Testing failure on validation failure for example code injection
     */
    @Test
    @Order(9)
    public void updateShouldFailOnValidationFailure() {
        <%- projectSuffixUpperCase %> newEntity = new User("<script>function(){alert('ciao')!}</script>");
        Assertions.assertThrows(ValidationException.class,() -> this.<%- projectSuffixLowerCase %>Api.save(newEntity));
    }

    private <%- projectSuffixUpperCase %> create<%- projectSuffixUpperCase %>(int seed){
        <%- projectSuffixUpperCase %> entity = new <%- projectSuffixUpperCase %>("exampleField"+seed);
        //todo add more fields here...
        return entity;
    }
}
