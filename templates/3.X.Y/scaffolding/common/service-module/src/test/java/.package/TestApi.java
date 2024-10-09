package <%-projectGroupId%>;

import it.water.core.api.model.PaginableResult;
import it.water.core.api.bundle.Runtime;
import it.water.core.api.model.Role;
import it.water.core.api.permission.RoleManager;
import it.water.core.api.user.UserManager;
import it.water.core.api.registry.ComponentRegistry;
import it.water.core.api.repository.query.Query;
import it.water.core.api.service.Service;
import it.water.core.api.permission.PermissionManager;
import it.water.core.testing.utils.bundle.TestRuntimeInitializer;
import it.water.core.interceptors.annotations.Inject;
import it.water.core.model.exceptions.ValidationException;
import it.water.core.model.exceptions.WaterRuntimeException;
import it.water.core.permission.exceptions.UnauthorizedException;
import it.water.core.testing.utils.runtime.TestRuntimeUtils;
<%if(applicationTypeEntity){-%>
import it.water.repository.entity.model.exceptions.DuplicateEntityException;
<% } -%>

import it.water.core.testing.utils.junit.WaterTestExtension;

import <%-apiPackage%>.*;
<%if(hasModel){-%>
import <%-modelPackage%>.*;
<% } -%>

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
    private Runtime runtime;

<%if(applicationTypeEntity) { -%>
    @Inject
    @Setter
    private <%- projectSuffixUpperCase %>Repository <%- projectSuffixLowerCase %>Repository;
<% } -%>
<%if(isProtectedEntity){ -%>    
    @Inject
    @Setter
    //default permission manager in test environment;
    private PermissionManager permissionManager;

    @Inject
    @Setter
    //test role manager
    private UserManager userManager;
    
    @Inject
    @Setter
    //test role manager
    private RoleManager roleManager;

    //admin user
    private it.water.core.api.model.User adminUser;
    private it.water.core.api.model.User <%- projectSuffixLowerCase %>ManagerUser;
    private it.water.core.api.model.User <%- projectSuffixLowerCase %>ViewerUser;
    private it.water.core.api.model.User <%- projectSuffixLowerCase %>EditorUser;

    private Role <%- projectSuffixLowerCase %>ManagerRole;
    private Role <%- projectSuffixLowerCase %>ViewerRole;
    private Role <%- projectSuffixLowerCase %>EditorRole;
    
    @BeforeAll
    public void beforeAll() {
        //getting user
        <%- projectSuffixLowerCase %>ManagerRole = roleManager.getRole(<%- projectSuffixUpperCase %>.DEFAULT_MANAGER_ROLE);
        <%- projectSuffixLowerCase %>ViewerRole = roleManager.getRole(<%- projectSuffixUpperCase %>.DEFAULT_VIEWER_ROLE);
        <%- projectSuffixLowerCase %>EditorRole = roleManager.getRole(<%- projectSuffixUpperCase %>.DEFAULT_EDITOR_ROLE);
        Assertions.assertNotNull(<%- projectSuffixLowerCase %>ManagerRole);
        Assertions.assertNotNull(<%- projectSuffixLowerCase %>ViewerRole);
        Assertions.assertNotNull(<%- projectSuffixLowerCase %>EditorRole);
        //impersonate admin so we can test the happy path
        adminUser = userManager.findUser("admin");
        <%- projectSuffixLowerCase %>ManagerUser = userManager.addUser("manager", "name", "lastname", "manager@a.com","TempPassword1_","salt", false);
        <%- projectSuffixLowerCase %>ViewerUser = userManager.addUser("viewer", "name", "lastname", "viewer@a.com","TempPassword1_","salt", false);
        <%- projectSuffixLowerCase %>EditorUser = userManager.addUser("editor", "name", "lastname", "editor@a.com","TempPassword1_","salt", false);
        //starting with admin permissions
        roleManager.addRole(<%- projectSuffixLowerCase %>ManagerUser.getId(), <%- projectSuffixLowerCase %>ManagerRole);
        roleManager.addRole(<%- projectSuffixLowerCase %>ViewerUser.getId(), <%- projectSuffixLowerCase %>ViewerRole);
        roleManager.addRole(<%- projectSuffixLowerCase %>EditorUser.getId(), <%- projectSuffixLowerCase %>EditorRole);
        //default security context is admin
        TestRuntimeUtils.impersonateAdmin(componentRegistry);
    }
<% } -%>
    /**
     * Testing basic injection of basic component for <%- projectSuffixLowerCase %> entity.
     */
    @Test
    @Order(1)
    public void componentsInsantiatedCorrectly() {
        this.<%- projectSuffixLowerCase %>Api = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Api.class, null);
        Assertions.assertNotNull(this.<%- projectSuffixLowerCase %>Api);
        Assertions.assertNotNull(this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>SystemApi.class, null));
<%if(applicationTypeEntity){ -%>
        this.<%- projectSuffixLowerCase %>Repository = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Repository.class, null);
        Assertions.assertNotNull(this.<%- projectSuffixLowerCase %>Repository);
