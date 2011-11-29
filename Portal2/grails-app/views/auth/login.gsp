<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <g:render template="../common_includes" />
  
  <title>${configInstance?.name} - Login</title>
  <style type="text/css">
      html, body, #headerTail {
        background-color: white;
      }      
    </style>
</head>
<body>
  <g:render template="../mainPortalHeader" model="['configInstance':configInstance, 'showLinks': true]" />
  <div class="authentication-form auth">
    <h2>Log in</h2>
    <g:if test="${flash.message}">
      <div class="message">${flash.message}</div>
    </g:if>
    <g:form action="signIn">
      <input type="hidden" name="targetUri" value="${targetUri}" />
      <table>
        <tbody>
          <tr>
            <td >Email address:</td>
            <td align="right"><input type="text" name="username" value="${username}" /></td>
          </tr>
          <tr>
            <td >Password:</td>
            <td align="right"><input type="password" name="password" value="" /></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td align="right" ><div class="buttons"><span class="button">
                <input type="button" name="cancel" value="Cancel" onCLick="window.location='${createLinkTo(dir:'/')}'" /></span>
                    <span class="button"><input type="submit" value="Log in" /></span>
                </div>
            </td>
          </tr>
          
        </tbody>
      </table>
      <div class="authentication-hints">
        Forgot your password? Recover your account <g:link controller="auth" action="forgotPassword">here</g:link>.<br/>
        Don't have an account? Register a new account <g:link controller="auth" action="register">here</g:link>.
      </div>
    </g:form>
  </div>
</body>
</html>
