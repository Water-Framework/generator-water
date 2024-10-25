
package <%-projectGroupId%>;

import com.intuit.karate.junit5.Karate;
import org.springframework.boot.SpringApplication;
import it.water.core.api.registry.ComponentRegistry;
import it.water.core.testing.utils.runtime.TestRuntimeUtils;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;


@SpringBootTest(classes = <%- projectSuffixUpperCase %>.class,
        webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@TestPropertySource(properties = {
        "water.rest.security.jwt.validate=false",
        "water.testMode=true"
})
public class <%- projectSuffixUpperCase %>RestApiTest {

    @Autowired
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