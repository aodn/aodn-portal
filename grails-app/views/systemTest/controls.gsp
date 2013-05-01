
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page contentType="text/html;charset=UTF-8" %>

<html>
<head>
    <meta name="layout" content="main">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="layout" content="main" />

    <title>System test controls</title>
</head>
<body>
<div class="nav">
    <div id="logo"></div>
    <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
</div>
<div id="list-menu" class="list" role="main"></div>
<div id="ajaxStatus" class="message" style="display:none" ></div>

<div class="content">
    <h2>System Test Controls</h2>

    <div class="message" role="status">Using these controls will write to the log and possibly send emails or notify monitoring systems.</div>

    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>

    <h3>Test logging</h3>
    Write test message to log with level...<br />
    <g:link action="writeTraceMessage" target="_blank">Trace</g:link>&nbsp;|
    <g:link action="writeDebugMessage" target="_blank">Debug</g:link>&nbsp;|
    <g:link action="writeInfoMessage" target="_blank">Info</g:link>&nbsp;|
    <g:link action="writeWarnMessage" target="_blank">Warn</g:link>&nbsp;|
    <g:link action="writeErrorMessage" target="_blank">Error</g:link>&nbsp;|
    <g:link action="writeFatalMessage" target="_blank">Fatal</g:link><br />
    <br />

    <h3>Test w/ Exception</h3>
    <g:link action="throwException" target="_blank">Throw test Exception</g:link><br />
    <br />

    <h3>Test email sending</h3>
    <g:link action="sendEmail" target="_blank">Send test email</g:link><br />
    <br />

    <h3>Log4J config</h3>
    ${log4jConfigSummary}
</div>
</body>
</html>