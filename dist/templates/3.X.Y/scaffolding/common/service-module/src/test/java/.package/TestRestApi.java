
package <%-projectGroupId%>;

import it.water.core.api.service.Service;

import it.water.core.api.registry.ComponentRegistry;
import com.intuit.karate.junit5.Karate;
import it.water.core.interceptors.annotations.Inject;
import it.water.core.testing.utils.junit.WaterTestExtension;
import it.water.core.testing.utils.runtime.TestRuntimeUtils;
import org.junit.jupiter.api.extension.ExtendWith;
import lombok.Setter;
import org.junit.jupiter.api.BeforeEach;

@ExtendWith(WaterTestExtension.class)
public class <%- projectSuffixUpperCase %>RestApiTest implements Service {

    @Inject
    @Setter
    private ComponentRegistry componentRegistry;

    @BeforeEach
    void impersonateAdmin() {
        //jwt token service is disabled, we just inject admin user for bypassing permission system
        //just remove this line if you want test with permission system working
        TestRuntimeUtils.impersonateAdmin(componentRegistry);
    }
    
    @Karate.Test
    Karate restInterfaceTest() {
        return Karate.run("classpath:karate");
    }
}
