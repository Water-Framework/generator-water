package <%- apiPackage %>;

import it.water.core.api.repository.BaseRepository;
import it.water.core.interceptors.annotations.*;
import <%- modelPackage %>.<%-projectSuffixUpperCase %>;

/**
 * @Generated by Water Generator
 * Interface component for <%- projectSuffixUpperCase %> Repository.
 * It is used for CRUD operations, and to interact with the persistence layer.
 *
 */
public interface <%- projectSuffixUpperCase %>Repository extends BaseRepository<<%- projectSuffixUpperCase %>> {
	
}
