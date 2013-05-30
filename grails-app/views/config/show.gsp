
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<%@ page import="au.org.emii.portal.Config" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'config.label', default: 'Configuration')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>        
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="siteconfig_button" href="${createLink(uri: '/admin')}"><g:message code="default.siteconfig.label"/></a></span>
            <span class="menuButton"><a class="portal_button" href="${createLink(uri: '/')}"><g:message code="default.portal.label"/></a></span>
        </div>
        <div class="content">
            <h1><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="dialog">
                <table>
                    <tbody>
                    
                       
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.name.label" default="Site Name" /></td>                            
                            <td valign="top" class="value"><h2>${fieldValue(bean: configInstance, field: "name")}</h2></td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.proxy.label" default="Proxy" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "proxy")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.proxyPort.label" default="Proxy Port" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "proxyPort")}</td>
                            
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.catalogUrl.label" default="Catalog Url" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "catalogUrl")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.initialBbox.label" default="Initial Bbox" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "initialBbox")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.defaultMenu.label" default="Default Menu" /></td>                            
                            <td valign="top" class="value"><g:link controller="menu" action="show" id="${configInstance?.defaultMenu?.id}">${configInstance?.defaultMenu?.encodeAsHTML()}</g:link></td>
                            
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.defaultLayers.label" default="Default Layers" /></td>
                            
                            <td valign="top" style="text-align: left;" class="value">
                                <ul>
                                <g:each in="${configInstance?.defaultLayers?}" var="d">
                                    <li><g:link controller="layer" action="show" id="${d.id}">${d?.encodeAsHTML()}</g:link></li>
                                </g:each>
                                </ul>
                            </td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.enableMOTD.label" default="Enable MOTD" /></td>                            
                            <td valign="top" class="value"><g:formatBoolean boolean="${configInstance?.enableMOTD}" /></td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.motd.label" default="MOTD" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "motd")}</td>
                            
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.motdStart.label" default="Motd Start" /></td>                            
                            <td valign="top" class="value"><g:formatDate format="EEE, d MMM yyyy HH:mm:ss" date="${configInstance?.motdStart}" /></td>
                            
                        </tr>
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.motdEnd.label" default="Motd End" /></td>                            
                            <td valign="top" class="value"><g:formatDate  format="EEE, d MMM yyyy HH:mm:ss"  date="${configInstance?.motdEnd}" /></td>
                            
                        </tr>
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.headerHeight.label" default="Header Height" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "headerHeight")}</td>                            
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.footerHeight.label" default="Footer Height" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "footerHeight")}</td>                            
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.activeLayersHeight.label" default="Active Layers Height" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "activeLayersHeight")}</td>                            
                        </tr>
                        
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="config.westWidth.label" default="West Menus initial Width" /></td>                            
                            <td valign="top" class="value">${fieldValue(bean: configInstance, field: "westWidth")}</td>                            
                        </tr>
                    

                    
                    
                    </tbody>
                </table>
            </div>
            <div class="buttons">
                <g:form>
                    <g:hiddenField name="id" value="${configInstance?.id}" />
                    <span class="button"><g:actionSubmit class="edit" action="edit" value="${message(code: 'default.button.edit.label', default: 'Edit')}" /></span>
                </g:form>
            </div>
        </div>
    </body>
</html>
