<%@ page import="au.org.emii.portal.AodaacJob" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'aodaacJob.label', default: 'AodaacJob')}" />
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

                            <g:sortableColumn property="id" title="${message(code: 'aodaacJob.id.label', default: 'Id')}" />

                            <g:sortableColumn property="productId" title="${message(code: 'aodaacJob.productId.label', default: 'Product Id')}" />

                            <g:sortableColumn property="jobId" title="${message(code: 'aodaacJob.jobId.label', default: 'Job Id')}" />

                            <g:sortableColumn property="status" title="${message(code: 'aodaacJob.status.label', default: 'Status')}" />

                            <g:sortableColumn property="statusUpdatedDate" title="${message(code: 'aodaacJob.statusUpdatedDate.label', default: 'Status Updated Date')}" />

                            <g:sortableColumn property="dateCreated" title="${message(code: 'aodaacJob.dateCreated.label', default: 'Date Created')}" />

                            <g:sortableColumn property="notificationEmailAddress" title="${message(code: 'aodaacJob.notificationEmailAddress.label', default: 'Notification Email Address')}" />

                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${aodaacJobInstanceList}" status="i" var="aodaacJobInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">

                            <td><g:link action="show" id="${aodaacJobInstance.id}">${fieldValue(bean: aodaacJobInstance, field: "id")}</g:link></td>

                            <td>${fieldValue(bean: aodaacJobInstance, field: "productId")}</td>

                            <td>${fieldValue(bean: aodaacJobInstance, field: "jobId")}</td>

                            <td>${fieldValue(bean: aodaacJobInstance, field: "status")}</td>

                            <td><g:formatDate date="${aodaacJobInstance.statusUpdatedDate}" /></td>

                            <td><g:formatDate date="${aodaacJobInstance.dateCreated}" /></td>

                            <td>${fieldValue(bean: aodaacJobInstance, field: "notificationEmailAddress")}</td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <g:paginate total="${aodaacJobInstanceTotal}" params="${params}" />
            </div>
        </div>
    </body>
</html>
