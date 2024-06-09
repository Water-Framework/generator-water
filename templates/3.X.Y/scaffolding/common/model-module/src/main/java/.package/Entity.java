package <%- modelPackage %>;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.water.repository.jpa.model.AbstractJpaEntity;
import it.water.core.api.service.rest.WaterJsonView;
<%if(isProtectedEntity || isOwnedEntity){-%>
import it.water.core.api.entity.owned.OwnedResource;
import it.water.core.api.permission.*;
import it.water.core.permission.action.CrudActions;
import it.water.core.permission.annotations.AccessControl;
import it.water.core.permission.annotations.DefaultRoleAccess;
<% } -%>
import lombok.*;
<% if(validationLib === 'javax') {-%>
import it.water.core.validation.javax.annotations.*;
<% } else if(validationLib === 'jakarta'){ -%>
import it.water.core.validation.annotations.*;
<% } -%>
import <%-persistenceLib%>.persistence.*;
import <%-validationLib%>.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;

<%
 let implementedInterfaces = "";
 let defineActionsAndRolesAnnotation = "";
 if(isProtectedEntity || isOwnedEntity){
   implementedInterfaces += " implements ";
   if(isProtectedEntity){
        defineActionsAndRolesAnnotation = ''+
            '//Actions and default roles access\n'+
            '@AccessControl(availableActions = {CrudActions.SAVE, CrudActions.UPDATE, CrudActions.FIND, CrudActions.REMOVE},\n'+
            'rolesPermissions = {\n'+
            '       //Admin role can do everything\n'+
            '        @DefaultRoleAccess(roleName = '+projectSuffixUpperCase+'.DEFAULT_MANAGER_ROLE, actions = {CrudActions.SAVE, CrudActions.UPDATE, CrudActions.FIND,CrudActions.FIND_ALL, CrudActions.REMOVE}),\n'+
            '        //Viwer has read only access\n'+
            '        @DefaultRoleAccess(roleName = '+projectSuffixUpperCase+'.DEFAULT_VIEWER_ROLE, actions = {CrudActions.FIND,CrudActions.FIND_ALL}),\n'+
            '        //Editor can do anything but remove\n'+
            '        @DefaultRoleAccess(roleName = '+projectSuffixUpperCase+'.DEFAULT_EDITOR_ROLE, actions = {CrudActions.SAVE, CrudActions.UPDATE, CrudActions.FIND,CrudActions.FIND_ALL})\n'+
            '})';
     implementedInterfaces += "ProtectedEntity"
   }
   
   if(isOwnedEntity){
        if(isProtectedEntity)
            implementedInterfaces += ", ";
        implementedInterfaces += "OwnedResource "
   }
 }
-%>

/**
 * @Generated by Water Generator
 * <%- projectSuffixUpperCase %> Entity Class.
 *
 */
//JPA
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"exampleField"})) //example of unique constraint
@Access(AccessType.FIELD)
//Lombok
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@RequiredArgsConstructor
@Getter
@Setter(AccessLevel.PROTECTED)
@ToString
@EqualsAndHashCode(of = {"id","exampleField"/*todo add more fields for equals and hashcode, remember hashcode and equals are key methods for ORMs*/})
<%- defineActionsAndRolesAnnotation -%>
public class <%- projectSuffixUpperCase %> extends AbstractJpaEntity<%-implementedInterfaces%> {
    
<%if (isProtectedEntity){ -%>
    public static final String DEFAULT_MANAGER_ROLE = "<%- projectSuffixLowerCase %>Manager";
    public static final String DEFAULT_VIEWER_ROLE = "<%- projectSuffixLowerCase %>Viewer";
    public static final String DEFAULT_EDITOR_ROLE = "<%- projectSuffixLowerCase %>Editor";
<% } -%>
    //insert fields...

    //Explanatation: in order to have better code management objects should be encapsulated correctly:
    //public Constructor should be used with required fields (no no-arg constructor, infact water generates the protected default constructor)
    //only relevant setter methods should be exposed outside
    //this approach generates less code and helps in the test coverage phase

    /*
    Example:
    */

    @NoMalitiusCode// --> check to avoid code injections 
    @NotNull //--> field required for rest api 
    @NotNullOnPersist //--> field is required on the database
    @NonNull //--> field is required in the constructor
    @Setter
    @JsonView(WaterJsonView.Public.class) //this fields will be visibile in crud responses
    private String exampleField; 

<% if(isOwnedEntity){ -%>
    @Override
    @JsonIgnore
    public it.water.core.api.model.User getUserOwner() {
        //todo add logic to return the user who owns this entity
        return null;
    }

    @Override
    public void setUserOwner(it.water.core.api.model.User user) {
        //todo add logic to set the user who owns this entity
    }
<% } -%>
}