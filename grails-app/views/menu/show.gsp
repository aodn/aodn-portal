<%@ page import="au.org.emii.portal.Menu" %>
<!doctype html>
<html>
	<head>
          <meta name="layout" content="main">        
          
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
        
    <script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base.js')}"  type="text/javascript"></script>          
    <script src="${resource(dir:'js',file:'ext-3.3.1/ext-all-debug.js')}"   type="text/javascript"></script> 
        
    <script src="${resource(dir:'js',file:'portal/config/grid2treedrag.js')}" type="text/javascript"></script>
    <script src="${resource(dir:'js',file:'portal/config/treeSerializer.js')}"  type="text/javascript"></script>
    <script src="${resource(dir:'js',file:'portal/data/MenuItemToNodeBuilder.js')}"  type="text/javascript"></script>
          
          
          <g:set var="entityName" value="${message(code: 'menu.label', default: 'Menu')}" />
          <title><g:message code="default.show.label" args="[entityName]" /></title>
          <g:if test="${menuInstance?.id}">				
                   <script>
                     
                      Ext.onReady(function(){
                        
                        
                          buildDemoTree(${menuInstanceJson});
                     });
                     
                     
   // generic tree builder to demo the tree only
  function buildDemoTree(menu) {

	  	var builder = new Portal.data.MenuItemToNodeBuilder();
    	var children = builder.build(menu);
      
      var rootNode = new Ext.tree.AsyncTreeNode({
        text: menu.title,
        draggable:false,
        children: children
      });     
    

      var tree = new Ext.tree.TreePanel( {
                            enableDD:false,
                            loader: new Ext.tree.TreeLoader({preloadChildren:true}), 
                            renderTo: 'jsontree',
                            root: rootNode,
                            rootVisible:false
                            });
      rootNode.expand(true);
  }

                  </script>
          </g:if>
	</head>
	<body>
		  <div class="nav">
            <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
		<div id="show-menu" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list menu">
			
				<g:if test="${menuInstance?.title}">
				<li class="fieldcontain">
					<span id="title-label" class="property-label"><g:message code="menu.title.label" default="Title" /></span>
					
						<span class="property-value" aria-labelledby="title-label"><g:fieldValue bean="${menuInstance}" field="title"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${menuInstance?.active}">
				<li class="fieldcontain">
					<span id="active-label" class="property-label"><g:message code="menu.active.label" default="Active" /></span>
					
						<span class="property-value" aria-labelledby="active-label"><g:formatBoolean boolean="${menuInstance?.active}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${menuInstance?.editDate}">
				<li class="fieldcontain">
					<span id="editDate-label" class="property-label"><g:message code="menu.editDate.label" default="Edit Date" /></span>
					
						<span class="property-value" aria-labelledby="editDate-label"><g:formatDate date="${menuInstance?.editDate}" /></span>
					
				</li>
				</g:if>
              
                                <div id="jsontree"></div>
			
				
			
			</ol>
			<g:form>
				<fieldset class="">
					<g:hiddenField name="id" value="${menuInstance?.id}" />
					<span class="menuButton"><g:link class="edit" action="edit" id="${menuInstance?.id}"><g:message code="default.button.edit.label" default="Edit" /></g:link></span>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
