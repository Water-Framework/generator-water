package <%- apiPackage %>;

import it.acsoftware.hyperiot.base.api.entity.HyperIoTBaseEntitySystemApi;

import <%- modelPackage %>.<%- projectSuffixUpperCase %>;

/**
 * 
 * This interface defines the internally exposed methods for the entity and allows interaction with it bypassing permission system.
 * The main goals of <%- projectSuffixUpperCase %>SystemApi is to validate the entity and pass it to the persistence layer.
 *
 */
public interface <%- projectSuffixUpperCase %>SystemApi extends HyperIoTBaseEntitySystemApi<<%- projectSuffixUpperCase %>> {

}