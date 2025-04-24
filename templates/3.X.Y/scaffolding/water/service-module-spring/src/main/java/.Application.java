package <%-projectGroupId%>.service;


import it.water.implementation.spring.annotations.EnableWaterFramework;
import it.water.repository.jpa.spring.RepositoryFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableWaterFramework
@EnableJpaRepositories(basePackages = {"it.water", "<%-projectGroupId%>"}, repositoryFactoryBeanClass = RepositoryFactory.class)
@EntityScan({"it.water","<%-projectGroupId%>"})
@ComponentScan({"it.water", "<%-projectGroupId%>"})
public class <%-projectSuffixUpperCase%>Application {
    public static void main(String[] args) {
        SpringApplication.run(<%-projectSuffixUpperCase%>Application.class, args);
    }

}
