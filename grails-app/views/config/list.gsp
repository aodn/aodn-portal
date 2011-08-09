
<%@ page import="au.org.emii.portal.Config" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'config.label', default: 'Config')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="content">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="list">
                <table>
                    <thead>
                        <tr>
                        
                            <g:sortableColumn property="id" title="${message(code: 'config.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'config.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="proxy" title="${message(code: 'config.proxy.label', default: 'Proxy')}" />
                        
                            <g:sortableColumn property="proxyPort" title="${message(code: 'config.proxyPort.label', default: 'Proxy Port')}" />
                        
                            <g:sortableColumn property="initialBbox" title="${message(code: 'config.initialBbox.label', default: 'Initial Bbox')}" />
                        
                            <th><g:message code="config.defaultMenu.label" default="Default Menu" /></th>
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${configInstanceList}" status="i" var="configInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${configInstance.id}">${fieldValue(bean: configInstance, field: "id")}</g:link></td>
                        
                            <td>${fieldValue(bean: configInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: configInstance, field: "proxy")}</td>
                        
                            <td>${fieldValue(bean: configInstance, field: "proxyPort")}</td>
                        
                            <td>${fieldValue(bean: configInstance, field: "initialBbox")}</td>
                        
                            <td>${fieldValue(bean: configInstance, field: "defaultMenu")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${configInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
