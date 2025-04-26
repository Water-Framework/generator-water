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

<% if(applicationTypeEntity){ -%>
@SpringBootApplication
<% } else {-%>
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
<% }-%>
@EnableWaterFramework
<%if(applicationTypeEntity) { -%>
@EnableJpaRepositories(basePackages={"it.water","<%-projectGroupId%>"},repositoryFactoryBeanClass = RepositoryFactory.class)
@EntityScan({"it.water","<%-projectGroupId%>"})
<% } -%>
@ComponentScan({"it.water","<%-projectGroupId%>"})
public class <%- projectSuffixUpperCase %>Application {
	public static void main(String[] args) {
		SpringApplication.run(<%- projectSuffixUpperCase %>Application.class, args);
	}

}
