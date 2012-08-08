<%@ page import="grails.util.Environment" %>
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
          <h2>Portal Config</h2>
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

			<li class="controllerMenuItems"><g:link controller="aodaacProductLink">AODAAC Product Links</g:link></li>

            <li class="controllerMenuItems"><g:link controller="config"  >Site Configuration</g:link></li>
            <li class="controllerMenuItems"><g:link controller="wmsScanner" action="controls" >WMS Scanner Controls</g:link></li>
          </ul>
          <br />
        <b>Portal project build info</b><br />
        Instance name: ${ grailsApplication.config.instanceName ?: '<span style="color: red;">None supplied</span>' }<br />
        Environment: ${Environment.current.name}<br />
        Build date: ${grailsApplication.metadata['app.build.date'] ?: "Unk."}<br />
        Subversion revision: #${grailsApplication.metadata['app.svn.revision'] ?: "Unk."}<br />
        Subversion url: ${grailsApplication.metadata['app.svn.url'] ?: "Unk."}<br />
        Build: #${grailsApplication.metadata['app.build.number'] ?: "Unk."}<br />
        App version: ${grailsApplication.metadata['app.version']}
        </div>
    </body>
</html>