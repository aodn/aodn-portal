<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <g:render template="../common_includes" />
    
    <title>${configInstance?.name} - Forgot password</title>
  </head>
  <body>
    <g:render template="../mainPortalHeader" model="['configInstance':configInstance]" />
    <div class="body authentication-form">
      <h2>Forgot password</h2>
      <g:if test="${flash.message}">
        <div class="message">${flash.message}</div>
      </g:if>
      <g:hasErrors bean="${userResetPasswordCommand}">
        <div class="errors">
            <g:renderErrors bean="${userResetPasswordCommand}" as="list" />
        </div>
      </g:hasErrors>
      If you have forgotten your password you can use this form to have a new one sent to your email address.<br/>
      <g:form action="resetPassword" >
          <div class="dialog">
              <table>
                  <tbody>
                      <tr class="prop">
                          <td valign="top" class="name">
                              <label for="emailAddress"><g:message code="user.emailAddress.label" default="Email Address" /></label>
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