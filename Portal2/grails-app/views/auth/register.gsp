<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <g:render template="../common_includes" />
    
    <title>${configInstance?.name} - Register new account</title>
  </head>
  <body>
    <g:render template="../mainPortalHeader" model="['configInstance':configInstance]" />
    <div class="body authentication-form">
      <h2>Register new account</h2>
                
      <div class="authentication-hints">Already have an account? You can log in <g:link controller="auth" action="login">here</g:link>.</div>

      <g:if test="${flash.message}">
        <div class="message">${flash.message}</div>
      </g:if>
      <g:hasErrors bean="${userAccountCmd}">
      <div class="errors">
          <g:renderErrors bean="${userAccountCmd}" as="list" />
      </div>
      </g:hasErrors>
      <g:form action="createUser" >

        <div class="dialog">
          <g:render template="/user_form_body"/>

          <div class="buttons">
              <span class="button"><g:submitButton name="register" class="save" value="${message(code: 'default.button.create.label', default: 'Register')}" /></span>
              <g:link controller="home">Cancel</g:link>
          </div>
      </g:form>
    </div>
  </body>
</html>