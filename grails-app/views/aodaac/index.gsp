
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
        Test params: ${ testParams }<br>

&gt; ${AodaacJob.count()} &lt; total<br>

<g:link action="userJobInfo">userJobInfo</g:link><br>

        <g:each in="${AodaacJob.list()}">
            ${it.jobId} <g:link action="updateJob" id="${it.jobId}">Update</g:link> | <g:link action="cancelJob" id="${it.jobId}">Cancel</g:link> | <g:link action="deleteJob" id="${it.jobId}">Delete</g:link><br>
            ${it}<br>
            <a href="${it.result?.dataUrl}">${it.result?.dataUrl}</a>
            <hr>
        </g:each>
<br/>
<g:link action="checkProducts">Products</g:link>
</body>
</html>
