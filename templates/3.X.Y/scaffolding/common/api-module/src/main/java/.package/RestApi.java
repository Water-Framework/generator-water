package <%- apiPackage %>.rest;


import <%-modelPackage%>.*;

import it.water.core.api.model.PaginableResult;
import it.water.core.api.service.rest.FrameworkRestApi;
import it.water.core.api.service.rest.RestApi;

import io.swagger.annotations.Api;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * @Generated by Water Generator
 * Rest Api Interface for <%- projectSuffixUpperCase %> entity.
 * This interfaces exposes all CRUD methods with default JAXRS annotations.
 *
 */
@Path("/<%- projectSuffixLowerCase %>")
@Api(produces = MediaType.APPLICATION_JSON, tags = "<%- projectSuffixUpperCase %> API")
@FrameworkRestApi
public interface <%- projectSuffixUpperCase %>RestApi extends RestApi {
    
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    <%- projectSuffixUpperCase %> save(<%- projectSuffixUpperCase %> <%- projectSuffixLowerCase %>);

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    <%- projectSuffixUpperCase %> update(<%- projectSuffixUpperCase %> <%- projectSuffixLowerCase %>);

    @Path("/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    <%- projectSuffixUpperCase %> find(@PathParam("id") long id);

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    PaginableResult<<%- projectSuffixUpperCase %>> findAll();

    @Path("/{id}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    void remove(@PathParam("id") long id);
}
