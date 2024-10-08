package <%-projectGroupId%>;

import it.water.core.api.bundle.Runtime;
import it.water.core.api.model.PaginableResult;
import it.water.core.api.registry.ComponentRegistry;
<%if(isProtectedEntity) {-%>
import it.water.core.api.service.Service;
import it.water.core.api.permission.Role;
import it.water.core.api.permission.RoleManager;
import it.water.core.api.model.User;
import it.water.core.api.permission.PermissionManager;
import it.water.core.permission.exceptions.UnauthorizedException;
<% } -%>
import it.water.core.model.exceptions.ValidationException;
import it.water.core.model.exceptions.WaterRuntimeException;
import it.water.core.testing.utils.api.TestPermissionManager;
import it.water.core.testing.utils.bundle.TestRuntimeInitializer;
import it.water.core.testing.utils.runtime.TestRuntimeUtils;

import <%-apiPackage%>.*;
<%if(hasModel){-%>
import <%-modelPackage%>.*;
<% } -%>
<%if(applicationTypeEntity){-%>
import <%-repositoryPackage%>.*;
import it.water.core.api.repository.query.Query;
import it.water.repository.entity.model.exceptions.DuplicateEntityException;
<% } -%>

import lombok.Setter;

import org.junit.FixMethodOrder;
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
    
    private static ComponentRegistry componentRegistry;
    private static <%- projectSuffixUpperCase %>Api <%- projectSuffixLowerCase %>Api;
    private static TestPermissionManager permissionManager;
    private static Runtime runtime;
    private static it.water.core.api.model.User adminUser;
<%if(applicationTypeEntity) { -%>
private static <%- projectSuffixUpperCase %>Repository <%- projectSuffixLowerCase %>Repository;
<% } -%>
    <%if(isProtectedEntity){ -%>
    
    //declaring user for permissions tests
    private static it.water.core.api.model.User managerUser;
    private static it.water.core.api.model.User viewerUser;
    private static it.water.core.api.model.User editorUser;
    
    //default is test role manager
    private static RoleManager roleManager;
    private static Role manager;
    private static Role viewer;
    private static Role editor;
    <% } -%>

    @Override
    public Option[] config() {
        return <%- projectSuffixUpperCase %>TestConfiguration.getConfiguration();
    }

    @Test
    public void test000_beforeAll() {
        componentRegistry = getOsgiService(ComponentRegistry.class);
        //waits for bundle to be deployed
        getOsgiService(<%- projectSuffixUpperCase %>Api.class);
        Assert.assertNotNull(componentRegistry);
        <%- projectSuffixLowerCase %>Api = componentRegistry.findComponent(<%- projectSuffixUpperCase %>Api.class,null);
        Assert.assertNotNull(<%- projectSuffixLowerCase %>Api);
<% if(applicationTypeEntity){ -%>        
        <%- projectSuffixLowerCase %>Repository = componentRegistry.findComponent(<%- projectSuffixUpperCase %>Repository.class,null);
        Assert.assertNotNull(<%- projectSuffixLowerCase %>Repository);
<% } -%>        
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
        TestRuntimeUtils.impersonateAdmin(componentRegistry);
<% } -%>
        //deafult user in test mode is admin please use TestRuntimeInitializer.getInstance().impersonate(...); to impersonate other users
    }

    /**
     * Testing basic injection of basic component for <%- projectSuffixLowerCase %> entity.
     */
    @Test
    public void test001_componentsInsantiatedCorrectly() {
        this.<%- projectSuffixLowerCase %>Api = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Api.class, null);
        Assert.assertNotNull(this.<%- projectSuffixLowerCase %>Api);
        Assert.assertNotNull(this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>SystemApi.class, null));
<%if(applicationTypeEntity){ -%>
        this.<%- projectSuffixLowerCase %>Repository = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Repository.class, null);
        Assert.assertNotNull(this.<%- projectSuffixLowerCase %>Repository);
<% } -%>        
    }
    
