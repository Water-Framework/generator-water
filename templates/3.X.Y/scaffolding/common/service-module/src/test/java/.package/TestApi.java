package <%-projectGroupId%>;

import it.water.core.api.registry.ComponentRegistry;
import it.water.core.api.service.Service;
import it.water.core.interceptors.annotations.Inject;
import it.water.core.testing.utils.junit.WaterTestExtension;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;

import lombok.Setter;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;

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
    private <%- projectSuffixUpperCase %>SystemApi <%- projectSuffixLowerCase %>SystemApi;
    
    @Inject
    @Setter
    private <%- projectSuffixUpperCase %>Repository <%- projectSuffixLowerCase %>Repository;

    @Test
    @Order(1)
    public void componentsInsantiatedCorrectly() {
        this.<%- projectSuffixLowerCase %>Api = this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Api.class, null);
        Assertions.assertNotNull(this.<%- projectSuffixLowerCase %>Api);
        Assertions.assertNotNull(this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>SystemApi.class, null));
        Assertions.assertNotNull(this.componentRegistry.findComponent(<%- projectSuffixUpperCase %>Repository.class, null));
    }

    @Test
    @Order(2)
    public void saveOk() {
        
    }

    @Test
    @Order(3)
    public void findUserOk() {
        
    }

    @Test
    @Order(4)
    public void deleteUserOk() {
        
    }

}
