
package <%-serviceRestPackage%>;

import <%-apiPackage%>.*;
import <%-apiPackage%>.rest.*;
<%if(hasModel){-%>
import <%-modelPackage%>.*;
<% } -%>

<%if(applicationTypeEntity){ -%>
import it.water.core.api.service.BaseEntityApi;
import it.water.service.rest.persistence.BaseEntityRestApi;
<% } -%>
import it.water.core.api.service.rest.FrameworkRestController;
import it.water.core.interceptors.annotations.*;


import lombok.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

<%
    let extendsDeclaration = "";
    if(applicationTypeEntity){
        extendsDeclaration = "extends BaseEntityRestApi<"+modelName+">";
    }

-%>

/**
 * @Generated by Water Generator
 * Rest Api Class for <%- modelName %> entity.
 *
 */
@FrameworkRestController(referredRestApi = <%- modelName %>RestApi.class)
public class <%- modelName %>RestControllerImpl <%-extendsDeclaration%> implements <%- modelName %>RestApi {
    @SuppressWarnings("java:S1068") //still mantain the variable even if not used
    private static Logger log = LoggerFactory.getLogger(<%- modelName %>RestControllerImpl.class.getName());
    
    @Inject
    @Setter
    private <%- modelName %>Api <%- modelNameLowerCase %>Api;
<% if(applicationTypeEntity){ -%>
    @Override
    protected BaseEntityApi<<%- modelName %>> getEntityService() {
        return <%- modelNameLowerCase %>Api;
    }
<% } -%>
    //All CRUD methods are already exposed by <%- modelName %>RestApi interface with JAXRS Annotatiosn
    //if you need to check which methods are exposed please go to <%-apiPackage%>.rest.<%- modelName %>

    //todo add custom exposed methods or override CRUD operations
    //ATTENTION: use always <%- modelName %>Api in order to ensure the user is requesting operations has the right privileges to do it

}
