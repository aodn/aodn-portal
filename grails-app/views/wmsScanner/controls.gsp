<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page contentType="text/html;charset=UTF-8" %>

<html>
<head>
    <meta name="layout" content="main">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="layout" content="main"/>
    <meta http-equiv="refresh" content="30">

    <g:set var="entityName" value="${message(code: 'wmsScanner.label', default: 'WMS Scanner')}"/>
    <title><g:message code="default.list.label" args="[entityName]"/></title>
</head>

<body>
<div class="nav">
    <div id="logo"></div>
    <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a>
    </span>
    <span class="menuButton"><a class="refresh" href="${createLink(uri: '/wmsScanner/controls')}">Refresh</a></span>

</div>

<div id="list-menu" class="list" role="main"></div>

<div id="ajaxStatus" class="message" style="display:none"></div>

<div class="content">
    <h2>WMS Scanner Controls</h2>

    <div style="margin: 1em">
        <b>Configuration</b><br/>
        WMS Scanner url: <g:if test="${wmsScannerBaseUrl}"><a href="${wmsScannerBaseUrl}"
                                                              target="_blank">${wmsScannerBaseUrl}</a></g:if><g:else><i>Not set</i></g:else><br/>
        Callback url is: ${grailsApplication.config.grails.serverURL} - <a
            href="${wmsScannerBaseUrl}utils/testCallbackUrl?callbackUrl=${URLEncoder.encode(grailsApplication.config.grails.serverURL)}"
            target="_blank">Test</a>
    </div>

    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>

    <h3>Current scan jobs (${scanJobList?.size()})</h3>
    <g:if test="${scanJobList != '[]'}">
        <div class="list">
            <table>
                <thead>
                <tr>
                    <th>${message(code: 'scanJob.name.label', default: 'Name')}</th>
                    <th>${message(code: 'scanJob.status.label', default: 'Status')}</th>
                    <th>Errors</th>
                    <th>${message(code: 'scanJob.jobType.label', default: 'Type')}</th>
                    <th>${message(code: 'scanJob.version.label', default: 'Version')}</th>
                    <th>${message(code: 'scanJob.scanFrequency.label', default: 'Scan Freq.')}</th>
                    <th>${message(code: 'scanJob.uri.label', default: 'URI')}</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <g:each in="${scanJobList}" status="i" var="scanJobInstance">
                    <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        <td>${scanJobInstance.name}</td>
                        <td>${statusText[scanJobInstance.status]}</td>
                        <td>${scanJobInstance.numErrors}&nbsp;error(s)<g:if
                                test="${scanJobInstance.numErrors != 0}">; ${message(code: 'scanJob.lastError.label', default: 'Most recent')}:<br/><pre>${scanJobInstance.lastError}</pre></g:if>
                        </td>
                        <td>${scanJobInstance.jobType}</td>
                        <td>${scanJobInstance.wmsVersion}</td>
                        <td>${scanJobInstance.scanFrequency}&nbsp;min</td>
                        <td>${scanJobInstance.uri}</td>
                        <td>
                            <g:link action="callUpdate"
                                    params="[scanJobId: scanJobInstance.id, scanJobUri: scanJobInstance.uri]">${message(code: 'scanJob.update.label', default: 'Update')}</g:link>&nbsp;|&nbsp;<g:link
                                    action="callDelete"
                                    params="[scanJobId: scanJobInstance.id]">${message(code: 'scanJob.delete.label', default: 'Delete')}</g:link>
                        </td>
                    </tr>
                </g:each>
                </tbody>
            </table>
        </div>
    </g:if>
    <br/>


    <h3>Applicable Servers (${serversToList?.size()})</h3>

    <div class="list">
        <table>
            <thead>
            <tr>
                <th>${message(code: 'server.name.label', default: 'Name')}</th>
                <th>${message(code: 'server.type.label', default: 'Type')}</th>
                <th>${message(code: 'server.uri.label', default: 'Uri')}</th>
                <th>${message(code: 'server.scanFrequency.label', default: 'Scan Freq.')}</th>
                <th>${message(code: 'server.lastScanDate.label', default: 'Last scan date')}</th>
                <shiro:hasPermission permission="server:edit">

                    <th></th>
                </shiro:hasPermission>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <g:each in="${serversToList}" status="i" var="serverInstance">
                <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                    <td>${fieldValue(bean: serverInstance, field: "name")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "type")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "uri")}</td>
                    <td>${fieldValue(bean: serverInstance, field: "scanFrequency")} min</td>
                    <td><g:if test="${serverInstance.lastScanDate}"><g:formatDate format="dd/MM/yy HH:mm"
                                                                                  date="${serverInstance.lastScanDate}"/></g:if></td>
                    <shiro:hasPermission permission="server:edit">
                        <td><g:link controller="server" action="edit"
                                    id="${serverInstance.id}">Edit&nbsp;Server</g:link></td>
                    </shiro:hasPermission>
                    <td><g:link action="callRegister"
                                params="[serverId: serverInstance.id]">${message(code: 'server.createScanJob.label', default: 'Create&nbsp;Scan&nbsp;Job')}</g:link></td>
                </tr>
            </g:each>
            </tbody>
        </table>
    </div>

</div>
</div>
</body>
</html>
