
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<%@ page import="au.org.emii.portal.Server" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'server.label', default: 'Select Server to Check for Broken Links')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="siteconfig_button" href="${createLink(uri: '/admin')}"><g:message code="default.siteconfig.label"/></a></span>
            <span class="menuButton"><a class="portal_button" href="${createLink(uri: '/')}"><g:message code="default.portal.label"/></a></span>
        </div>
        <div class="body">
            <h1>Check server for broken links</h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>

			<g:form action="checkForBrokenLinks">  
				<g:select name="server" from="${au.org.emii.portal.Server.list()}"
												optionKey="id"
												optionValue="name"
												noSelection="noSelection="['':'Please Select...']" />
				
		       	<g:actionSubmit value="Check" action="checkForBrokenLinks"/>
		       <br/><br/>
		    <dt>Email to receive report : </dt>
	       	<dd><g:textField name="userEmailAddress" value="${userEmailAddress}"/></dd>
	       	</g:form>
	       	<br/>

        </div>
    </body>
</html>
