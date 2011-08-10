<%@ page import="au.org.emii.portal.Menu" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'menu.label', default: 'Menu')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>        
        
        <script>
          function showSpinner() {
            jQuery("#spinner,#ajaxStatus").show();
          }
          function hideSpinner() {
            jQuery("#spinner").hide();
          }
          
          </script>
                     
	</head>
	<body>
		<div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
		<div id="list-menu" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
                        <g:if test="${flash.message}">
                            <div class="message" role="status">${flash.message}</div>
                            
			</g:if>
            <div id="ajaxStatus" class="message" style="display:none" ></div>
			<table>
				<thead>
					<tr>
					
						<g:sortableColumn property="title" title="${message(code: 'menu.title.label', default: 'Title')}" />
					
						<g:sortableColumn property="active" title="${message(code: 'menu.active.label', default: 'Active')}" />
					
						<g:sortableColumn property="editDate" title="${message(code: 'menu.editDate.label', default: 'Edit Date')}" />
					
						
					
					</tr>
				</thead>
				<tbody>
				<g:each in="${menuInstanceList}" status="i" var="menuInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link action="show" id="${menuInstance.id}">${fieldValue(bean: menuInstance, field: "title")}</g:link></td>
					
                                                <td>
                                                         <g:checkBox name="active" value="${menuInstance.active}"   autocomplete="off" onchange="${remoteFunction(action:'setActive',id:menuInstance.id, before:'showSpinner()',after:'hideSpinner()', update:[success:'ajaxStatus', failure: 'ajaxStatus'], params:'\'active=\' + this.checked')}" />
                                                </td>
					
						<td><g:formatDate date="${menuInstance.editDate}" /></td>
					
						
					
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${menuInstanceTotal}" />
			</div>
		</div>
	</body>
</html>
