package <%-groupId %>;

import it.water.implementation.spring.annotations.EnableWaterFramework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableWaterFramework
public class <%- projectSuffixUpperCase %> {

	public static void main(String[] args) {
		SpringApplication.run(<%- projectSuffixUpperCase %>.class, args);
	}

}