<% } -%>
    }

<%if(applicationTypeEntity){ -%>
    /**
     * Testing simple save and version increment
     */
    @Test
    @Order(2)
    public void saveOk() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(0);
        entity = this.<%- projectSuffixLowerCase %>Api.save(entity);
        Assertions.assertEquals(1, entity.getEntityVersion());
        Assertions.assertTrue(entity.getId() > 0);
        Assertions.assertEquals("exampleField0", entity.getExampleField());
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
        entity = this.<%- projectSuffixLowerCase %>Api.update(entity);
        Assertions.assertEquals("exampleFieldUpdated", entity.getExampleField());
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
        Assertions.assertEquals("exampleFieldUpdated", errorEntity.getExampleField());
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
        PaginableResult<<%- projectSuffixUpperCase %>> all = this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null);
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
            <%- projectSuffixUpperCase %> u = create<%- projectSuffixUpperCase %>(i);
            this.<%- projectSuffixLowerCase %>Api.save(u);
        }
        PaginableResult<<%- projectSuffixUpperCase %>> paginated = this.<%- projectSuffixLowerCase %>Api.findAll(null, 7, 1, null);
        Assertions.assertEquals(7, paginated.getResults().size());
        Assertions.assertEquals(1, paginated.getCurrentPage());
        Assertions.assertEquals(2, paginated.getNextPage());
        paginated = this.<%- projectSuffixLowerCase %>Api.findAll(null, 7, 2, null);
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
        Assertions.assertTrue(this.<%- projectSuffixLowerCase %>Api.countAll(null) == 0);
    }

    /**
     * Testing failure on duplicated entity
     */
    @Test
    @Order(8)
    public void saveShouldFailOnDuplicatedEntity() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(1);
        this.<%- projectSuffixLowerCase %>Api.save(entity);
        <%- projectSuffixUpperCase %> duplicated = this.create<%- projectSuffixUpperCase %>(1);
        //cannot insert new entity wich breaks unique constraint
        Assertions.assertThrows(DuplicateEntityException.class,() -> this.<%- projectSuffixLowerCase %>Api.save(duplicated));
        <%- projectSuffixUpperCase %> secondEntity = create<%- projectSuffixUpperCase %>(2);
        this.<%- projectSuffixLowerCase %>Api.save(secondEntity);
        entity.setExampleField("exampleField2");
        //cannot update an entity colliding with other entity on unique constraint
        Assertions.assertThrows(DuplicateEntityException.class,() -> this.<%- projectSuffixLowerCase %>Api.update(entity));
    }

    /**
     * Testing failure on validation failure for example code injection
     */
    @Test
    @Order(9)
    public void updateShouldFailOnValidationFailure() {
        <%- projectSuffixUpperCase %> newEntity = new <%- projectSuffixUpperCase %>("<script>function(){alert('ciao')!}</script>");
        Assertions.assertThrows(ValidationException.class,() -> this.<%- projectSuffixLowerCase %>Api.save(newEntity));
    }

<%if(isProtectedEntity) { -%>
    /**
     * Testing Crud operations on manager role
     */
    @Order(10)
    @Test
    public void managerCanDoEverything() {
        TestRuntimeInitializer.getInstance().impersonate(<%- projectSuffixLowerCase %>ManagerUser,runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(101);
        <%- projectSuffixUpperCase %> savedEntity = Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.save(entity));
        savedEntity.setExampleField("newSavedEntity");
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.update(entity));
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.find(savedEntity.getId()));
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.remove(savedEntity.getId()));

    }

    @Order(11)
    @Test
    public void viewerCannotSaveOrUpdateOrRemove() {
        TestRuntimeInitializer.getInstance().impersonate(<%- projectSuffixLowerCase %>ViewerUser,runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(201);
        Assertions.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.save(entity));
        //viewer can search
        <%- projectSuffixUpperCase %> found = Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null).getResults().stream().findFirst()).get();
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.find(found.getId()));
        //viewer cannot update or remove
        found.setExampleField("changeIt!");
        Assertions.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.update(entity));
        Assertions.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.remove(found.getId()));
    }

    @Order(12)
    @Test
    public void editorCannotRemove() {
        TestRuntimeInitializer.getInstance().impersonate(<%- projectSuffixLowerCase %>EditorUser,runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(301);
        <%- projectSuffixUpperCase %> savedEntity = Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.save(entity));
        savedEntity.setExampleField("editorNewSavedEntity");
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.update(entity));
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.find(savedEntity.getId()));
        Assertions.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.remove(savedEntity.getId()));
    }
    
<% } -%>
    private <%- projectSuffixUpperCase %> create<%- projectSuffixUpperCase %>(int seed){
        <%- projectSuffixUpperCase %> entity = new <%- projectSuffixUpperCase %>("exampleField"+seed);
        //todo add more fields here...
        return entity;
    }
<% } -%>
}
