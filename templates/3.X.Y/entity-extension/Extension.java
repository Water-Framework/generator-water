package it.water.user.extension;

import it.water.core.api.model.BaseEntity;
import it.water.core.api.service.EntityExtensionService;
import it.water.core.interceptors.annotations.FrameworkComponent;
import <%-modelPackage%>;

import lombok.Setter;

@FrameworkComponent(properties = EntityExtensionService.RELATED_ENTITY_PROPERTY+"=<%-entityClassToExtend%>")
public class <%-extendendModelName%>ExtensionService implements EntityExtensionService {

    //supporting spring properties
    @Setter
    private String waterEntityExtensionType = "<%-entityClassToExtend%>";

    @Override
    public Class<? extends BaseEntity> relatedType() {
        return <%-entityClassToExtend%>.class;
    }

    @Override
    public Class<? extends BaseEntity> type() {
        return <%-extendendModelName%>.class;
    }
}
