<html>
  <head>
    <!--- common styles and JavaScript for the map page and Grails admin pages -->
    <g:render template="/common_includes"></g:render>
    
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
    
    <title>${configInstance?.name} - Register new account</title>
  </head>
  <body>
    <div class="body">
        <h1>Register new account</h1>
                
            <i>Already have an account? You can log in <g:link controller="auth" action="login">here</g:link></i>.
        
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