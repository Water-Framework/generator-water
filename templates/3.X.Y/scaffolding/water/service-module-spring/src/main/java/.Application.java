package <%-projectGroupId%>;


import it.water.implementation.spring.annotations.EnableWaterFramework;
import it.water.repository.jpa.spring.RepositoryFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableWaterFramework
@EnableJpaRepositories(basePackages = {"it.water.*", "it.water.<%-projectSuffixLowerCase%>.*"}, repositoryFactoryBeanClass = RepositoryFactory.class)
@EntityScan({"it.water.*"})
@ComponentScan({"it.water.*", "it.water.<%-projectSuffixLowerCase%>.*"})
public class <%-projectSuffixUpperCase%>Application {
    public static void main(String[] args) {
        SpringApplication.run(<%-projectSuffixUpperCase%>Applicatio.class, args);
    }

}
