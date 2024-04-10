package <%-projectGroupId%>;

import it.water.core.api.bundle.Runtime;
import it.water.core.api.model.PaginableResult;
import it.water.core.api.model.User;
import it.water.core.api.permission.PermissionManager;
import it.water.core.api.registry.ComponentRegistry;
import it.water.core.api.repository.query.Query;
import it.water.core.api.service.Service;
import it.water.core.api.permission.Role;
import it.water.core.api.permission.RoleManager;
import it.water.core.model.exceptions.ValidationException;
import it.water.core.model.exceptions.WaterRuntimeException;
import it.water.core.permission.exceptions.UnauthorizedException;
import it.water.repository.entity.model.exceptions.DuplicateEntityException;

import it.water.core.testing.utils.api.TestPermissionManager;
import it.water.core.testing.utils.bundle.TestRuntimeInitializer;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;

import lombok.Setter;

import org.junit.jupiter.api.*;
import org.junit.FixMethodOrder;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runners.MethodSorters;

import org.apache.karaf.features.FeaturesService;
import org.apache.karaf.itests.KarafTestSupport;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ops4j.pax.exam.Option;
import org.ops4j.pax.exam.junit.PaxExam;
import org.ops4j.pax.exam.spi.reactors.ExamReactorStrategy;
import org.ops4j.pax.exam.spi.reactors.PerSuite;

/**
 * Generated with Water Generator.
 * Test class for <%- projectSuffixUpperCase %> Services.
<%if(hasRestServices){-%> * 
 * Please use <%- projectSuffixUpperCase %>RestTestApi for ensuring format of the json response
<% } -%> 
 */
