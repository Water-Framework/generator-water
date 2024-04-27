package <%-servicePackage%>;

import <%-apiPackage%>.*;
<%if(hasModel){-%>
import <%-modelPackage%>.*;
<% } -%>
import it.water.core.api.registry.filter.ComponentFilterBuilder;
<% if(applicationTypeEntity) { -%>
import it.water.repository.service.BaseEntitySystemServiceImpl;
<% } else { -%>
import it.water.core.service.BaseSystemServiceImpl;
<% } -%>

import org.osgi.service.cdi.annotations.Bean;
import org.osgi.service.cdi.annotations.Reference;
import org.osgi.service.cdi.annotations.Service;
import org.osgi.service.cdi.annotations.SingleComponent;

import lombok.*;
import javax.inject.Inject;

<% 
let extendsStr = (applicationTypeEntity)?"BaseEntitySystemServiceImpl<"+projectSuffixUpperCase+">":"BaseSystemServiceImpl";
-%>
/**
 * @Generated by Water Generator
 * System Service Api Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@SingleComponent
@Bean
@Service(value = <%- projectSuffixUpperCase %>SystemApi.class)
public class <%- projectSuffixUpperCase %>SystemServiceImpl extends <%-extendsStr%> implements <%- projectSuffixUpperCase %>SystemApi {
<%if(applicationTypeEntity){ -%>
    @Getter
    @Setter
    @Reference
    @Inject
    private <%- projectSuffixUpperCase %>Repository repository;

    @Getter
    @Setter
    @Reference
    @Inject
    private ComponentFilterBuilder componentFilterBuilder;

    public <%- projectSuffixUpperCase %>SystemServiceImpl() {
        super(<%- projectSuffixUpperCase %>.class);
    }
<% } -%>
    //todo: add custom logic here...

    //1. use getLog to retrieve Logger instance automatically instantiated for this class
    //2. Use componentFilterBuilder, if needed, in order to create filters to retrieve components from the service registry

}