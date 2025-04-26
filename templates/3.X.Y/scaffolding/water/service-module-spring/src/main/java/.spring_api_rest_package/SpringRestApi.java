/*
 * Copyright 2024 Aristide Cittadino
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package <%-servicePackage%>.rest.spring;
import <%-apiPackage%>.*;
import <%-apiPackage%>.rest.*;
<%if(hasModel){-%>
import <%-modelPackage%>.*;
<%}-%>

import it.water.core.api.model.PaginableResult;
import it.water.core.api.service.rest.FrameworkRestApi;
import it.water.core.api.service.rest.WaterJsonView;
import it.water.service.rest.api.security.LoggedIn;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

/**
 * @Author Aristide Cittadino
 * Interface exposing same methods of its parent <%- modelName %>RestApi but adding Spring annotations.
 * Swagger annotation should be found because they have been defined in the parent <%- modelName %>RestApi.
 */
@RequestMapping("<%- restContextRoot %>")
@FrameworkRestApi
public interface <%- modelName %>SpringRestApi extends <%- modelName %>RestApi {
    <%if(applicationTypeEntity){-%>
    @LoggedIn
    @PostMapping
    @JsonView(WaterJsonView.Public.class)
    <%- modelName %> save(@RequestBody <%- modelName %>  <%- modelNameLowerCase %>);

    @LoggedIn
    @PutMapping
    @JsonView(WaterJsonView.Public.class)
    <%- modelName %> update(@RequestBody <%- modelName %> <%- modelNameLowerCase %>);

    @LoggedIn
    @GetMapping("/{id}")
    @JsonView(WaterJsonView.Public.class)
    <%- modelName %> find(@PathVariable("id") long id);

    @LoggedIn
    @GetMapping
    @JsonView(WaterJsonView.Public.class)
    PaginableResult<<%- modelName %>> findAll();

    @LoggedIn
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @JsonView(WaterJsonView.Public.class)
    void remove(@PathVariable("id") long id);
    <%}-%>
}
