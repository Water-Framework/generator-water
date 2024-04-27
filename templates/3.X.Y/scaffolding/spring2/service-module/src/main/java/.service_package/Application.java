package <%-projectGroupId%>;

import it.water.implementation.spring.annotations.EnableWaterFramework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
<% if(applicationTypeEntity) {-%>
import it.water.repository.jpa.spring.RepositoryFactory;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;
<% } else {-%>
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
<% } -%>
import org.springframework.context.annotation.ComponentScan;
<%if(hasRestServices){ -%>
import springfox.documentation.swagger2.annotations.EnableSwagger2;
<% } -%>
<% if(applicationTypeEntity){ -%>
@SpringBootApplication
<% } else {-%>
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
<% }-%>
@EnableWaterFramework
<%if(applicationTypeEntity) { -%>
@EnableJpaRepositories(basePackages={"it.water.*","<%-projectGroupId%>.*"},repositoryFactoryBeanClass = RepositoryFactory.class)
@EntityScan({"it.water.*","<%-projectGroupId%>.*"})
<% } -%>
<%if(hasRestServices){ -%>
@EnableSwagger2
<% } -%>
@ComponentScan({"it.water.*","<%-projectGroupId%>.*"})
public class <%- projectSuffixUpperCase %>Application {
	public static void main(String[] args) {
		SpringApplication.run(<%- projectSuffixUpperCase %>Application.class, args);
	}

}
