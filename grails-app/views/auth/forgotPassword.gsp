<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <g:render template="../common_includes" />
    
    <title>${configInstance?.name} - Forgot password</title>
    
      <style type="text/css">
      html, body, #headerTail {
        background-color: white;
      }      
    </style>
  </head>
  <body>
    <g:render template="../mainPortalHeader" model="['configInstance':configInstance]" />
    <div class="authentication-form">
      <h2>Forgot password</h2>
      <g:if test="${flash.message}">
        <div class="message">${flash.message}</div>
      </g:if>
      <g:hasErrors bean="${userResetPasswordCommand}">
        <div class="errors">
            <g:renderErrors bean="${userResetPasswordCommand}" as="list" />
        </div>
      </g:hasErrors>
      <g:form action="resetPassword" >
          <div class="auth">
            
            <p>If you have forgotten your password you can use this form to have a new one sent to your email address.</p>
              <table >
                  <tbody>
                      <tr class="prop">
                          <td valign="top" align="right" class="name">
                              <label for="emailAddress"><g:message code="user.emailAddress.label" default="Email Address" /></label>
                          </td>
                          <td valign="top" class="value ${hasErrors(bean: userResetPasswordCommand, field: 'emailAddress', 'errors')}">
                              <g:textField name="emailAddress" value="${userResetPasswordCommand?.emailAddress}" />
                          </td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td><div class="buttons"><span class="button"><input  class="save" type="submit" value="Cancel"  ONCLICK="history.go(-1)"></span>
                                <span class="button"><g:submitButton name="submit" class="save" value="${message(code: 'auth.account.resetPasswordButton', default: 'Reset password')}" /></span>
                            </div>
                        </td>
                      </tr>
                  </tbody>
              </table>
      <div class="authentication-hints">
        Don't have an account? Register a new account <g:link controller="auth" action="register">here</g:link>.
      </div>
          </div>
          
    </g:form>
    </div>
  </body>
</html>