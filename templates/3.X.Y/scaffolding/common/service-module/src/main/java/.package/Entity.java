package <%- modelPackage %>;

import it.water.repository.jpa.model.AbstractJpaEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;

/**
 * @Generated by Water Generator
 * This interface defines the externally exposed methods for the entity and allows interaction with it through a permission system.
 *
 */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Data
public class <%- projectSuffixUpperCase %> extends AbstractJpaEntity {

}