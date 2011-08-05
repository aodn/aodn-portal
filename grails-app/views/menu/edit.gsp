<%@ page import="au.org.emii.portal.Menu" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'menu.label', default: 'Menu')}" />
        
        <script src="${resource(dir:'js',file:'portal/grid2treedrag.js')}" type="text/javascript"></script>
        <script src="${resource(dir:'js',file:'portal/treeSerializer.js')}"  type="text/javascript"></script>
        
		<title><g:message code="default.edit.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#edit-menu" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
            </ul>
       
            <input id="jsonString" name="json" autocomplete="off" type="hidden" />
            <span class="menuButton"><g:submitButton id="submitMenu" name="submitMenu" class="save" value="${message(code: 'default.button.create.label', default: 'Edit menu')}" /></span>
			</ul>
          <g:form action="save" AUTOCOMPLETE = "off" >
            
          </g:form>
		</div>
         <g:hasErrors bean="${menuInstance}">
            <div class="errors">
                <g:renderErrors bean="${menuInstance}" as="list" />
            </div>
            </g:hasErrors>
		
			 <div id="menuConfigurator" style="height:100%"></div>
		
	</body>
</html>
