
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

package it.water.implementation.spring;

import it.water.implementation.spring.bundle.BaseSpringInitializer;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;


@Configuration
@ComponentScan("<%-groupId %>.*")
@ConfigurationPropertiesScan("<%-groupId %>.*")
@EnableAspectJAutoProxy
@EnableAutoConfiguration
public class <%- projectSuffixUpperCase %>ApplicationConfiguration {

    private static BaseSpringInitializer<Object> instance;

    public static BaseSpringInitializer<Object> getInstance() {
        if (instance == null)
            instance = new BaseSpringInitializer<>();
        return instance;
    }

    @Bean
    public BaseSpringInitializer<Object> waterBaseSpringInitializer() {
        return getInstance();
    }
}
