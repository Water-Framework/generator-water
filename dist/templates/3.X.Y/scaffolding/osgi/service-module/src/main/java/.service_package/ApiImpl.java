package <%-servicePackage%>;

import <%-apiPackage%>.*;
<%if(hasModel){-%>
import <%-modelPackage%>.*;
<% } -%>
import it.water.core.api.permission.SecurityContext;
import it.water.core.api.registry.ComponentRegistry;
<% if(applicationTypeEntity) { -%>
import it.water.repository.service.BaseEntityServiceImpl;
<% } else {-%>
import it.water.core.service.BaseServiceImpl;
<% } -%>

import lombok.*;

import org.osgi.service.cdi.annotations.Bean;
import org.osgi.service.cdi.annotations.Reference;
import org.osgi.service.cdi.annotations.Service;
import org.osgi.service.cdi.annotations.SingleComponent;

import javax.inject.Inject;

<% 
let extendsStr = (applicationTypeEntity)?"BaseEntityServiceImpl<"+projectSuffixUpperCase+">":"BaseServiceImpl";
-%>

/**
 * @Generated by Water Generator
 * Service Api Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@SingleComponent
@Bean
@Service(value = <%- projectSuffixUpperCase %>Api.class)
public class <%- projectSuffixUpperCase %>ServiceImpl extends <%-extendsStr%> implements <%- projectSuffixUpperCase %>Api {

    @Getter
    @Setter
    @Reference
    @Inject
    private <%- projectSuffixUpperCase %>SystemApi systemService;

    @Getter
    @Setter
    @Reference
    @Inject
    private ComponentRegistry componentRegistry;

    public <%- projectSuffixUpperCase %>ServiceImpl() {
<% if(applicationTypeEntity) { -%>        
        super(<%- projectSuffixUpperCase %>.class);
<% } -%>
    }

    //todo: add custom logic here...
    //use getLog to retrieve Logger instance automatically instantiated for this class
}