<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <g:render template="../common_includes" />

  <title>${configInstance?.name} - Register new account</title>

</head>
<body>
<g:render template="../mainPortalHeader" model="['configInstance':configInstance]" />
<div class="authentication-form">
 <div class="authentication-formLinks">
   <g:link controller="home" >Home Page</g:link>
  </div>
  <div class="authentication-form-floated">
    <h2>Register new account</h2>

    <div class="authentication-hints">Already have an account? You can log in <g:link controller="auth" action="login">here</g:link>.</div>
    <BR />

    <g:if test="${flash.message}">
      <div class="message">${flash.message}</div>
    </g:if>
    <g:hasErrors bean="${userAccountCmd}">
      <div class="errors">
        <g:renderErrors bean="${userAccountCmd}" as="list" />
      </div>
    </g:hasErrors>
    <g:form action="createUser" >

      <g:render template="/userFormBody" model="[actionButtonLabel:'Register']" />

    </g:form>
  </div>
</div>
</body>
</html>