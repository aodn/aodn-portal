
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
                                    <label for="description"><g:message code="layer.keywords.label" default="Keywords" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'keywords', 'errors')}">
                                    <g:textField name="keywords" value="${layerInstance?.keywords}" />
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
                                    <label for="server"><g:message code="layer.server.label" default="Server" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'server', 'errors')}">
                                    <g:select name="server.id" from="${au.org.emii.portal.Server.list()}" optionKey="id" value="${layerInstance?.server?.id}"  />
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
                                    <label for="opacity"><g:message code="layer.opacity.label" default="Opacity" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'opacity', 'errors')}">
                                    <g:select name="opacity" from="${30..100}" value="${layerInstance?.opacity ?: 100}"  />
                                </td>
                            </tr>


                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="layers"><g:message code="layer.layers.label" default="Layers" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'layers', 'errors')}">
                                    <g:textField name="layers" value="${layerInstance?.layers}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="imageFormat"><g:message code="layer.imageFormat.label" default="Image Format" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'imageFormat', 'errors')}">
                                    <g:select name="imageFormat" from="${layerInstance.constraints.imageFormat.inList}" value="${layerInstance?.imageFormat}" valueMessagePrefix="layer.imageFormat"  />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="queryable"><g:message code="layer.queryable.label" default="Queryable" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'queryable', 'errors')}">
                                    <g:checkBox name="queryable" value="${true}"  /> Defaulting to true.
                                </td>
                            </tr>