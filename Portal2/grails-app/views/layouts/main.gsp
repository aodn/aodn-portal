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

            <li class="controllerMenuItems"><g:link controller="user"  >Users</g:link><span class="inline">
                <g:link controller="user" action="create" class="" >create</g:link>
              </span>
            </li>

            <li class="controllerMenuItems"><g:link controller="config"  >Site Configuration</g:link></li>
            <li class="controllerMenuItems"><g:link controller="wmsScanner" action="controls" >WMS Scanner Controls</g:link></li>
          </ul>
          <br />
          <g:render template="/projectInfo"></g:render>
        </div>
    </body>
</html>