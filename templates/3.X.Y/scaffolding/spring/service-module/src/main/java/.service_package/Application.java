package <%-servicePackage%>;

import it.water.repository.jpa.spring.RepositoryFactory;
import it.water.implementation.spring.annotations.EnableWaterFramework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableWaterFramework
<%if(applicationTypeEntity) { -%>
@EnableJpaRepositories(basePackages={"it.water.*","<%-projectGroupId%>.*"},repositoryFactoryBeanClass = RepositoryFactory.class)
@EntityScan({"it.water.*","<%-projectGroupId%>.*"})
<% } -%>
public class <%- projectSuffixUpperCase %>Application {
	public static void main(String[] args) {
		SpringApplication.run(<%- projectSuffixUpperCase %>Application.class, args);
	}

}
