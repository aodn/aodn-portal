<%@ page import="au.org.emii.portal.AodaacJob" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'aodaacJob.label', default: 'AodaacJob')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="dialog">
                <table>
                    <tbody>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.id.label" default="Id" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "id")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.productId.label" default="Product Id" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "productId")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.jobId.label" default="Job Id" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "jobId")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.statusUpdatedDate.label" default="Status Updated Date" /></td>

                            <td valign="top" class="value"><g:formatDate date="${aodaacJobInstance?.statusUpdatedDate}" /></td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.dateCreated.label" default="Date Created" /></td>

                            <td valign="top" class="value"><g:formatDate date="${aodaacJobInstance?.dateCreated}" /></td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.dateRangeEnd.label" default="Date Range End" /></td>

                            <td valign="top" class="value"><g:formatDate date="${aodaacJobInstance?.dateRangeEnd}" /></td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.dateRangeStart.label" default="Date Range Start" /></td>

                            <td valign="top" class="value"><g:formatDate date="${aodaacJobInstance?.dateRangeStart}" /></td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.latitudeRangeEnd.label" default="Latitude Range End" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "latitudeRangeEnd")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.latitudeRangeStart.label" default="Latitude Range Start" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "latitudeRangeStart")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.longitudeRangeEnd.label" default="Longitude Range End" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "longitudeRangeEnd")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.longitudeRangeStart.label" default="Longitude Range Start" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "longitudeRangeStart")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.notificationEmailAddress.label" default="Notification Email Address" /></td>

                            <td valign="top" class="value">${fieldValue(bean: aodaacJobInstance, field: "notificationEmailAddress")}</td>

                        </tr>

                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="aodaacJob.status.label" default="Status" /></td>

                            <td valign="top" class="value">${aodaacJobInstance?.status?.encodeAsHTML()}</td>

                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </body>
</html>
