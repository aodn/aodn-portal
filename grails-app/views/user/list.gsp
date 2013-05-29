
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="au.org.emii.portal.User" %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
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
                            <g:sortableColumn property="id" title="${message(code: 'user.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="emailAddress" title="${message(code: 'user.emailAddress.label', default: 'Email Address')}" />

                            <g:sortableColumn property="openIdUrl" title="${message(code: 'user.openIdUrl.label', default: 'OpenID URL')}" />
                        
                            <g:sortableColumn property="fullName" title="${message(code: 'user.fullName.label', default: 'Name')}" />

                            <th>${message(code: 'user.roles.label', default: 'Roles')}</th>
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${userInstanceList}" status="i" var="userInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${userInstance.id}">${fieldValue(bean: userInstance, field: "id")}</g:link></td>
                        
                            <td>${fieldValue(bean: userInstance, field: "emailAddress")}</td>

                            <td>${fieldValue(bean: userInstance, field: "openIdUrl")}</td>

                            <td>${fieldValue(bean: userInstance, field: "fullName")}</td>

                            <td>${fieldValue(bean: userInstance, field: "roles")}</td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <g:paginate total="${userInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
