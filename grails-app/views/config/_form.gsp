   <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="name"><g:message code="config.name.label" default="Site Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" maxlength="25" value="${configInstance?.name}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="proxy"><g:message code="config.proxy.label" default="Proxy" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'proxy', 'errors')}">
                                    <g:textField name="proxy" value="${configInstance?.proxy}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="proxyPort"><g:message code="config.proxyPort.label" default="Proxy Port" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'proxyPort', 'errors')}">
                                    <g:textField name="proxyPort" value="${fieldValue(bean: configInstance, field: 'proxyPort')}" />
                                </td>
                            </tr>
   
                           <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="catalogUrl"><g:message code="config.catalogUrl.label" default="Catalog Url" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'catalogUrl', 'errors')}">
                                    <g:textField size="70" name="catalogUrl" value="${configInstance?.catalogUrl}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="initialBbox"><g:message code="config.initialBbox.label" default="Initial bBox" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'initialBbox', 'errors')}">
                            <g:textField name="initialBbox" maxlength="50" value="${configInstance?.initialBbox}" /> <font class="hint">(left,bottom,right,top)</font>
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="defaultMenu"><g:message code="config.defaultMenu.label" default="Default Menu" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'defaultMenu', 'errors')}">
                                    <g:select name="defaultMenu.id" optionValue="title" from="${au.org.emii.portal.Menu.list()}" optionKey="id" value="${configInstance?.defaultMenu?.id}"  />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="contributorMenu"><g:message code="config.contributorMenu.label" default="Contributor Menu" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'contributorMenu', 'errors')}">
                                    <g:select name="contributorMenu.id" optionValue="title" from="${au.org.emii.portal.Menu.list()}" optionKey="id" value="${configInstance?.contributorMenu?.id}"  />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="regionMenu"><g:message code="config.regionMenu.label" default="Region Menu" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'regionMenu', 'errors')}">
                                    <g:select name="regionMenu.id" optionValue="title" from="${au.org.emii.portal.Menu.list()}" optionKey="id" value="${configInstance?.regionMenu?.id}"  />
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
                                              <option  value="${it.id}" >${it.toListString()}
                                              </option>
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
                                    <label for="headerHeight"><g:message code="config.headerHeight.label" default="Header Height" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'headerHeight', 'errors')}">
                                    <g:textField size="4" name="headerHeight" value="${configInstance?.headerHeight}" /><font class="hint">in pixels</font>
                                </td>
                            </tr>
   
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="footerHeight"><g:message code="config.footerHeight.label" default="Footer Height" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'footerHeight', 'errors')}">
                                    <g:textField size="4" name="footerHeight" value="${configInstance?.footerHeight}" /><font class="hint">in pixels</font>
                                </td>
                            </tr>
     
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="footerHeight"><g:message code="config.westWidth.label" default="West menus initial width" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'westWidth', 'errors')}">
                                    <g:textField size="4" name="westWidth" value="${configInstance?.westWidth}" /><font class="hint">in pixels</font>
                                </td>
                            </tr>
                        



                        
                            