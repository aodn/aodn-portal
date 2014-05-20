
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>
<%@ page import="au.org.emii.portal.Layer" %>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="title"><g:message code="layer.title.label" default="Title" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'title', 'errors')}">
                                    <g:textField name="title" size="60" value="${layerInstance?.title}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="name"><g:message code="layer.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" size="60" value="${layerInstance?.name}" />
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
                                    <label for="server.id"><g:message code="layer.server.label" default="Server" /></label>
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
                                    <g:hiddenField name="dataSource" value="${layerInstance?.dataSource}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                   <g:message code="layer.activeInLastScan.label" default="Active in last scan" />
                                </td>
                                <td valign="top">
                                    ${layerInstance?.activeInLastScan}
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <g:message code="layer.layers.label" default="Layers" />
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'layers', 'errors')}">
                                    <g:each in="${layerInstance?.layers}">
                                        ${it}<br />
                                    </g:each>
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="bboxMinX"><g:message code="layer.bboxMinX.label" default="Bounding Box - Min X" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'bboxMinX', 'errors')}">
                                    <g:textField name="bboxMinX" maxlength="255" size="6" value="${layerInstance?.bboxMinX}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="bboxMinY"><g:message code="layer.bboxMinY.label" default="Bounding Box - Min Y" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'bboxMinY', 'errors')}">
                                    <g:textField name="bboxMinY" maxlength="255" size="6" value="${layerInstance?.bboxMinY}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="bboxMaxX"><g:message code="layer.bboxMaxX.label" default="Bounding Box - Max X" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'bboxMaxX', 'errors')}">
                                    <g:textField name="bboxMaxX" maxlength="255" size="6" value="${layerInstance?.bboxMaxX}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="bboxMaxY"><g:message code="layer.bboxMaxY.label" default="Bounding Box - Max Y" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'bboxMaxY', 'errors')}">
                                    <g:textField name="bboxMaxY" maxlength="255" size="6" value="${layerInstance?.bboxMaxY}" />
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
                                    <g:checkBox name="blacklisted" value="${layerInstance?.blacklisted}" />
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
                                    <label for="styles"><g:message code="layer.styles.label" default="Styles" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'styles', 'errors')}">
                                    <g:each in="${layerInstance?.styles}">
                                        ${it.name}<br />
                                    </g:each>
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="queryable"><g:message code="layer.queryable.label" default="Queryable" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'queryable', 'errors')}">
                                    <g:checkBox name="queryable" value="${true}"  /> <span class="hint">Defaulting to true.</span>
                                </td>
                            </tr>

                            <!-- Zoom override -->
                            <tr class="prop">
                              <td valign="top" class="name">
                                <label for="zoomOverride">Zoom Override</label>
                              </td>
                              <td valign="top" class="value">
                                <g:render template="zoomOverride"></g:render>
                              </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="filters"><g:message code="layer.filters.label" default="Layer Filters" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'filters', 'errors')}">
                                    <ul>
                                    <g:each in="${layerInstance?.filters?.sort(){it.label}}" var="filter">
                                        <g:if test="${filter.enabled}">
                                            <li><b><g:link controller="filter" action="edit" id="${filter.id}">${filter}</g:link></b></li>
                                        </g:if>
                                        <g:else>
                                            <li><i><g:link controller="filter" action="edit" id="${filter.id}">${filter}</g:link></i></li>
                                        </g:else>
                                     </g:each>
                                     </ul>
                                </td>
                            </tr>

                             <tr class="prop">
                                 <td valign="top" class="name">
                                 </td>
                                <td valign="top" class="value">
                                    <g:link controller="filter" action="create" params="[layerId: layerInstance.id]">Create Filter</g:link>
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <g:message code="layer.overrideMetadataUrl.label" default="Override Metadata URL" />
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'overrideMetadataUrl', 'errors')}">
                                    <g:textField name="overrideMetadataUrl" value="${layerInstance?.overrideMetadataUrl}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <g:message code="layer.overrideMetadataUrl.label" default="Metadata URLs" />
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'metadataUrls', 'errors')}">
                                    <g:each in="${layerInstance?.metadataUrls}">
                                        ${it}<br />
                                    </g:each>
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="layerHierarchyPath"><g:message code="layer.layerHierarchyPath.label" default="Layer Hierarchy Path" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'layerHierarchyPath', 'errors')}">
                                    ${layerInstance?.layerHierarchyPath}
                                </td>
                            </tr>

                            <tr class="prop"><td valign="top" class="name" colspan="2">&nbsp;</td></tr>

                            <tr class="prop">
                                <th valign="top" class="name" colspan="2">
                                    Data Download
                                </th>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label><g:message code="layer.wfsLayer.label" default="WFS Download Layer" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'wfsLayerId', 'errors')}">

                                    <g:render template="wfsSelectFilterScript"></g:render>
                                    <input id="inputFilter" /> (type to filter) <i>Currently only works in Firefox</i><br/>
                                    <g:select size="10" id="listofwfslayers" name="wfsLayerId" from="${Layer.findAllByActiveInLastScan(true).sort{it.toString()}}" optionKey="id" noSelection="${['':'- None selected -']}" value="${layerInstance?.wfsLayer?.id}"/>
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="urlDownloadFieldName"><g:message code="layer.urlDownloadFieldName.label" default="URL list download field (column) name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'urlDownloadFieldName', 'errors')}">
                                    <g:textField name="urlDownloadFieldName" value="${layerInstance?.urlDownloadFieldName}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="gogoduckLayerName"><g:message code="layer.gogoduckLayerName.label" default="Gogoduck override layer name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: layerInstance, field: 'gogoduckLayerName', 'errors')}">
                                    <g:textField name="gogoduckLayerName" value="${layerInstance?.gogoduckLayerName}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    AODAAC&nbsp;Linked&nbsp;Products
                                </td>
                                <td valign="top">
                                    <g:if test="${linkedAodaacProducts.size()}">
                                        <ul>
                                            <g:each in="${linkedAodaacProducts}" var="linkedProduct">
                                                <li>${linkedProduct.name}</li>
                                            </g:each>
                                        </ul>
                                    </g:if>
                                    <g:else>
                                        <i>No linked AODAAC products</i>
                                    </g:else>
                                </td>
                            </tr>

                            <tr class="prop"><td valign="top" class="name" colspan="2">&nbsp;</td></tr>
