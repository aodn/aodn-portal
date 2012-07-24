

<%@ page import="au.org.emii.portal.AodaacProductLink" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'aodaacProductLink.label', default: 'AodaacProductLink')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${aodaacProductLinkInstance}">
            <div class="errors">
                <g:renderErrors bean="${aodaacProductLinkInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
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
                    <span class="button"><g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
