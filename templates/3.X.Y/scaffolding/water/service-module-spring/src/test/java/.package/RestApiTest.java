
package <%-projectGroupId%>;

import com.intuit.karate.junit5.Karate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = <%- projectSuffixUpperCase %>Application.class,
        webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@TestPropertySource(properties = {
        "water.rest.security.jwt.validate=false",
        "water.testMode=true"
})
public class <%- projectSuffixUpperCase %>RestApiTest {

    @Karate.Test
    Karate restInterfaceTest() {
        return Karate.run("../"+<%- projectSuffixUpperCase %>+"-service/src/test/resources/karate");
    }
}
