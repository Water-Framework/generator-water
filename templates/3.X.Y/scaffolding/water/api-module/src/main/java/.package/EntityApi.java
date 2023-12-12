package <%- apiPackage %>;

import it.acsoftware.hyperiot.base.api.entity.HyperIoTBaseEntityApi;

import <%- modelPackage %>.<%- projectSuffixUpperCase %>;

/**
 * 
 * This interface defines the externally exposed methods for the entity and allows interaction with it through a permission system.
 *
 */
public interface <%- projectSuffixUpperCase %>Api extends HyperIoTBaseEntityApi<<%- projectSuffixUpperCase %>> {

}