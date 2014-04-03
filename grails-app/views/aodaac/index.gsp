
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page contentType="text/html;charset=UTF-8" import="au.org.emii.portal.AodaacController; au.org.emii.portal.AodaacAggregatorService; au.org.emii.portal.AodaacJob" %>

<html>
<body>
<g:link controller="home">&lt; Home</g:link>
<br /><br />

<g:if test="${flash.message}">
    <div class="message" role="status">${flash.message}</div>
</g:if>

        <g:link action="testCreateJob">Create</g:link><br>

&gt; ${AodaacJob.count()} &lt; total<br>

        <g:link action="updateJob">Update</g:link><br><br>
        <g:each in="${AodaacJob.list()}">
            ${it} :: <a href="${it}">${it}</a>
            <hr>
        </g:each>
</body>
</html>
