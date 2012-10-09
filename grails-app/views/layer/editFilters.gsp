<%@ page import="au.org.emii.portal.FilterTypes" %>
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
			<h1>${layerInstance.server.name} :: ${layerInstance?.title} Filters</h1>

			<h2>New filter</h2>

			<g:form action='save' controller='filter'>
				<div class="dialog">
					<table>
						<tbody>

							<tr class="prop">
								<td valign="top" class="name">
									<label for="name"><g:message code="filter.name.label" default="Name" /></label>
								</td>
								<td valign="top" class="value ${hasErrors(bean: filterInstance, field: 'name', 'errors')}">
									<g:textField name="name" value="${filterInstance?.name}" />
								</td>
							</tr>

							<tr class="prop">
								<td valign="top" class="name">
									<label for="type"><g:message code="filter.type.label" default="Type" /></label>
								</td>
								<td valign="top" class="value ${hasErrors(bean: filterInstance, field: 'type', 'errors')}">

								 <g:select name="type" from="${FilterTypes?.values()}" optionKey="key" />
								</td>
							</tr>

							<tr class="prop">
								<td valign="top" class="name">
									<label for="label"><g:message code="filter.label.label" default="Label" /></label>
								</td>
								<td valign="top" class="value ${hasErrors(bean: filterInstance, field: 'label', 'errors')}">
									<g:textField name="label" value="${filterInstance?.label}" />
								</td>
							</tr>

							 <tr class="prop">
								<td valign="top" class="name">
									<label for="possibleValues"><g:message code="filter.possibleValues.label" default="Values" /></label>
								</td>
								<td valign="top" class="value ${hasErrors(bean: filterInstance, field: 'possibleValues', 'errors')}">
									<g:textArea name="possibleValues" value="${filterInstance?.possibleValues}" />
								</td>
							 </tr>

							 <g:hiddenField name="layerId" value="${layerInstance?.id}" />

						</tbody>
					</table>
				</div>
				<div class="buttons">
					<span class="button"><g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" /></span>
				</div>
			</g:form>

			<br />
			<g:if test="${layerInstance?.filters?.size() > 0}">

				<h2>Modify an existing filter</h2>

				<div class="dialog">
					<g:each in="${layerInstance?.filters}" var="filter">
						<li><g:link controller="filter" action="edit" id="${filter.id}">${filter.label}</g:link></li>
					</g:each>
				</div>
			</g:if>
		</div>
	</body>
</html>
