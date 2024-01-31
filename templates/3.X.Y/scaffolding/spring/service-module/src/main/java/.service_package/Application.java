package <%-servicePackage%>;

import it.water.implementation.spring.annotations.EnableWaterFramework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableWaterFramework
public class <%- projectSuffixUpperCase %>Application {

	public static void main(String[] args) {
		SpringApplication.run(<%- projectSuffixUpperCase %>Application.class, args);
	}

}
