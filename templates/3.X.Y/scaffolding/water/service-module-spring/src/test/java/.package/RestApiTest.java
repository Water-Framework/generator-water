
package <%-projectGroupId%>;

import com.intuit.karate.junit5.Karate;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

public class <%- projectSuffixUpperCase %>RestApiTest {
    private static ConfigurableApplicationContext context;

    @BeforeAll
    public static void beforeClass() {
        context = SpringApplication.run(<%- projectSuffixUpperCase %>Application.class);
    }

    @Karate.Test
    Karate restInterfaceTest() {
        return Karate.run("classpath:karate");
    }

    @AfterAll
    public static void afterClass() {
        // Arresta l'applicazione Spring Boot
        if (context != null) {
            context.close();
        }
    }

}
