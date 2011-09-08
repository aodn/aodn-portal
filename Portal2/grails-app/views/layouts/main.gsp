<!DOCTYPE html>
<html>
    <head>
      
        <!--- common styles and JavaScript for the map page and Grails admin pages -->
       <g:render template="/common_includes"></g:render>
       
        <title><g:layoutTitle default="Administration" /></title>
        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />
        
        <g:layoutHead />
       
        <link rel="stylesheet" media="screen" type="text/css"  href="${resource(dir:'css',file:'grails.css')}" />
    </head>
    <body>
        <div id="spinner" class="spinner" style="display:none;">
            <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
        </div>
        
      <g:layoutBody />
      
      <shiro:user>
        <div id="controllerMenu">
          <h2>Portal Config Controllers</h2>
          <ul>
            <li class="controllerMenuItems"><g:link controller="server" action="list" >Server</g:link>
              <span class="inline">
                <g:link controller="server" action="create" class="" >create</g:link>
              </span>
            </li>
            <li class="controllerMenuItems"><g:link controller="layer" action="list" >Layer</g:link>
              <span class="inline">
                <g:link controller="layer" action="create" class="" >create</g:link>
              </span>
            </li>
            <li class="controllerMenuItems"><g:link controller="menu" action="list" >Menu</g:link>
              <span class="inline">
                <g:link controller="menu" action="create" class="" >create</g:link>
              </span>
            </li>
            <li class="controllerMenuItems"><g:link controller="motd" action="list" >MOTD</g:link>
              <span class="inline">
                <g:link controller="motd" action="create" class="" >create</g:link>
              </span>
            </li>
            <li class="controllerMenuItems"><g:link controller="config"  >Site Configuration</g:link>
            </li>
          </ul>
        </div>
      </shiro:user>
      <br/>
      <br/>
      <br/>
      <div>
      <h2>Authentication:</h2>
        User:<br />
        <shiro:user>true</shiro:user><shiro:notUser>false</shiro:notUser><br/><br />
        
        Logged-in (this session):<br />
        <shiro:isLoggedIn>true</shiro:isLoggedIn><shiro:isNotLoggedIn>false</shiro:isNotLoggedIn><br/><br />
        
        Remembered (from previous session):<br />
        <shiro:remembered>true</shiro:remembered><shiro:notRemembered>false</shiro:notRemembered><br/><br />
            
        <shiro:user><g:link controller="auth" action="signOut">Log out</g:link></shiro:user>
      </div>
    </body>
</html>