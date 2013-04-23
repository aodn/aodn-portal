
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

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
            <span class="menuButton"><a class="refresh" href="${createLink(uri: '/server/refreshList')}">Refresh</a></span>
        </div>
        <div class="body">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="list">
                <%
                    def wmsScannerContactable = jobProperties['wmsScannerContactable']
                    def wfsScannerContactable = jobProperties['wfsScannerContactable']
                %>

                <table>
                    <thead>
                        <tr>
                            <g:sortableColumn property="name" title="${message(code: 'server.name.label', default: 'Name')}" />

                            <g:sortableColumn property="shortAcron" title="${message(code: 'server.shortAcron.label', default: 'Short Acron')}" />

                            <g:sortableColumn property="uri" title="${message(code: 'server.uri.label', default: 'Uri')}" />

                            <g:sortableColumn property="type" title="${message(code: 'server.type.label', default: 'Type')}" />

                            <g:sortableColumn property="disable" title="${message(code: 'server.disable.label', default: 'Disable')}" />
                            <g:sortableColumn property="allowDiscoveries" title="${message(code: 'server.allowDiscoveries.label', default: 'Discoverable')}" />
                            <g:sortableColumn property="WMS Scanner" title="${message(code: 'server.allowDiscoveries.label', default: 'WMS Scanner Status')}" />
                            <g:sortableColumn property="WFS Scanner" title="${message(code: 'server.allowDiscoveries.label', default: 'WFS Scanner Status')}" />
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${serverInstanceList}" status="i" var="serverInstance">
                        <tr class="${(serverInstanceList[i].disable) ?
                                        'disable' : '' }
                            ${(serverInstanceList[i].allowDiscoveries) ?
                                        '' : 'disable' }">
                            <td><g:link action="edit" id="${serverInstance.id}">${fieldValue(bean: serverInstance, field: "name")}</g:link></td>

                            <td>${fieldValue(bean: serverInstance, field: "shortAcron")}</td>

                            <td>${fieldValue(bean: serverInstance, field: "uri")}</td>

                            <td>${fieldValue(bean: serverInstance, field: "type")}</td>

                            <td><g:formatBoolean boolean="${serverInstance.disable}" /></td>

                            <td><g:formatBoolean boolean="${serverInstance.allowDiscoveries}" /></td>

                            <%
                                def serverMap = jobProperties['serverMap']

                                if(serverMap.containsKey(serverInstance)){
                                    def jobs = serverMap[serverInstance]
                                    def wmsJob = jobs[0]
                                    def wfsJob = jobs[1]
                                    def wmsStatusString = ""

                                    //---------- WMS status ----------
                                    if(wmsScannerContactable){
                                        if(wmsJob != null && wmsJob.status != null){
                                            switch(wmsJob.status){
                                                case 0:
                                                    wmsStatusString = "FINISHED"
                                                    break
                                                case -1:
                                                    wmsStatusString = "ERROR"
                                                    break
                                                case -2:
                                                    wmsStatusString = "CANCELLED"
                                                    break
                                                default:
                                                    wmsStatusString = "Unknown status: " + wmsJob.status
                                            }

                                            %>
                                            <td>
                                                <%
                                                if(wmsJob.status == 0){
                                                    %>
                                                    Last scanned at <g:formatDate format="dd/MM/yy HH:mm" date="${serverInstance.lastScanDate}" /> <br/>
                                                    <%
                                                    }
                                                    else{
                                                        print wmsStatusString + "<br />"

                                                        if(wmsJob.status == -1){
                                                            %>
                                                                <%= wmsJob.lastError %>  <br/>
                                                            <%
                                                        }
                                                    }
                                                %>
                                                [ <g:link controller="wmsScanner" action="callUpdate"
                                                          params="[scanJobId: wmsJob.id, scanJobUri: wmsJob.uri]">${message(code: 'scanJob.update.label', default: 'Update')}</g:link>&nbsp;|&nbsp;<g:link
                                                        controller="wmsScanner" action="callDelete"
                                                        params="[scanJobId: wmsJob.id]">${message(code: 'scanJob.delete.label', default: 'Delete')}</g:link> ]
                                            </td>
                                            <%
                                        }
                                        else {  %>
                                            <td>No job scheduled<br />
                                            <g:link controller="wmsScanner" action="callRegister"
                                                    params="[serverId: serverInstance.id]">${message(code: 'server.createScanJob.label', default: 'Create&nbsp;Scan&nbsp;Job')}</g:link></td>
                                            <%
                                        }
                                    }
                                    else{
                                        %>
                                        <td>Check scanner</td>
                                        <%
                                    }

                                    //---------- WFS status ----------

                                    if(wfsScannerContactable){
                                        if(wfsJob != null && wfsJob.status != null){
                                            %>
                                            <td>
                                                <%= wfsJob.status.name %><br/>
                                                <%
                                                if(wfsJob.status.name.equals("ERROR")){
                                                    print wfsJob.error + "<br />"
                                                }
                                                %>
                                                [ <g:link controller="wfsScanner" action="callUpdate"
                                                          params="[scanJobId: wfsJob.id, serverId: serverInstance.id]">${message(code: 'scanJob.update.label', default: 'Update')}</g:link>&nbsp;|&nbsp;<g:link
                                                        controller="wfsScanner" action="callDelete"
                                                        params="[scanJobId: wfsJob.id, serverId: serverInstance.id]">${message(code: 'scanJob.delete.label', default: 'Delete')}</g:link> ]
                                                </td>
                                                <%

                                        }
                                        else{
                                            if(serverInstance.type.startsWith("GEO")){
                                                %>
                                                <td>No job scheduled  <br />
                                                    <g:link controller="wfsScanner" action="callRegister"
                                                            params="[serverId: serverInstance.id]">${message(code: 'server.createScanJob.label', default: 'Create&nbsp;Scan&nbsp;Job')}</g:link>
                                                </td>
                                                <%
                                            }
                                            else{
                                                %>
                                                <td>Not applicable</td>
                                                <%
                                            }
                                        }
                                    }
                                    else{
                                        %>
                                            <td>Check scanner</td>
                                        <%
                                    }
                                }
                            %>

                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <g:paginate total="${serverInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
