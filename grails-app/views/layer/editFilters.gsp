
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="au.org.emii.portal.FilterType" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'layer.label', default: '')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>

        <script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base.js')}"  type="text/javascript"></script>
		<script src="${resource(dir:'js',file:'ext-3.3.1/ext-all-debug.js')}"   type="text/javascript"></script>

		<script language="javascript">
			function getCombo(sel) {
				var value = sel.options[sel.selectedIndex].value;
				if((value == "Boolean") || (value == "BoundingBox")){
                 	document.getElementById('possibleValues').style.visibility = 'hidden';
				}
				else{
					document.getElementById('possibleValues').style.visibility = 'visible';
				}
			}

			Ext.onReady(function() {

			});

		</script>
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
                                    <label for="label"><g:message code="filter.enabled.label" default="Enabled" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: filterInstance, field: 'enabled', 'errors')}">
                                    <g:checkBox name="enabled" checked="${filterInstance?.enabled}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="label"><g:message code="filter.downloadOnly.label" default="Download Only" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: filterInstance, field: 'downloadfOnly', 'errors')}">
                                    <g:checkBox name="downloadOnly" checked="${filterInstance?.downloadOnly}" />
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
									<label for="type"><g:message code="filter.type.label" default="Type" /></label>
								</td>
								<td valign="top" class="value ${hasErrors(bean: filterInstance, field: 'type', 'errors')}">

								 <g:select name="type" from="${FilterType?.values()}" optionKey="key" onselect="getCombo(this)" />
								</td>
							</tr>

							 <tr class="prop" id="possibleValues">
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
                    <ul>
                    <g:each in="${layerInstance?.filters?.sort(){it.name}}" var="filter">
                        <g:if test="${filter.enabled}">
                            <li><b><g:link controller="filter" action="edit" id="${filter.id}">${filter.label}</g:link></b></li>
                        </g:if>
                        <g:else>
                            <li><i><g:link controller="filter" action="edit" id="${filter.id}">${filter.label}</g:link></i></li>
                        </g:else>
                    </g:each>
                    </ul>
                </div>
			</g:if>
		</div>
	</body>
</html>
