
package <%-projectGroupId%>;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.Assert;
import org.junit.Test;
import org.ops4j.pax.exam.TestContainer;
import org.ops4j.pax.exam.spi.PaxExamRuntime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Generated with Water Generator.
 * Test class for BookOsgi Rest Services using karaf and karate.
 *
 */
public class <%- projectSuffixUpperCase %>RestApiTest {

    private Logger log = LoggerFactory.getLogger(<%- projectSuffixUpperCase %>RestApiTest.class);
    @Test
    public void test000_runKaraf() throws Exception {
        //Running karaf externally
        TestContainer testContainer = PaxExamRuntime.createContainer(<%- projectSuffixUpperCase %>TestConfiguration.class.getName());
        Thread.sleep(5000);
        //Running karate tests
        Results results = Runner.path("classpath:karate").parallel(1);
        if(results.getFailCount() > 0){
            List<String> errors = results.getErrors();
            errors.forEach(error -> log.error("\n ERROR: "+error));
        }
        Assert.assertEquals(0,results.getFailCount());
        //Stopping karaf
        testContainer.stop();
    }
}
