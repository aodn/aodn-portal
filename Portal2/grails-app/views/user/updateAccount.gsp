<html>
  <head>
    <!--- common styles and JavaScript for the map page and Grails admin pages -->
    <g:render template="/common_includes"></g:render>
    
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
    
    <title>${configInstance?.name} - Update account details</title>
  </head>
  <body>
    <div class="body">
        <h1>Update account details</h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${userAccountCmd}">
            <div class="errors">
                <g:renderErrors bean="${userAccountCmd}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="userUpdateAccount" >
                
                <g:render template="/user_form_body"/>
                
                <div class="buttons">
                    <span class="button"><g:submitButton name="update" class="save" value="${message(code: 'default.button.update.label', default: 'Update account')}" /></span>
                    <g:link controller="home">Cancel</g:link>
                </div>
            </g:form>
        </div>
  </body>
</html>
