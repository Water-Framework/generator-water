
package <%-projectGroupId%>;

import com.intuit.karate.KarateOptions;
import com.intuit.karate.junit4.Karate;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.ops4j.pax.exam.TestContainer;
import org.ops4j.pax.exam.spi.PaxExamRuntime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.awaitility.Awaitility.await;
import static java.util.concurrent.TimeUnit.SECONDS;

/**
 * Generated with Water Generator.
 * Test class for BookOsgi Rest Services using karaf and karate.
 *
 */
@RunWith(Karate.class)
@KarateOptions(features = "classpath:karate")
public class <%- projectSuffixUpperCase %>RestApiTest {

    private static final Logger log = LoggerFactory.getLogger(BookRestApiTest.class);
    private static TestContainer testContainer;

    @BeforeClass
    public static void test000_runKaraf() throws Exception {
        //Running karaf externally
        testContainer = PaxExamRuntime.createContainer(BookTestConfiguration.class.getName());
        HttpClient httpClient = HttpClients.createDefault();
        HttpGet request = new HttpGet("http://localhost:8080/water/status");
        await().pollInterval(5,SECONDS).atMost(30, SECONDS).until(() -> {
            log.info("Checking http services are online...");
            HttpResponse response = httpClient.execute(request);
            return response.getStatusLine().getStatusCode() >= 200 && response.getStatusLine().getStatusCode() < 300;
        });
    }

    @AfterClass
    public static void afterClass() {
        testContainer.stop();
    }
}
