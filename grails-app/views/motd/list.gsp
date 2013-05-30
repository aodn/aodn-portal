
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="au.org.emii.portal.Motd" %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'motd.label', default: 'Motd')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="siteconfig_button" href="${createLink(uri: '/admin')}"><g:message code="default.siteconfig.label"/></a></span>
            <span class="menuButton"><a class="portal_button" href="${createLink(uri: '/')}"><g:message code="default.portal.label"/></a></span>
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
                        
                            <g:sortableColumn property="motdTitle" title="${message(code: 'motd.motdTitle.label', default: 'Motd Title')}" />
                        
                            <g:sortableColumn property="motd" title="${message(code: 'motd.motd.label', default: 'Motd')}" />
                        
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${motdInstanceList}" status="i" var="motdInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="edit" id="${motdInstance.id}">${fieldValue(bean: motdInstance, field: "motdTitle")}</g:link></td>
                        
                            <td>${fieldValue(bean: motdInstance, field: "motd")}</td>
                        
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <g:paginate total="${motdInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
