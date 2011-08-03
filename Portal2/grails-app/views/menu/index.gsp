
<%@ page import="au.org.emii.portal.Layer" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:render template="/common_includes"></g:render>
        
        
        <script src="${resource(dir:'js',file:'portal/grid2treedrag.js')}" defer="defer"  type="text/javascript"></script>
        <script src="${resource(dir:'js',file:'portal/treeSerializer.js')}" defer="defer"  type="text/javascript"></script>
        
        <g:set var="entityName" value="Menu" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message default="[entityName]" /></h1>
            <g:if test="${flash.message}">
              <div class="message">${flash.message}</div>
            </g:if>
            
            
            <div id="menuConfigurator" style="height:100%"></div>
            
        </div>
    </body>
</html>
