
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="au.org.emii.portal.Config" %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'config.label', default: 'Config')}" />
        <title><g:message code="default.edit.label" args="[entityName]" /></title>        
                
        <script type="text/javascript" src="${resource(dir:'js/jquery',file:'jquery-ui-1.8.10.custom.min.js')}"></script>
        <script type="text/javascript" src="${resource(dir:'js/jquery',file:'jquery.layout.min.js')}"></script>
        <script type="text/javascript" src="${resource(dir:'js/jquery',file:'jquery.selectlist.js')}"></script>
        <g:render template="jqueryjs"></g:render>
        
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="siteconfig_button" href="${createLink(uri: '/admin')}"><g:message code="default.siteconfig.label"/></a></span>
            <span class="menuButton"><a class="portal_button" href="${createLink(uri: '/')}"><g:message code="default.portal.label"/></a></span>
        </div>
        <div class="content">
            <h1><g:message code="default.edit.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${configInstance}">
            <div class="errors">
                <g:renderErrors bean="${configInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form method="post" >
                <g:hiddenField name="id" value="${configInstance?.id}" />
                <g:hiddenField name="version" value="${configInstance?.version}" />
                <div class="buttons">
                    <span class="button"><g:actionSubmit class="save" action="update" value="${message(code: 'default.button.update.label', default: 'Update')}" /></span>
                </div>
                <div class="dialog">
                    <table>
                        <tbody>
                        
                         <g:render template="form"></g:render>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:actionSubmit class="save" action="update" value="${message(code: 'default.button.update.label', default: 'Update')}" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
