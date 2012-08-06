
<%@ page import="au.org.emii.portal.AodaacProductLink" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'aodaacProductLink.label', default: 'AodaacProductLink')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
        </div>
        <div class="body">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="list">
                <table>
                    <thead>
                        <tr>
                            <g:sortableColumn property="layerName" title="${message(code: 'aodaacProductLink.layerName.label', default: 'Layer Name')}" />

                            <g:sortableColumn property="productId" title="${message(code: 'aodaacProductLink.productId.label', default: 'Product Id')}" />

                            <th><g:message code="aodaacProductLink.server.label" default="Server" /></th>

                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${aodaacProductLinkInstanceList}" status="i" var="aodaacProductLinkInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">

                            <td>${fieldValue(bean: aodaacProductLinkInstance, field: "layerName")}</td>
                        
                            <td>${fieldValue(bean: aodaacProductLinkInstance, field: "productId")}</td>
                        
                            <td>${fieldValue(bean: aodaacProductLinkInstance, field: "server")}</td>

                            <td><g:link action="edit" id="${aodaacProductLinkInstance.id}">edit</g:link></td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${aodaacProductLinkInstanceTotal}" />
            </div>
            <div class="buttons">
                <span class="button"><g:link class="create" action="create">Add new</g:link></span>
            </div>
        </div>
    </body>
</html>
