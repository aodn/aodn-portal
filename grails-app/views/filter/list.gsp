
<%@ page import="au.org.emii.portal.Filter" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'filter.label', default: 'Filter')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
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
                        
                            <g:sortableColumn property="id" title="${message(code: 'filter.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'filter.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="type" title="${message(code: 'filter.type.label', default: 'Type')}" />
                        
                            <g:sortableColumn property="label" title="${message(code: 'filter.label.label', default: 'Label')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${filterInstanceList}" status="i" var="filterInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="edit" id="${filterInstance.id}">${fieldValue(bean: filterInstance, field: "id")}</g:link></td>
                        
                            <td>${fieldValue(bean: filterInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: filterInstance, field: "type")}</td>
                        
                            <td>${fieldValue(bean: filterInstance, field: "label")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${filterInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
