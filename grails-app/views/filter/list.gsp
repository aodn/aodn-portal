<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


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
                        
                            <g:sortableColumn property="id" title="${message(code: 'filter.id.label', default: 'Id')}" />
                            <g:sortableColumn property="label" title="${message(code: 'filter.label.label', default: 'Filter Label')}" />
                            <g:sortableColumn property="name" title="${message(code: 'filter.name.label', default: 'Name WFS/WMS')}" />
                            <g:sortableColumn property="wmsStartDateName" title="${message(code: 'filter.wmsStartDateName.label', default: 'Name (WMS start Date)')}" />
                            <g:sortableColumn property="wmsEndDateName" title="${message(code: 'filter.wmsEndDateName.label', default: 'Name (WMS end Date)')}" />
                            <g:sortableColumn property="type" title="${message(code: 'filter.type.label', default: 'Type')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${filterInstanceList}" status="i" var="filterInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="edit" id="${filterInstance.id}">${fieldValue(bean: filterInstance, field: "id")}</g:link></td>

                            <td>${fieldValue(bean: filterInstance, field: "label")}</td>
                            <td>${fieldValue(bean: filterInstance, field: "name")}</td>
                            <td>${fieldValue(bean: filterInstance, field: "wmsStartDateName")}</td>
                            <td>${fieldValue(bean: filterInstance, field: "wmsEndDateName")}</td>
                            <td>${fieldValue(bean: filterInstance, field: "type")}</td>
                        
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
