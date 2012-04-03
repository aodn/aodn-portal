<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <g:render template="../common_includes" />

    <g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
    
    <title>${configInstance?.name} - Update account details</title>

  </head>
  <body>
    <g:render template="../mainPortalHeader" model="['configInstance':configInstance]" />
    <div class="authentication-form auth">
       <div class="authentication-formLinks">
         <g:link controller="home" >Home Page</g:link>
        </div>
      <div class="authentication-form-floated">
        <h2>Update account details</h2>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${userAccountCmd}">
            <div class="errors">
                <g:renderErrors bean="${userAccountCmd}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="userUpdateAccount" >
                
                <g:render template="/userFormBody" model="[actionButtonLabel: 'Update']" />
                
            </g:form>
        </div>
    </div>
  </body>
</html>