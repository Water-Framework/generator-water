
package <%-projectGroupId%>;

import it.water.core.api.model.User;
import it.water.core.interceptors.annotations.Inject;
import it.water.core.testing.utils.api.TestPermissionManager;
import it.water.core.testing.utils.bundle.TestRuntimeInitializer;
import it.water.core.testing.utils.junit.WaterTestExtension;

import com.intuit.karate.junit5.Karate;
import it.water.core.testing.utils.junit.WaterTestExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(WaterTestExtension.class)
public class <%- projectSuffixUpperCase %>RestApiTest {

    @Inject
    @Setter
    //default permission manager in test environment;
    private static TestPermissionManager permissionManager;
    
    @Karate.Test
    Karate restInterfaceTest() {
        //impersonating admin before doing tests
        User admin = permissionManager.addUser("admin", "name", "lastname", "admin@a.com", true);
        TestRuntimeInitializer.getInstance().impersonate(admin);
        return Karate.run("classpath:karate");
    }
}
