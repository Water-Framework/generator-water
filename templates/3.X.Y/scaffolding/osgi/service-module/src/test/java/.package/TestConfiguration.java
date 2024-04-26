
/*
 * Copyright 2024 Aristide Cittadino
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package <%-testPackage%>;

import it.water.implementation.osgi.util.test.karaf.WaterTestConfigurationBuilder;
import org.ops4j.pax.exam.ConfigurationFactory;
import org.ops4j.pax.exam.Configuration;
import org.ops4j.pax.exam.Option;
import org.ops4j.pax.exam.karaf.options.ConfigurationPointer;
import org.ops4j.pax.exam.karaf.options.KarafDistributionConfigurationFileExtendOption;

public class <%- projectSuffixUpperCase %>TestConfiguration implements ConfigurationFactory {
    
    //Installing inside basic karaf water distribution the last build module
    //please make sure you have deployed it inside you maven local repository 
    protected static Option[] getConfiguration() {
        return new Option[]{
                new KarafDistributionConfigurationFileExtendOption(
                        new ConfigurationPointer("etc/org.apache.karaf.features.cfg", "featuresRepositories"),
                        ",mvn:<%-projectGroupId%>/<%- projectSuffixUpperCase %>-karaf-features/<%-projectVersion %>"
                                + "/xml/features"),
                new KarafDistributionConfigurationFileExtendOption(
                        new ConfigurationPointer("etc/org.apache.karaf.features.cfg", "featuresBoot"),
                        ",<%- projectSuffixLowerCase %>-feature"
                )
        };
    }

    @Override
    @Configuration
    public Option[] createConfiguration() {
        return WaterTestConfigurationBuilder.createStandardConfiguration()
                //supporting code coverage
                .withCodeCoverage("<%-projectGroupId%>.*")
                //remote debug on 5005 , but without waiting for connection, please set to true if you want to wait for debug connections
                .withDebug("5005", false)
                .withHttpPort("8080")
                //adding custom configuration in order to install the local bundle
                .append(getConfiguration())
                .build();
    }
}
