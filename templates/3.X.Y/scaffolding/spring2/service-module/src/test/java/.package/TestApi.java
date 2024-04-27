package <%-projectGroupId%>;

import it.water.core.api.model.PaginableResult;
import it.water.core.api.model.User;
import it.water.core.api.permission.Role;
import it.water.core.api.permission.RoleManager;
import it.water.core.api.registry.ComponentRegistry;
import it.water.core.api.repository.query.Query;
import it.water.core.model.exceptions.ValidationException;
import it.water.core.model.exceptions.WaterRuntimeException;
import it.water.core.bundle.WaterRuntime;
import it.water.core.permission.exceptions.UnauthorizedException;
import it.water.repository.entity.model.exceptions.DuplicateEntityException;
import it.water.core.testing.utils.api.TestPermissionManager;
import it.water.core.testing.utils.bundle.TestRuntimeInitializer;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;

import org.junit.jupiter.api.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

/**
 * Generated with Water Generator.
 * Test class for <%- projectSuffixUpperCase %> Services.
<%if(hasRestServices){-%> * 
 * Please use <%- projectSuffixUpperCase %>RestTestApi for ensuring format of the json response
<% } -%> 
 */
@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class <%- projectSuffixUpperCase %>ApiTest  {
    
    @Autowired
    private ComponentRegistry componentRegistry;
    
    @Autowired
    private <%- projectSuffixUpperCase %>Api <%- projectSuffixLowerCase %>Api;

    @Autowired
    private TestPermissionManager permissionManager;

    @Autowired
    private WaterRuntime runtime;

    private it.water.core.api.model.User adminUser;
<%if(isProtectedEntity){ -%>
    @Autowired
    private <%- projectSuffixUpperCase %>Repository <%- projectSuffixLowerCase %>Repository;
    
    @Autowired
    //default is test role manager
    private RoleManager roleManager;
    //declaring user for permissions tests
    private it.water.core.api.model.User managerUser;
    private it.water.core.api.model.User viewerUser;
    private it.water.core.api.model.User editorUser;
    
    private Role manager;
    private Role viewer;
    private Role editor;
<% } -%>
    @BeforeAll
    public void beforeAll() {
<%if(isProtectedEntity){ -%>
        //getting user
        manager = roleManager.getRole("bookManager");
        viewer = roleManager.getRole("bookViewer");
        editor = roleManager.getRole("bookEditor");
        Assertions.assertNotNull(manager);
        Assertions.assertNotNull(viewer);
        Assertions.assertNotNull(editor);
        managerUser = permissionManager.addUser("manager", "name", "lastname", "manager@a.com", false);
        viewerUser = permissionManager.addUser("viewer", "name", "lastname", "viewer@a.com", false);
        editorUser = permissionManager.addUser("editor", "name", "lastname", "editor@a.com", false);
        //starting with admin permissions
        roleManager.addRole(managerUser.getId(), manager);
        roleManager.addRole(viewerUser.getId(), viewer);
        roleManager.addRole(editorUser.getId(), editor);
        //starting with admin
        //deafult user in test mode is admin please use TestRuntimeInitializer.getInstance().impersonate(...); to impersonate other users
<% } -%>
    }

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
    @Transactional
    @Commit
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
    @Transactional
    @Commit
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
    @Transactional
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
    @Transactional
    @Commit
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
    @Transactional
    @Commit
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
    @Transactional
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

    
    <%if(isProtectedEntity){ -%>
    /**
     * Managers can do everything
     */
    @Order(9)
    @Test
    @Commit
    @Transactional
    public void managerCanDoEverything() {
        TestRuntimeInitializer.getInstance().impersonate(managerUser, runtime);
        <%- projectSuffixUpperCase %> newEntity = create<%- projectSuffixUpperCase %>(1);
        <%- projectSuffixUpperCase %> entity = this.<%- projectSuffixLowerCase %>Api.save(newEntity);
        Assert.notNull(entity);
        entity.setExampleField("newUpdatedExampleField");
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.update(entity));
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.remove(entity.getId()));
        newEntity = createBook(15);
        this.<%- projectSuffixLowerCase %>Api.save(newEntity);
    }

    /**
     * Viewers are authorized just to read content, not to alter it
     */
    @Order(10)
    @Transactional
    @Test
    public void viewerCannotSaveOrUpdateOrRemove() {
        TestRuntimeInitializer.getInstance().impersonate(viewerUser, runtime);
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

    /**
     * Editors can save or update but cannot remove
     */
    @Order(11)
    @Transactional
    @Commit
    @Test
    public void editorCannotRemove() {
        TestRuntimeInitializer.getInstance().impersonate(editorUser, runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(101);
        <%- projectSuffixUpperCase %> savedEntity = Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.save(entity));
        savedEntity.setExampleField("newSavedEntity");
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.update(entity));
        Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.find(savedEntity.getId()));
        Assertions.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.remove(savedEntity.getId()));
    }
    
    /**
     * Testing user with multiple roles on the same entity. Checking the at least minimum priviledge principle
     */
    @Order(12)
    @Transactional
    @Commit
    @Test
    public void usersWithViewerAndEditorRoleCannotRemove(){
        User crossRoleUser = permissionManager.addUser("crossRoleUser", "crossRoleUser", "crossRoleUser", "crossRoleUser@a.com", false);
        //assigning roles to the cross user
        roleManager.addRole(crossRoleUser.getId(), viewer);
        roleManager.addRole(crossRoleUser.getId(), editor);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(104);
        Book savedEntity = Assertions.assertDoesNotThrow(() -> this.<%- projectSuffixLowerCase %>Api.save(entity));
        savedEntity.setExampleField("crossRoleUserUpdatedField");
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
