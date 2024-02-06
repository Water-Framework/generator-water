
package <%-serviceRestPackage%>;

import <%-apiPackage%>.*;
import <%-apiPackage%>.rest.*;
import <%-modelPackage%>.*;

import it.water.core.api.service.BaseEntityApi;
import it.water.core.api.service.rest.FrameworkRestController;
import it.water.core.interceptors.annotations.*;
import it.water.service.rest.persistence.BaseEntityRestApi;

import lombok.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @Generated by Water Generator
 * Rest Api Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@FrameworkRestController(referredRestApi = <%- projectSuffixUpperCase %>RestApi.class)
public class <%- projectSuffixUpperCase %>RestControllerImpl extends BaseEntityRestApi<<%- projectSuffixUpperCase %>> implements <%- projectSuffixUpperCase %>RestApi {
    private static Logger log = LoggerFactory.getLogger(<%- projectSuffixUpperCase %>RestControllerImpl.class.getName());
    
    @Inject
    @Setter
    private <%- projectSuffixUpperCase %>Api <%- projectSuffixLowerCase %>Api;

    @Override
    protected BaseEntityApi<<%- projectSuffixUpperCase %>> getEntityService() {
        return <%- projectSuffixLowerCase %>Api;
    }

    //All CRUD methods are already exposed by <%- projectSuffixUpperCase %>RestApi interface with JAXRS Annotatiosn
    //if you need to check which methods are exposed please go to <%-apiPackage%>.rest.<%- projectSuffixUpperCase %>

    //todo add custom exposed methods or override CRUD operations
    //ATTENTION: use always <%- projectSuffixLowerCase %>Api in order to ensure the user is requesting operations has the right privileges to do it

}
