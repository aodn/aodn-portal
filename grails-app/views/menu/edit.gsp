<%@ page import="au.org.emii.portal.Menu" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'menu.label', default: 'Menu')}" />
        
        <script src="${resource(dir:'js',file:'portal/grid2treedrag.js')}" type="text/javascript"></script>
        <script src="${resource(dir:'js',file:'portal/treeSerializer.js')}"  type="text/javascript"></script>
        
		<title><g:message code="default.edit.label" args="[entityName]" /></title>
                <script>         
    

        Ext.onReady(function(){
          
            initMenu(${menuInstanceJson}); // grid2treedrag        
         
         });  
                     
       </script>
	</head>
	<body>
		<a href="#edit-menu" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
                    <div id="logo"></div>
                    <ul>
                        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                        <li><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
                        <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>

                      <g:form action="update" AUTOCOMPLETE = "off" >
                          <input id="jsonString" name="json" autocomplete="off" type="hidden" />
                           <input name="id" value="${menuInstance.id}" type="hidden" />
                          <span class="menuButton"><g:submitButton id="submitMenu" name="submitMenu" class="save" value="${message(code: 'default.button.edit.label', default: 'Edit Menu')}" /></span>            
                      </g:form>
                  </ul>
          
            
	    </div>
        
        <div class="content"> 
          <g:hasErrors bean="${menuInstance}">
            <div class="errors">
                <g:renderErrors bean="${menuInstance}" as="list" />
            </div>
            </g:hasErrors>
            <h1><g:message default="[entityName]" /></h1>
            <g:if test="${flash.message}">
              <div  id="message" class="message">${flash.message}</div>
            </g:if>
            
            
            <div id="menuConfigurator" style="height:100%"></div>
            
        </div>
	</body>
</html>
