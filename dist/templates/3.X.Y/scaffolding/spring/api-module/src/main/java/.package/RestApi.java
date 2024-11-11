package <%- apiPackage %>.rest;
<% if(hasModel){ -%>
import <%-modelPackage%>.*;
<% } -%>
import it.water.core.api.model.PaginableResult;
import it.water.core.api.service.rest.RestApi;
import it.water.service.rest.api.security.LoggedIn;

import com.fasterxml.jackson.annotation.JsonView;
import it.water.core.api.service.rest.WaterJsonView;
import io.swagger.annotations.*;
import javax.ws.rs.core.MediaType;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
/**
 * @Generated by Water Generator
 * Rest Api Interface for <%- projectSuffixUpperCase %> entity.
 * This interfaces exposes all CRUD methods with Spring annotations.
 *
 */
@RequestMapping("<%- restContextRoot %>")
@Api(produces = MediaType.APPLICATION_JSON, tags = "<%- projectSuffixUpperCase %> API")
public interface <%- projectSuffixUpperCase %>RestApi extends RestApi {

<% if(applicationTypeEntity) {-%>    
    @LoggedIn
    @JsonView(WaterJsonView.Public.class)
    @PostMapping
    @ApiOperation(value = "/", notes = "<%- projectSuffixUpperCase %> Save API", httpMethod = "POST",consumes = MediaType.APPLICATION_JSON,produces = MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation"),
            @ApiResponse(code = 401, message = "Not authorized"),
            @ApiResponse(code = 409, message = "Validation Failed"),
            @ApiResponse(code = 422, message = "Duplicated Entity"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    ResponseEntity<<%- projectSuffixUpperCase %>> saveApi(@RequestBody <%- projectSuffixUpperCase %> <%- projectSuffixLowerCase %>);

    @LoggedIn
    @JsonView(WaterJsonView.Public.class)
    @PutMapping
    @ApiOperation(value = "/", notes = "<%- projectSuffixUpperCase %> Update API", httpMethod = "PUT", consumes = MediaType.APPLICATION_JSON,produces = MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation"),
            @ApiResponse(code = 401, message = "Not authorized"),
            @ApiResponse(code = 409, message = "Validation Failed"),
            @ApiResponse(code = 422, message = "Duplicated Entity"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    ResponseEntity<<%- projectSuffixUpperCase %>> updateApi(@RequestBody <%- projectSuffixUpperCase %> <%- projectSuffixLowerCase %>);

    @LoggedIn
    @JsonView(WaterJsonView.Public.class)
    @GetMapping("/{id}")
    @ApiOperation(value = "/{id}", notes = "<%- projectSuffixUpperCase %> Find API", httpMethod = "GET", consumes = MediaType.APPLICATION_JSON,produces = MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation"),
            @ApiResponse(code = 401, message = "Not authorized"),
            @ApiResponse(code = 409, message = "Validation Failed"),
            @ApiResponse(code = 422, message = "Duplicated Entity"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    ResponseEntity<<%- projectSuffixUpperCase %>> findApi(@PathVariable("id") long id);

    @LoggedIn
    @JsonView(WaterJsonView.Public.class)
    @GetMapping
    @ApiOperation(value = "/", notes = "<%- projectSuffixUpperCase %> Find All API", httpMethod = "GET", consumes = MediaType.APPLICATION_JSON,produces = MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation"),
            @ApiResponse(code = 401, message = "Not authorized"),
            @ApiResponse(code = 409, message = "Validation Failed"),
            @ApiResponse(code = 422, message = "Duplicated Entity"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    ResponseEntity<PaginableResult<<%- projectSuffixUpperCase %>>> findAllApi();

    @LoggedIn
    @JsonView(WaterJsonView.Public.class)
    @DeleteMapping("/{id}")
    @ApiOperation(value = "/{id}", notes = "<%- projectSuffixUpperCase %> Delete API", httpMethod = "DELETE", consumes = MediaType.APPLICATION_JSON,produces = MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation"),
            @ApiResponse(code = 401, message = "Not authorized"),
            @ApiResponse(code = 409, message = "Validation Failed"),
            @ApiResponse(code = 422, message = "Duplicated Entity"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    ResponseEntity<<%- projectSuffixUpperCase %>> removeApi(@PathVariable("id") long id);
<% } -%>    
}
