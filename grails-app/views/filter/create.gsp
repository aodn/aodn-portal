
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>



<%@ page import="au.org.emii.portal.Filter; au.org.emii.portal.FilterType" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'filter.label', default: 'Filter')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${filterInstance}">
            <div class="errors">
                <g:renderErrors bean="${filterInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
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

                                 <g:select name="type" from="${FilterType?.values()}" optionKey="key" />
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
        </div>
    </body>
</html>
