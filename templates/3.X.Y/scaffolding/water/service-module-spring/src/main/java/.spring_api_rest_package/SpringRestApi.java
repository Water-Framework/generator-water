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

package <%-apiPackage%>.rest.spring;
import it.water.core.api.*;
import <%-apiPackage%>.*;
import <%-modelPackage%>.*;

import org.springframework.web.bind.annotation.*;

/**
 * @Author Aristide Cittadino
 * Interface exposing same methods of its parent <%- projectSuffixUpperCase %>RestApi but adding Spring annotations.
 * Swagger annotation should be found because they have been defined in the parent <%- projectSuffixUpperCase %>RestApi.
 */
@RequestMapping("<%- restContextRoot %>")
@FrameworkRestApi
public interface <%- projectSuffixUpperCase %>SpringRestApi extends <%- projectSuffixUpperCase %>RestApi {
    @PostMapping
    <%- projectSuffixUpperCase %> save(<%- projectSuffixUpperCase %>  <%- projectSuffixLowerCase %>);

    @PutMapping
    <%- projectSuffixUpperCase %> update(<%- projectSuffixUpperCase %> <%- projectSuffixLowerCase %>);

    @GetMapping("/{id}")
    <%- projectSuffixUpperCase %> find(@PathVariable("id") long id);

    @GetMapping
    PaginableResult<<%- projectSuffixUpperCase %>> findAll();

    @DeleteMapping("/{id}")
    void remove(@PathVariable("id") long id);
}
