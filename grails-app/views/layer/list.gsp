<%@ page import="au.org.emii.portal.Server; au.org.emii.portal.Layer" %>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'layer.label', default: 'Layer')}" />
    <title><g:message code="default.list.label" args="[entityName]" /></title>
</head>
<body>
<div class="nav">
    <div id="logo"></div>
    <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
    <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
</div>
<div class="content">
    <h1><g:message code="default.list.label" args="[entityName]" /> <span style="font-weight: normal; font-size: 80%;">(Showing ${ params.offset } - ${ params.int( "offset" ) + layersShownCount } / ${ filteredLayersCount })</span></h1>
    <g:if test="${flash.message}">
        <div class="message">${flash.message}</div>
    </g:if>

    <div class="filters">
        <g:form action="list" method="get">
            <table style="border-width: 0; width: 40%; margin: 0.8em 0;">
                <tr>
                    <th colspan="2">Filter list</th>
                </tr>
                <tr>
                    <td style="padding-right: 1.25em"><label for="keyword">Keyword</label></td>
                    <td><g:textField name="keyword" value="${filters?.keyword}" /></td>
                </tr>
                <tr>
                    <td><label for="serverId">Server</label></td>
                    <td><g:select name="serverId" from="${Server.list()}" optionKey="id" optionValue="name" value="${filters?.serverId}" noSelection="['':'- Any -']" /></td>
                </tr>
                <tr>
                    <td><label for="isActive">Active&nbsp;in&nbsp;last&nbsp;scan</label></td>
                    <td><g:select name="isActive" from="${['Active Layers only', 'Both active and inactive layers', 'Inactive Layers only']}" keys="${['true', '', 'false']}" value="${filters?.isActive}" /></td>
                </tr>
                <tr>
                    <td><label for="isRoot">Root nodes</label></td>
                    <td><g:select name="isRoot" from="${['Root Layers only', 'Both root and non-root Layers', 'Non-root Layers only']}" keys="${['true', '', 'false']}" value="${filters?.isRoot}" /></td>
                </tr>
                <tr>
                    <td></td>
                    <td><g:submitButton name="filter" value="Filter" /></td>
                </tr>
            </table>
        </g:form>
    </div>

    <g:render template="listBody" model="$model" />

</div>
</body>
</html>