<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="layout" content="main" />
  
  <title>${configInstance?.name} - Login</title>
</head>
<body>
  <div class="body">
    <g:if test="${flash.message}">
      <div class="message">${flash.message}</div>
    </g:if>
    <g:form action="signIn">
      <input type="hidden" name="targetUri" value="${targetUri}" />
      <table style="width: 300px;">
        <tbody>
          <tr>
            <td>Email address:</td>
            <td><input type="text" name="username" value="${username}" /></td>
          </tr>
          <tr>
            <td>Password:</td>
            <td><input type="password" name="password" value="" /></td>
          </tr>
          <tr>
            <td>Remember me?:</td>
            <td><g:checkBox name="rememberMe" value="${rememberMe}" /></td>
          </tr>
          <tr>
            <td />
            <td><input type="submit" value="Sign in" /></td>
          </tr>
          <tr>
            <td colspan="2" style="white-space:nowrap;"><i>Forgot your password? Recover your account <g:link controller="auth" action="forgotPassword">here</g:link></i>.</td>
          </tr>
          <tr>
            <td colspan="2" style="white-space:nowrap;"><i>Don't have an account? Register a new account <g:link controller="auth" action="register">here</g:link></i>.</td>
          </tr>
        </tbody>
      </table>
    </g:form>
  </div>
</body>
</html>
