

<%@ page import="au.org.emii.portal.User" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
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
            <g:hasErrors bean="${userInstance}">
            <div class="errors">
                <g:renderErrors bean="${userInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="emailAddress"><g:message code="user.emailAddress.label" default="Email Address" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: userInstance, field: 'emailAddress', 'errors')}">
                                    <g:textField name="emailAddress" value="${userInstance?.emailAddress}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="openIdUrl"><g:message code="user.openIdUrl.label" default="OpenID URL" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: userInstance, field: 'openIdUrl', 'errors')}">
                                    <g:textField name="openIdUrl" value="${userInstance?.openIdUrl}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="fullName"><g:message code="user.fullName.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: userInstance, field: 'fullName', 'errors')}">
                                    <g:textField name="fullName" value="${userInstance?.fullName}" />
                                </td>
                            </tr>
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
