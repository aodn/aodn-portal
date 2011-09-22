<html>
  <head>
    <!--- common styles and JavaScript for the map page and Grails admin pages -->
    <g:render template="/common_includes"></g:render>
    
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="layout" content="main" />
    <!--<g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />-->
    
    <title>${configInstance?.name} - Forgot password</title>
  </head>
  <body>
    <div class="body">
        <h1>Forgot password</h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${userResetPasswordCommand}">
            <div class="errors">
                <g:renderErrors bean="${userResetPasswordCommand}" as="list" />
            </div>
            </g:hasErrors>
            If you have forgotten your password you can use this form to have a new one sent to your email address.
            <g:form action="resetPassword" >
                <div class="dialog">
                    <table>
                        <tbody>
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="emailAddress"><g:message code="user.emailAddress.label" default="Email Address" /></label>
                                    <span class="required-indicator">*</span>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: userResetPasswordCommand, field: 'emailAddress', 'errors')}">
                                    <g:textField name="emailAddress" value="${userResetPasswordCommand?.emailAddress}" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:submitButton name="submit" class="save" value="${message(code: 'auth.account.resetPasswordButton', default: 'Reset password')}" /></span>
                </div>
            </g:form>
        </div>
  </body>
</html>