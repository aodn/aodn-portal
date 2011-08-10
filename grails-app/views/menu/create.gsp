<%@ page import="au.org.emii.portal.Menu" %>
<html>
    <head>
        <meta name="layout" content="main" />      
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
        <script src="${resource(dir:'js',file:'portal/grid2treedrag.js')}" type="text/javascript"></script>
        <script src="${resource(dir:'js',file:'portal/treeSerializer.js')}"  type="text/javascript"></script>
        
        <g:set var="entityName" value="Menu" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
     
        <script>         
    
       

        Ext.onReady(function(){
          
            initMenu(undefined); // grid2treedrag        
            
         
         });  
                     
       </script>
    </head>
    <body>


        <g:form action="save" AUTOCOMPLETE = "off" >
          
         <div class="nav">
           <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>            
       
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
              <div  id="message" class="message">${flash.message}</div>
            </g:if>
            
            
            <div id="menuConfigurator" style="height:100%"></div>
            
        </div>
    </body>
</html>
