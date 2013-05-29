
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="au.org.emii.portal.Menu" %>
<html>
  <head>
    <meta name="layout" content="main" />      
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
    
    <script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base.js')}"  type="text/javascript"></script>          
    <script src="${resource(dir:'js',file:'ext-3.3.1/ext-all-debug.js')}"   type="text/javascript"></script>
    <script src="${resource(dir:'js',file:'portal/data/LayerDataPanelStore.js')}"  type="text/javascript"></script>
    <script src="${resource(dir:'js',file:'portal/ui/LayerGridPanel.js')}"  type="text/javascript"></script>
    <script src="${resource(dir:'js',file:'portal/config/grid2treedrag.js')}" type="text/javascript"></script>
    <script src="${resource(dir:'js',file:'portal/config/treeSerializer.js')}"  type="text/javascript"></script>
    <script src="${resource(dir:'js',file:'portal/data/MenuItemToNodeBuilder.js')}"  type="text/javascript"></script>

  <g:set var="entityName" value="Menu" />
  <title><g:message code="default.create.label" args="[entityName]" /></title>
     <script>

      Ext.onReady(function() {
          initMenu(undefined, '${resource(dir:'/')}'); // grid2treedrag
      });

      </script>


</head>
<body>


  <div class="nav">
    <div id="logo"></div>
    <span class="menuButton"><a class="siteconfig_button" href="${createLink(uri: '/admin')}"><g:message code="default.siteconfig.label"/></a></span>
    <span class="menuButton"><a class="portal_button" href="${createLink(uri: '/')}"><g:message code="default.portal.label"/></a></span>
    <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>            
	<g:form action="save" AUTOCOMPLETE="off">
    	<input id="jsonString" name="json" autocomplete="off" type="hidden" />
    	<span class="menuButton"><g:submitButton id="submitMenu" name="submitMenu" class="save" value="Submit new menu" style="visibility: hidden" /></span>
    </g:form>
  </div>

<div class="content"> 
  <g:hasErrors bean="${menuInstance}">
    <div class="errors">
      <g:renderErrors bean="${menuInstance}" as="list" />
    </div>
  </g:hasErrors>
  <h1><g:message default="[entityName]" /></h1>
  <g:if test="${flash.message}">
    <div  id="message" id="message" class="message"style="visibility:hidden">${flash.message}</div>
  </g:if>



  <div id="menuConfigurator" style="height:100%"></div>

</div>
</body>
</html>
