
<%@ page import="au.org.emii.portal.Server" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'server.label', default: 'Server')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
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
                        
                            <g:sortableColumn property="id" title="${message(code: 'server.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="uri" title="${message(code: 'server.uri.label', default: 'Uri')}" />
                        
                            <g:sortableColumn property="shortAcron" title="${message(code: 'server.shortAcron.label', default: 'Short Acron')}" />
                        
                            <g:sortableColumn property="type" title="${message(code: 'server.type.label', default: 'Type')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'server.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="disable" title="${message(code: 'server.disable.label', default: 'Disable')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${serverInstanceList}" status="i" var="serverInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${serverInstance.id}">${fieldValue(bean: serverInstance, field: "id")}</g:link></td>
                        
                            <td>${fieldValue(bean: serverInstance, field: "uri")}</td>
                        
                            <td>${fieldValue(bean: serverInstance, field: "shortAcron")}</td>
                        
                            <td>${fieldValue(bean: serverInstance, field: "type")}</td>
                        
                            <td>${fieldValue(bean: serverInstance, field: "name")}</td>
                        
                            <td><g:formatBoolean boolean="${serverInstance.disable}" /></td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${serverInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
