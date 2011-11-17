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
                                    <g:textField size="70" name="catalogUrl" value="${configInstance?.catalogUrl}" /><font class="hint">Should <b>not</b> end with a '/' character</font>
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
                                    <label for="baselayerMenu"><g:message code="config.contributorMenu.label" default="Default Base Layer Menu" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'baselayerMenu', 'errors')}">
                                    <g:select name="baselayerMenu.id" optionValue="title" from="${au.org.emii.portal.Menu.list()}" optionKey="id" value="${configInstance?.baselayerMenu?.id}"  />
                                    <font class="hint"></font>
                                </td>
                            </tr>                       
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="defaultMenu"><g:message code="config.defaultMenu.label" default="Default Layers Menu" /></label>
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
                                    <font class="hint">(not utilised)</font>
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
                                    <label for="activeLayersHeight"><g:message code="config.activeLayersHeight.label" default="Active Layers Height" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'activeLayersHeight', 'errors')}">
                                    <g:textField size="4" name="activeLayersHeight" value="${configInstance?.activeLayersHeight}" /><font class="hint">in pixels</font>
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
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="downloadCartFilename"><g:message code="config.downloadCartFilename.label" default="Download cart filename" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'downloadCartFilename', 'errors')}">
                                    <g:textField size="25" name="downloadCartFilename" value="${configInstance?.downloadCartFilename}" /><font class="hint">include %s where you would like a formatted date to be included in filename</font>
                                </td>
                            </tr>
   
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="downloadCartMaxNumFiles"><g:message code="config.downloadCartMaxNumFiles.label" default="Max number of files in download cart" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'downloadCartMaxNumFiles', 'errors')}">
                                    <g:textField size="4" name="downloadCartMaxNumFiles" value="${configInstance?.downloadCartMaxNumFiles}" />
                                </td>
                            </tr>
   
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="downloadCartMaxFileSize"><g:message code="config.downloadCartMaxFileSize.label" default="Max file size of zip file of download cart" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'downloadCartMaxFileSize', 'errors')}">
                                    <g:textField size="8" name="downloadCartMaxFileSize" value="${configInstance?.downloadCartMaxFileSize}" /><font class="hint">in bytes</font>
                                </td>
                            </tr>
   
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="downloadCartMimeTypeToExtensionMapping"><g:message code="config.downloadCartMimeTypeToExtensionMapping.label" default="Map from mime types to file extensions for downloads" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'downloadCartMimeTypeToExtensionMapping', 'errors')}">
                                    <g:textArea rows="8" style="width: 400px;" name="downloadCartMimeTypeToExtensionMapping" value="${configInstance?.downloadCartMimeTypeToExtensionMapping}" /><font class="hint">as Json String</font>
                                </td>
                            </tr>
   
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="downloadCartDownloadableProtocols"><g:message code="config.downloadCartDownloadableProtocols.label" default="Which protocols allow links to be added to download cart" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'downloadCartDownloadableProtocols', 'errors')}">
                                    <g:textArea rows="8" style="width: 400px;" name="downloadCartDownloadableProtocols" value="${configInstance?.downloadCartDownloadableProtocols}" /><font class="hint">Put each protocol on a separate line</font>
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="metadataLinkProtocols"><g:message code="config.metadataLinkProtocols.label" default="Which protocols are links to related pages" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'metadataLinkProtocols', 'errors')}">
                                    <g:textArea rows="8" style="width: 400px;" name="metadataLinkProtocols" value="${configInstance?.metadataLinkProtocols}" /><font class="hint">Put each protocol on a separate line</font>
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="metadataLayerProtocols"><g:message code="config.metadataLayerProtocols.label" default="Which protocols are displayable on the map" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: configInstance, field: 'metadataLayerProtocols', 'errors')}">
                                    <g:textArea rows="8" style="width: 400px;" name="metadataLayerProtocols" value="${configInstance?.metadataLayerProtocols}" /><font class="hint">Put each protocol on a separate line</font>
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