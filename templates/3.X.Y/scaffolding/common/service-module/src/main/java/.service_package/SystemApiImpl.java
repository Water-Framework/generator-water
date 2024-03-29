package <%-servicePackage%>;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;
import it.water.core.api.registry.filter.ComponentFilterBuilder;
import it.water.core.interceptors.annotations.*;

import it.water.repository.service.BaseEntitySystemServiceImpl;

import lombok.*;

/**
 * @Generated by Water Generator
 * System Service Api Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@FrameworkComponent
public class <%- projectSuffixUpperCase %>SystemServiceImpl extends BaseEntitySystemServiceImpl< <%- projectSuffixUpperCase %>> implements <%- projectSuffixUpperCase %>SystemApi {

    @Inject
    @Getter
    @Setter
    private <%- projectSuffixUpperCase %>Repository repository;

    @Inject
    @Setter
    private ComponentFilterBuilder componentFilterBuilder;

    public <%- projectSuffixUpperCase %>SystemServiceImpl() {
        super(<%- projectSuffixUpperCase %>.class);
    }

    //todo: add custom logic here...

    //1. use getLog to retrieve Logger instance automatically instantiated for this class
    //2. Use componentFilterBuilder, if needed, in order to create filters to retrieve components from the service registry

}