@RunWith(PaxExam.class)
@ExamReactorStrategy(PerSuite.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class <%- projectSuffixUpperCase %>ApiTest extends KarafTestSupport {
    
    private ComponentRegistry componentRegistry;
    
    private <%- projectSuffixUpperCase %>Api <%- projectSuffixLowerCase %>Api;
    
    private <%- projectSuffixUpperCase %>Repository <%- projectSuffixLowerCase %>Repository;
    
    private TestPermissionManager permissionManager;
    
    private Runtime runtime;
    
    private it.water.core.api.model.User adminUser;
    <%if(isProtectedEntity){ -%>
    //declaring user for permissions tests
    private it.water.core.api.model.User managerUser;
    private it.water.core.api.model.User viewerUser;
    private it.water.core.api.model.User editorUser;
    
    //default is test role manager
    private RoleManager roleManager;
    private Role manager;
    private Role viewer;
    private Role editor;
    <% } -%>

    @Override
    public Option[] config() {
        return <%- projectSuffixUpperCase %>TestConfiguration.getConfiguration();
    }

    @Test
    public void test000_beforeAll() {
        componentRegistry = getOsgiService(ComponentRegistry.class);
        Assert.assertNotNull(componentRegistry);
        <%- projectSuffixLowerCase %>Api = componentRegistry.findComponent(<%- projectSuffixUpperCase %>Api.class,null);
        Assert.assertNotNull(<%- projectSuffixLowerCase %>Api);
        <%- projectSuffixLowerCase %>Repository = componentRegistry.findComponent(<%- projectSuffixUpperCase %>Repository.class,null);
        Assert.assertNotNull(<%- projectSuffixLowerCase %>Repository);
        permissionManager = componentRegistry.findComponent(TestPermissionManager.class,null);
        Assert.assertNotNull(permissionManager);
        runtime = componentRegistry.findComponent(Runtime.class,null);
        Assert.assertNotNull(runtime);
        <%if(isProtectedEntity){ -%>
        roleManager = componentRegistry.findComponent(RoleManager.class,null);
        Assert.assertNotNull(roleManager);
        //getting user
        manager = roleManager.getRole("<%- projectSuffixLowerCase %>Manager");
        viewer = roleManager.getRole("<%- projectSuffixLowerCase %>Viewer");
        editor = roleManager.getRole("<%- projectSuffixLowerCase %>Editor");
        Assert.assertNotNull(manager);
        Assert.assertNotNull(viewer);
        Assert.assertNotNull(editor);
        managerUser = permissionManager.addUser("manager", "name", "lastname", "manager@a.com", false);
        viewerUser = permissionManager.addUser("viewer", "name", "lastname", "viewer@a.com", false);
        editorUser = permissionManager.addUser("editor", "name", "lastname", "editor@a.com", false);
        //starting with admin permissions
        roleManager.addRole(managerUser.getId(), manager);
        roleManager.addRole(viewerUser.getId(), viewer);
        roleManager.addRole(editorUser.getId(), editor);
        //starting with admin
        <% } -%>
        //impersonate admin so we can test the happy path
        adminUser = permissionManager.addUser("admin", "name", "lastname", "admin@a.com", true);
        TestRuntimeInitializer.getInstance().impersonate(adminUser, runtime);
    }

    /**
     * Testing basic injection of basic component for <%- projectSuffixLowerCase %> entity.
     */
    @Test
    public void test001_componentsInsantiatedCorrectly() {
        this.<%- projectSuffixLowerCase %>Api = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Api.class, null);
        this.<%- projectSuffixLowerCase %>Repository = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Repository.class, null);
        Assert.assertNotNull(this.<%- projectSuffixLowerCase %>Api);
        Assert.assertNotNull(this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>SystemApi.class, null));
        Assert.assertNotNull(this.<%- projectSuffixLowerCase %>Repository);
    }

    /**
     * Testing simple save and version increment
     */
    @Test
    public void test002_saveOk() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(0);
        entity = this.<%- projectSuffixLowerCase %>Api.save(entity);
        Assert.assertEquals(new Long(1), entity.getEntityVersion());
        Assert.assertTrue(entity.getId() > 0);
        Assert.assertEquals("exampleField0", entity.getExampleField());
    }

    /**
     * Testing update logic, basic test
     */
    @Test
    public void test003_updateShouldWork() {
        Query q = this.<%- projectSuffixLowerCase %>Repository.getQueryBuilderInstance().createQueryFilter("exampleField=exampleField0");
        <%- projectSuffixUpperCase %> entity = this.<%- projectSuffixLowerCase %>Api.find(q);
        Assert.assertNotNull(entity);
        entity.setExampleField("exampleFieldUpdated");
        entity = this.<%- projectSuffixLowerCase %>Api.update(entity);
        Assert.assertEquals("exampleFieldUpdated", entity.getExampleField());
        Assert.assertEquals(new Long(2), entity.getEntityVersion());
    }

    /**
     * Testing update logic, basic test
     */
    @Test
    public void test004_updateShouldFailWithWrongVersion() {
        Query q = this.<%- projectSuffixLowerCase %>Repository.getQueryBuilderInstance().createQueryFilter("exampleField=exampleFieldUpdated");
        <%- projectSuffixUpperCase %> errorEntity = this.<%- projectSuffixLowerCase %>Api.find(q);
        Assert.assertEquals("exampleFieldUpdated", errorEntity.getExampleField());
        Assert.assertEquals(new Long(2), errorEntity.getEntityVersion());
        errorEntity.setEntityVersion(1);
        Assert.assertThrows(WaterRuntimeException.class, () -> this.<%- projectSuffixLowerCase %>Api.update(errorEntity));
    }

    /**
     * Testing finding all entries with no pagination
     */
    @Test
    public void test005_findAllShouldWork() {
        PaginableResult<<%- projectSuffixUpperCase %>> all = this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null);
        Assert.assertTrue(all.getResults().size() == 1);
    }

    /**
     * Testing finding all entries with settings related to pagination.
     * Searching with 5 items per page starting from page 1.
     */
    @Test
    public void test006_findAllPaginatedShouldWork() {
        for (int i = 2; i < 11; i++) {
            <%- projectSuffixUpperCase %> u = create<%- projectSuffixUpperCase %>(i);
            this.<%- projectSuffixLowerCase %>Api.save(u);
        }
        PaginableResult<<%- projectSuffixUpperCase %>> paginated = this.<%- projectSuffixLowerCase %>Api.findAll(null, 7, 1, null);
        Assert.assertEquals(7, paginated.getResults().size());
        Assert.assertEquals(1, paginated.getCurrentPage());
        Assert.assertEquals(2, paginated.getNextPage());
        paginated = this.<%- projectSuffixLowerCase %>Api.findAll(null, 7, 2, null);
        Assert.assertEquals(3, paginated.getResults().size());
        Assert.assertEquals(2, paginated.getCurrentPage());
        Assert.assertEquals(1, paginated.getNextPage());
    }

    /**
     * Testing removing all entities using findAll method.
     */
    @Test
    public void test007_removeAllShouldWork() {
        PaginableResult<<%- projectSuffixUpperCase %>> paginated = this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null);
        paginated.getResults().forEach(entity -> {
            this.<%- projectSuffixLowerCase %>Api.remove(entity.getId());
        });
        Assert.assertTrue(this.<%- projectSuffixLowerCase %>Api.countAll(null) == 0);
    }

    /**
     * Testing failure on duplicated entity
     */
    @Test
    public void test008_saveShouldFailOnDuplicatedEntity() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(1);
        this.<%- projectSuffixLowerCase %>Api.save(entity);
        <%- projectSuffixUpperCase %> duplicated = this.create<%- projectSuffixUpperCase %>(1);
        //cannot insert new entity wich breaks unique constraint
        Assert.assertThrows(DuplicateEntityException.class,() -> this.<%- projectSuffixLowerCase %>Api.save(duplicated));
        <%- projectSuffixUpperCase %> secondEntity = create<%- projectSuffixUpperCase %>(2);
        this.<%- projectSuffixLowerCase %>Api.save(secondEntity);
        entity.setExampleField("exampleField2");
        //cannot update an entity colliding with other entity on unique constraint
        Assert.assertThrows(DuplicateEntityException.class,() -> this.<%- projectSuffixLowerCase %>Api.update(entity));
    }

    /**
     * Testing failure on validation failure for example code injection
     */
    @Test
    public void test009_updateShouldFailOnValidationFailure() {
        <%- projectSuffixUpperCase %> newEntity = new <%- projectSuffixUpperCase %>("<script>function(){alert('ciao')!}</script>");
        Assert.assertThrows(ValidationException.class,() -> this.<%- projectSuffixLowerCase %>Api.save(newEntity));
    }
    <%if(isProtectedEntity){ -%>
    /**
     * Managers can do everything
     */
    @Test
    public void test010_managerCanDoEverything() {
        TestRuntimeInitializer.getInstance().impersonate(managerUser, runtime);
        <%- projectSuffixUpperCase %> newEntity = create<%- projectSuffixUpperCase %>(1);
        <%- projectSuffixUpperCase %> entity = this.<%- projectSuffixLowerCase %>Api.save(newEntity);
        Assert.assertNotNull(entity);
        entity.setExampleField("newUpdatedExampleField");
        this.<%- projectSuffixLowerCase %>Api.update(entity);
        this.<%- projectSuffixLowerCase %>Api.remove(entity.getId());
        newEntity = create<%- projectSuffixUpperCase %>(15);
        this.<%- projectSuffixLowerCase %>Api.save(newEntity);
    }

    /**
     * Viewers are authorized just to read content, not to alter it
     */
    @Test
    public void test011_viewerCannotSaveOrUpdateOrRemove() {
        TestRuntimeInitializer.getInstance().impersonate(viewerUser, runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(201);
        Assert.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.save(entity));
        //viewer can search
        <%- projectSuffixUpperCase %> found = this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null).getResults().stream().findFirst().get();
        this.<%- projectSuffixLowerCase %>Api.find(found.getId());
        //viewer cannot update or remove
        found.setExampleField("changeIt!");
        Assert.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.update(entity));
        Assert.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.remove(found.getId()));
    }

    /**
     * Editors can save or update but cannot remove
     */
    @Test
    public void test012_editorCannotRemove() {
        TestRuntimeInitializer.getInstance().impersonate(editorUser, runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(101);
        <%- projectSuffixUpperCase %> savedEntity = this.<%- projectSuffixLowerCase %>Api.save(entity);
        savedEntity.setExampleField("newSavedEntity");
        this.<%- projectSuffixLowerCase %>Api.update(entity);
        this.<%- projectSuffixLowerCase %>Api.find(savedEntity.getId());
        Assert.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.remove(savedEntity.getId()));
    }
    
    /**
     * Testing user with multiple roles on the same entity. Checking the at least minimum priviledge principle
     */
    @Test
    public void test013_usersWithViewerAndEditorRoleCannotRemove(){
        User crossRoleUser = permissionManager.addUser("crossRoleUser", "crossRoleUser", "crossRoleUser", "crossRoleUser@a.com", false);
        //assigning roles to the cross user
        roleManager.addRole(crossRoleUser.getId(), viewer);
        roleManager.addRole(crossRoleUser.getId(), editor);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(104);
        <%- projectSuffixUpperCase %> savedEntity = this.<%- projectSuffixLowerCase %>Api.save(entity);
        savedEntity.setExampleField("crossRoleUserUpdatedField");
        this.<%- projectSuffixLowerCase %>Api.update(entity);
        this.<%- projectSuffixLowerCase %>Api.find(savedEntity.getId());
        Assert.assertThrows(UnauthorizedException.class, () -> this.<%- projectSuffixLowerCase %>Api.remove(savedEntity.getId()));
    }
    <% } -%>
    private <%- projectSuffixUpperCase %> create<%- projectSuffixUpperCase %>(int seed){
        <%- projectSuffixUpperCase %> entity = new <%- projectSuffixUpperCase %>("exampleField"+seed);
        //todo add more fields here...
        return entity;
    }
}
