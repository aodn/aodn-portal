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

        <g:set var="entityName" value="${message(code: 'scanner.label', default: 'Scanner')}"/>
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
        <h2>Scanner Controls</h2>

        <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
        </g:if>
        <div class="list">
            <table>
                <thead>
                    <th>Server</th>
                    <th>URL</th>
                    <th>Type</th>
                    <th>WMS Status</th>
                    <th>WFS Status</th>
                </thead>
                <g:each in="${serverMap}" var="server">
                    <tr>
                    <td><%= server.key.name %></td>
                    <td>
                        <g:link controller="server" action="edit"
                                params="[id: server.key.id]">${server.key.uri}</g:link>
                    </td>
                    <td><%= server.key.type %></td>
                    <!-- WMS status  -->
                    <%
                        def wmsJob = server.value[0]
                        def wfsJob = server.value[1]

                        if(wmsJob != null && wmsJob.status != null)
                        {
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
                                <%= wmsStatusString %>  <br/>
                                [ <g:link controller="wmsScanner" action="callUpdate"
                                        params="[scanJobId: wmsJob.id, scanJobUri: wmsJob.uri]">${message(code: 'scanJob.update.label', default: 'Update')}</g:link>&nbsp;|&nbsp;<g:link
                                        controller="wmsScanner" action="callDelete"
                                        params="[scanJobId: wmsJob.id]">${message(code: 'scanJob.delete.label', default: 'Delete')}</g:link> ]
                            </td>
                            <%

                        }
                        else{  %>
                            <td>No job scheduled  <br />
                            <g:link controller="wmsScanner" action="callRegister"
                            params="[serverId: server.key.id]">${message(code: 'server.createScanJob.label', default: 'Create&nbsp;Scan&nbsp;Job')}</g:link></td>
                        <% }
                    %>

                    <!-- WFS status -->
                    <%
                        if(wfsJob != null && wfsJob.status != null)
                        {
                            %>
                            <td>
                                <%= wfsJob.status.name %>     <br/>
                                [ <g:link controller="wfsScanner" action="callUpdate"
                                          params="[scanJobId: wfsJob.id, serverId: server.key.id]">${message(code: 'scanJob.update.label', default: 'Update')}</g:link>&nbsp;|&nbsp;<g:link
                                        controller="wfsScanner" action="callDelete"
                                        params="[scanJobId: wfsJob.id, serverId: server.key.id]">${message(code: 'scanJob.delete.label', default: 'Delete')}</g:link> ]
                            </td>
                            <%
                        }
                        else{
                            if(server.key.type.startsWith("GEO")){
                                %>
                                <td>No job scheduled  <br />
                                <g:link controller="wfsScanner" action="callRegister"
                                params="[serverId: server.key.id]">${message(code: 'server.createScanJob.label', default: 'Create&nbsp;Scan&nbsp;Job')}</g:link></td>
                            <%
                            }
                            else{
                                %>
                                  <td>Not applicable</td>
                                <%
                            }

                        }
                    %>
                    </tr>
                </g:each>

            </table>
        </div>

    </div>
    </body>
</html>