<%if(applicationTypeEntity){ -%>
    /**
     * Testing simple save and version increment
     */
    @Test
    public void test002_saveOk() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(0);
        entity = this.<%- projectSuffixLowerCase %>Api.save(entity);
        Assert.assertEquals(new Integer(1), entity.getEntityVersion());
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
        Assert.assertEquals(new Integer(2), entity.getEntityVersion());
    }

    /**
     * Testing update logic, basic test
     */
    @Test(expected = WaterRuntimeException.class)
    public void test004_updateShouldFailWithWrongVersion() {
        Query q = this.<%- projectSuffixLowerCase %>Repository.getQueryBuilderInstance().createQueryFilter("exampleField=exampleFieldUpdated");
        <%- projectSuffixUpperCase %> errorEntity = this.<%- projectSuffixLowerCase %>Api.find(q);
        Assert.assertEquals("exampleFieldUpdated", errorEntity.getExampleField());
        Assert.assertEquals(new Integer(2), errorEntity.getEntityVersion());
        errorEntity.setEntityVersion(1);
        this.<%- projectSuffixLowerCase %>Api.update(errorEntity);
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
    @Test(expected = WaterRuntimeException.class)
    public void test008_saveShouldFailOnDuplicatedEntity() {
        <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(1);
        this.<%- projectSuffixLowerCase %>Api.save(entity);
        <%- projectSuffixUpperCase %> duplicated = this.create<%- projectSuffixUpperCase %>(1);
        //cannot insert new entity wich breaks unique constraint
        try {
            this.<%- projectSuffixLowerCase %>Api.save(duplicated);
        } catch(Exception e){
            Assert.assertTrue(e instanceof DuplicateEntityException);
        }

        <%- projectSuffixUpperCase %> secondEntity = create<%- projectSuffixUpperCase %>(2);
        this.<%- projectSuffixLowerCase %>Api.save(secondEntity);
        entity.setExampleField("exampleField2");
        //cannot update an entity colliding with other entity on unique constraint
        this.<%- projectSuffixLowerCase %>Api.update(entity);
    }

    /**
     * Testing failure on validation failure for example code injection
     */
    @Test(expected = ValidationException.class)
    public void test009_updateShouldFailOnValidationFailure() {
        <%- projectSuffixUpperCase %> newEntity = new <%- projectSuffixUpperCase %>("<script>function(){alert('ciao')!}</script>");
        this.<%- projectSuffixLowerCase %>Api.save(newEntity);
    }
    <%if(isProtectedEntity){ -%>
    /**
     * Managers can do everything
     */
    @Test
    public void test010_managerCanDoEverything() {
        TestRuntimeInitializer.getInstance().impersonate(managerUser, runtime);
        <%- projectSuffixUpperCase %> newEntity = create<%- projectSuffixUpperCase %>(4);
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
    @Test( expected = UnauthorizedException.class)
    public void test011_viewerCannotSaveOrUpdateOrRemove() {
        TestRuntimeInitializer.getInstance().impersonate(viewerUser, runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(201);
        try {
            this.<%- projectSuffixLowerCase %>Api.save(entity);
        } catch(Exception e){
            Assert.assertTrue(e instanceof UnauthorizedException);
        }
        //viewer can search
        <%- projectSuffixUpperCase %> found = this.<%- projectSuffixLowerCase %>Api.findAll(null, -1, -1, null).getResults().stream().findFirst().get();
        this.<%- projectSuffixLowerCase %>Api.find(found.getId());
        //viewer cannot update or remove
        found.setExampleField("changeIt!");
        try {
            this.<%- projectSuffixLowerCase %>Api.update(entity);
        } catch(Exception e){
            Assert.assertTrue(e instanceof UnauthorizedException);
        }
        this.<%- projectSuffixLowerCase %>Api.update(entity);
    }

    /**
     * Editors can save or update but cannot remove
     */
    @Test(expected = UnauthorizedException.class)
    public void test012_editorCannotRemove() {
        TestRuntimeInitializer.getInstance().impersonate(editorUser, runtime);
        final <%- projectSuffixUpperCase %> entity = create<%- projectSuffixUpperCase %>(101);
        <%- projectSuffixUpperCase %> savedEntity = this.<%- projectSuffixLowerCase %>Api.save(entity);
        savedEntity.setExampleField("newSavedEntity");
        this.<%- projectSuffixLowerCase %>Api.update(entity);
        this.<%- projectSuffixLowerCase %>Api.find(savedEntity.getId());
        this.<%- projectSuffixLowerCase %>Api.remove(savedEntity.getId());
    }
    
    /**
     * Testing user with multiple roles on the same entity. Checking the at least minimum priviledge principle
     */
    @Test(expected = UnauthorizedException.class)
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
        this.<%- projectSuffixLowerCase %>Api.remove(savedEntity.getId());
    }
    <% } -%>
    private <%- projectSuffixUpperCase %> create<%- projectSuffixUpperCase %>(int seed){
        <%- projectSuffixUpperCase %> entity = new <%- projectSuffixUpperCase %>("exampleField"+seed);
        //todo add more fields here...
        return entity;
    }
<% } -%>    
}
