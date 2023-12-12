package <%- apiPackage %>;

import it.acsoftware.hyperiot.base.api.entity.HyperIoTBaseRepository;

import <%- modelPackage %>.<%-projectSuffixUC%>;

/**
 * 
 * @author Aristide Cittadino Interface component for <%- projectSuffixUC %> Repository.
 *         It is used for CRUD operations,
 *         and to interact with the persistence layer.
 *
 */
public interface <%- projectSuffixUC %>Repository extends HyperIoTBaseRepository<<%- projectSuffixUC %>> {
	
}
