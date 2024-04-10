
package <%-serviceRestPackage%>;

import <%-apiPackage%>.*;
import <%-apiPackage%>.rest.*;
import <%-modelPackage%>.*;
import it.water.service.rest.persistence.BaseEntityRestApi;
import it.water.core.api.model.PaginableResult;
import it.water.core.api.service.rest.FrameworkRestController;

import lombok.*;

import org.osgi.service.component.annotations.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
<%
    let extendsDeclaration = "";
    if(applicationTypeEntity){
        extendsDeclaration = "extends BaseEntityRestApi<"+projectSuffixUpperCase+">";
    }

-%>
/**
 * @Generated by Water Generator
 * Rest Api Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@FrameworkRestController(referredRestApi = <%- projectSuffixUpperCase %>RestApi.class)
public class <%- projectSuffixUpperCase %>RestControllerImpl <%-extendsDeclaration%> implements <%- projectSuffixUpperCase %>RestApi {
    private static Logger log = LoggerFactory.getLogger(<%- projectSuffixUpperCase %>RestControllerImpl.class.getName());

    @Reference
    @Getter
    private <%- projectSuffixUpperCase %>Api entityService;

    //todo add custom exposed methods or override CRUD operations
    //ATTENTION: use always <%- projectSuffixLowerCase %>Api object in order to ensure the user is requesting operations has the right privileges to do it
}