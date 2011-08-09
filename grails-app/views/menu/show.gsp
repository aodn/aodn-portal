<%@ page import="au.org.emii.portal.Menu" %>
<!doctype html>
<html>
	<head>
          <meta name="layout" content="main">        
          
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
          <script src="${resource(dir:'js',file:'portal/grid2treedrag.js')}" type="text/javascript"></script>
          <script src="${resource(dir:'js',file:'portal/treeSerializer.js')}"  type="text/javascript"></script>
          <g:set var="entityName" value="${message(code: 'menu.label', default: 'Menu')}" />
          <title><g:message code="default.show.label" args="[entityName]" /></title>
          <g:if test="${menuInstance?.id}">				
                   <script>
                     
                      Ext.onReady(function(){
                          buildTree("${menuInstance?.id}");
                     });
                     
                     
                      // generic tree builder to move out of here latter
  function buildTree(id) {
    
      var layersContainer = new GeoExt.tree.LayerContainer();
       var testTree = new Ext.tree.TreePanel({
        layout: "fit",
        region: "west",
        title: "Contributors",
        width: 170,
        collapsible: false,
        collapseMode: "mini",
        split: true,
        root: layersContainer
    });
    var root = new Tree.AsyncTreeNode({
      text: 'Autos',
      draggable:false,
      id:'source',
      children: '${menuInstance?.json}''
      });
    	// create and show the window
	var win = new Ext.TreePanel({                
                defaults: {autoScroll: true}, // autoScroll for all items
                defaultMargins: 10 ,
		border:false,
                padding: 25               
                ,pack: 'start',
                align: 'stretch'
		,renderTo:'jsontree'

                ,items:[
                    contributorTree
                ]
                
	});
	win.doLayout();    
    
      
      
	tree = new Ext.tree.TreePanel({
        
        
		// root with some static demo nodes
		root:{text:'New Layer Menu', id:'root', leaf:false, children: [], expanded: true, expandable: true}
        
                //,rootVisible: false     

		// preloads 1st level children
		,loader:new Ext.tree.TreeLoader({preloadChildren:true})

		// enable DD
		,enableDD:true

		// set ddGroup - same as for grid
		,ddGroup:'grid2tree'

		,id:'tree'
                ,width: 250
		,border:false
		,collapsible:false
                ,padding: 20
		,autoScroll:true
		,listeners:{

		}
	});
	// }}}
    
        //tree.getRootNode().expand();
 

  
  
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
