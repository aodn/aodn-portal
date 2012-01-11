
                             <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="server"><g:message code="layer.server.label" default="Server" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'server', 'errors')}">
                                    <g:select name="server.id" from="${au.org.emii.portal.Server.list()}" optionKey="id" value="${layerInstance?.server?.id}"  />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                   <g:message code="layer.source.label" default="Source" />
                                </td>
                                <td valign="top">
                                    ${layerInstance?.source}
                                    <g:hiddenField name="source" value="${layerInstance?.source}" />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                   <g:message code="layer.currentlyActive.label" default="Currently Active" />
                                </td>
                                <td valign="top">
                                    ${layerInstance?.currentlyActive}
                                    <g:hiddenField name="currentlyActive" value="${layerInstance?.currentlyActive}" />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="layers"><g:message code="layer.layers.label" default="Layers" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'layers', 'errors')}">
                                    <g:textField name="layers" value="${layerInstance?.layers}" /> Pull these in dynamically when harvesting starts
                                </td> 
                            </tr>
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="isBaseLayer"><g:message code="layer.isBaseLayer.label" default="IsBaseLayer" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'isBaseLayer', 'errors')}">
                                    <g:checkBox name="isBaseLayer" value="${layerInstance?.isBaseLayer}"  />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="name"><g:message code="layer.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" maxlength="25" value="${layerInstance?.name}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="disabled"><g:message code="layer.disabled.label" default="Disabled" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'disabled', 'errors')}">
                                    <g:checkBox name="disabled" value="${layerInstance?.disabled}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="description"><g:message code="layer.description.label" default="Description" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'description', 'errors')}">
                                    <g:textField name="description" maxlength="55" value="${layerInstance?.description}" />
                                </td>
                            </tr>

                           

                          
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="cache"><g:message code="layer.cache.label" default="Cache" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'cache', 'errors')}">
                                    <g:checkBox name="cache" value="${layerInstance?.cache}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="cql"><g:message code="layer.cql.label" default="Cql" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'cql', 'errors')}">
                                    <g:textField name="cql" value="${layerInstance?.cql}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="style"><g:message code="layer.style.label" default="Style" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'style', 'errors')}">
                                    <g:textField name="style" value="${layerInstance?.style}" />
                                </td>
                            </tr>

                            
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="layers"><g:message code="layer.metaUrl.label" default="Metadata Url" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'metaUrl', 'errors')}">
                                    <g:textField name="metaUrl" value="${layerInstance?.metaUrl}" />
                                </td>
                            </tr>


                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="queryable"><g:message code="layer.queryable.label" default="Queryable" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'queryable', 'errors')}">
                                    <g:checkBox name="queryable" value="${true}"  /> <font class="hint">Defaulting to true.</font>
                                </td>
                            </tr>
