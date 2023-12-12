package <%- apiPackage %>;

import it.acsoftware.hyperiot.base.api.entity.HyperIoTBaseRepository;

import <%- modelPackage %>.<%-projectSuffixUpperCase %>;

/**
 * 
 * Interface component for <%- projectSuffixUpperCase %> Repository.
 * It is used for CRUD operations, and to interact with the persistence layer.
 *
 */
public interface <%- projectSuffixUpperCase %>Repository extends HyperIoTBaseRepository<<%- projectSuffixUpperCase %>> {
	
}
