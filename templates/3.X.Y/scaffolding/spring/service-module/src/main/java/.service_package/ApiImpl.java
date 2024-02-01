package <%-servicePackage%>;

import <%-apiPackage%>.*;
import <%-modelPackage%>.*;
import it.water.core.api.permission.SecurityContext;
import it.water.core.api.registry.ComponentRegistry;
import it.water.core.api.service.BaseEntitySystemApi;
import it.water.core.interceptors.annotations.*;
import it.water.repository.service.BaseEntityServiceImpl;

import lombok.*;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * @Generated by Water Generator
 * Service Api Class for <%- projectSuffixUpperCase %> entity.
 *
 */
@Service
public class <%- projectSuffixUpperCase %>ServiceImpl extends BaseEntityServiceImpl<<%- projectSuffixUpperCase %>> implements <%- projectSuffixUpperCase %>Api {

    @Autowired
    private <%- projectSuffixUpperCase %>SystemApi systemService;

    @Autowired
    private ComponentRegistry componentRegistry;

    public <%- projectSuffixUpperCase %>ServiceImpl() {
        super(<%- projectSuffixUpperCase %>.class);
    }

    @Override
    protected SecurityContext getSecurityContext() {
        return null;
    }

    //todo: add custom logic here...
    //use getLog to retrieve Logger instance automatically instantiated for this class
}
