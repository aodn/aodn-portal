<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="baselayerMenu"><g:message code="config.contributorMenu.label" default="Default Base Layer Menu" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'baselayerMenu', 'errors')}">
                                    <g:select name="baselayerMenu.id" optionValue="title" from="${au.org.emii.portal.Menu.list()}" optionKey="id" value="${configInstance?.baselayerMenu?.id}" noSelection="${['null':'- None selected -']}" />
                                    <font class="hint"></font>
                                </td>
                            </tr>
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="defaultMenu"><g:message code="config.defaultMenu.label" default="Default Layers Menu" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'defaultMenu', 'errors')}">
                                    <g:select name="defaultMenu.id" optionValue="title" from="${au.org.emii.portal.Menu.list()}" optionKey="id" value="${configInstance?.defaultMenu?.id}" noSelection="${['null':'- None selected -']}" />
                                </td>
                            </tr>


                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="defaultLayers"><g:message code="config.defaultLayers.label" default="Default Layers" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'defaultLayers', 'errors')}">
                                    <div class="showItems">
                                      <ul id="pickedItems1" class="sortableList">
                                      </ul>
                                       <input type="hidden" class="this_is_a_gimp_entry_in_case_of_no_value_from_theselectr_below" name="defaultLayers" />
                                      <select id="showItems1"  multiple="multiple">
                                          <g:each in="${au.org.emii.portal.Layer.findAllByIsBaseLayerNotEqual(true)}">
                                              <option value="${it.id}">${it}</option>
                                          </g:each>
                                      </select>
                                      </div>

                                </td>
                            </tr>


                             <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="enableMOTD"><g:message code="config.enableMOTD.label" default="Enable MOTD" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'enableMOTD', 'errors')}">
                                    <g:checkBox name="enableMOTD" value="${configInstance?.enableMOTD}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="motd"><g:message code="config.motd.label" default="MOTD" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'motd', 'errors')}">
                                    <g:select name="motd.id" from="${au.org.emii.portal.Motd.list()}" optionKey="id" value="${configInstance?.motd?.id}"  />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="motdStart"><g:message code="config.motdStart.label" default="MOTD Start" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'motdStart', 'errors')}">
                                    <g:datePicker name="motdStart" precision="minute" value="${configInstance?.motdStart}"  />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="motdEnd"><g:message code="config.motdEnd.label" default="MOTD End" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'motdEnd', 'errors')}">
                                    <g:datePicker  name="motdEnd" precision="minute" value="${configInstance?.motdEnd}"  />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="mapGetFeatureInfoBuffer"><g:message code="config.mapGetFeatureInfoBuffer.label" default="Pixel radius to use for map clicks with GetFeatureInfo dialog" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'mapGetFeatureInfoBuffer', 'errors')}">
                                    <g:textField size="2" name="mapGetFeatureInfoBuffer" value="${configInstance?.mapGetFeatureInfoBuffer}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="wmsScannerCallbackPassword"><g:message code="config.wmsScannerCallbackPassword.label" default="WMS Scanner Callback Password" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'wmsScannerCallbackPassword', 'errors')}">
                                    <g:textField size="30" name="wmsScannerCallbackPassword" value="${configInstance?.wmsScannerCallbackPassword}" /><span class="hint">Simple password for protecting callback. WMS Scanner jobs must be updated after this has been changed.</span>
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="wfsScannerCallbackPassword"><g:message code="config.wfsScannerCallbackPassword.label" default="WFS Scanner Callback Password" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'wfsScannerCallbackPassword', 'errors')}">
                                    <g:textField size="30" name="wfsScannerCallbackPassword" value="${configInstance?.wfsScannerCallbackPassword}" /><span class="hint">Simple password for protecting callback. WFS Scanner jobs must be updated after this has been changed.</span>
                                </td>
                            </tr>
