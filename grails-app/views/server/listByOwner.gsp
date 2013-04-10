
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="au.org.emii.portal.Server" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'layer.label', default: '')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
        	<span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
          <div id="logo"></div>
        </div>

        <div class="body">
			<g:each in="${maps?.entrySet()}" var="server">
				<h2>${server.key}</h2>

				<script type="text/javascript">

					function goToPage(requestParams){
						window.location.href="${createLink(controller:'layer' ,action:'editFilters' ,params:[id:""])}" + "/" + requestParams;
					}

				</script>



				<ul>
					<g:select name="owners"
						  from="${server?.value.sort {it.name}}"
						  optionKey="id"
						  onchange="goToPage(this.value)"/>
				</ul>

			</g:each>
		</div>
    </body>
</html>
