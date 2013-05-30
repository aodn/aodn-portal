
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>



<%@ page import="au.org.emii.portal.AodaacProductLink" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'aodaacProductLink.label', default: 'AodaacProductLink')}" />
        <title><g:message code="default.edit.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="siteconfig_button" href="${createLink(uri: '/admin')}"><g:message code="default.siteconfig.label"/></a></span>
            <span class="menuButton"><a class="portal_button" href="${createLink(uri: '/')}"><g:message code="default.portal.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.edit.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${aodaacProductLinkInstance}">
            <div class="errors">
                <g:renderErrors bean="${aodaacProductLinkInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form method="post" >
                <g:hiddenField name="id" value="${aodaacProductLinkInstance?.id}" />
                <g:hiddenField name="version" value="${aodaacProductLinkInstance?.version}" />
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="layerName"><g:message code="aodaacProductLink.layerName.label" default="Layer Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: aodaacProductLinkInstance, field: 'layerName', 'errors')}">
                                    <g:textField name="layerName" value="${aodaacProductLinkInstance?.layerName}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="productId"><g:message code="aodaacProductLink.productId.label" default="Product Id" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: aodaacProductLinkInstance, field: 'productId', 'errors')}">
                                    <g:textField name="productId" value="${fieldValue(bean: aodaacProductLinkInstance, field: 'productId')}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="server"><g:message code="aodaacProductLink.server.label" default="Server" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: aodaacProductLinkInstance, field: 'server', 'errors')}">
                                    <g:select name="server.id" from="${au.org.emii.portal.Server.list()}" optionKey="id" value="${aodaacProductLinkInstance?.server?.id}"  />
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:actionSubmit class="save" action="update" value="${message(code: 'default.button.update.label', default: 'Update')}" /></span>
                    <span class="button"><g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" /></span>
                </div>
            </g:form>
            <br />
            <h2>Existing entries</h2>
            <div class="list">
                <table>
                    <thead>
                    <tr>
                        <th>Layer Name</th>
                        <th>AODAAC Product ID</th>
                        <th>Server</th>
                    </tr>
                    </thead>
                    <tbody>
                    <g:each in="${aodaacProductLinkInstanceList}" status="i" var="aodaacProductLinkInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">

                            <td>${fieldValue(bean: aodaacProductLinkInstance, field: "layerName")}</td>

                            <td>${fieldValue(bean: aodaacProductLinkInstance, field: "productId")}</td>

                            <td>${fieldValue(bean: aodaacProductLinkInstance, field: "server")}</td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
        </div>
    </body>
</html>
