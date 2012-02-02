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
                                    <label for="namespace"><g:message code="layer.namespace.label" default="Namespace" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'namespace', 'errors')}">
                                    <g:textField name="namespace" value="${layerInstance?.namespace}" />
                                </td>
                            </tr>

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
                                   <g:message code="layer.dataSource.label" default="Data Source" />
                                </td>
                                <td valign="top">
                                    ${layerInstance?.dataSource}
                                    <g:hiddenField name="source" value="${layerInstance?.dataSource}" />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                   <g:message code="layer.activeInLastScan.label" default="Active in last scan" />
                                </td>
                                <td valign="top">
                                    ${layerInstance?.activeInLastScan}
                                    <g:hiddenField name="activeInLastScan" value="${layerInstance?.activeInLastScan}" />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="layers"><g:message code="layer.layers.label" default="Layers" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'layers', 'errors')}">
                                    ${layerInstance?.layers} Pull these in dynamically when harvesting starts
                                </td> 
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="bbox"><g:message code="layer.bbox.label" default="Bounding Box" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'bbox', 'errors')}">
                                    <g:textField name="bbox" maxlength="455" value="${layerInstance?.bbox}" />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="projection"><g:message code="layer.projection.label" default="Projection" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'projection', 'errors')}">
                                    <g:textField name="projection" maxlength="455" value="${layerInstance?.projection}" />
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
                                    <label for="blacklisted"><g:message code="layer.blacklisted.label" default="Blacklisted" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'blacklisted', 'errors')}">
                                    <g:checkBox name="disabled" value="${layerInstance?.blacklisted}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="abstractTrimmed"><g:message code="layer.abstractTrimmed.label" default="Abstract (trimmed)" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'abstractTrimmed', 'errors')}">
                                    <g:textField name="abstractTrimmed" maxlength="455" value="${layerInstance?.abstractTrimmed}" />
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