
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<%@ page import="grails.util.Environment" %>
<!DOCTYPE html>
<html>
    <head>
      <meta http-equiv="Content-type" content="text/html;charset=UTF-8">



        <!--- common styles and JavaScript for the map page and Grails admin pages -->
       <g:render template="/js_includes"></g:render>
       <g:render template="/theme_includes"></g:render>

        <title><g:layoutTitle default="Administration" /></title>

        <g:if test="${grailsApplication.config.portal.instance?.name}">
            <link rel="shortcut icon" href="${resource(dir:'images',file: grailsApplication.config.portal.instance.name + 'favicon.ico')}" type="image/x-icon" />
        </g:if>

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
          <user:loggedInUserInRole roles="Administrator">

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
            <li class="controllerMenuItems"><g:link controller="systemTest" action="controls" >System Test Controls</g:link></li>

           </user:loggedInUserInRole>
           <user:loggedInUserInRole roles="Administrator,ServerOwner">
               <li class="controllerMenuItems"><g:link controller="wmsScanner" action="controls" >WMS Scanner Controls</g:link></li>
                <li class="controllerMenuItems"><g:link controller="server" action="listByOwner">Edit Filters</g:link></li>
           </user:loggedInUserInRole>

          </ul>
          <br />
        <b>Portal project build info</b><br />
        Instance name: ${ grailsApplication.config.portal.instance.name ?: '<span style="color: red;">None supplied</span>' }<br />
        Environment: ${Environment.current.name}<br />
        Build date: ${grailsApplication.metadata['app.build.date'] ?: "Unk."}<br />
        App version: ${grailsApplication.metadata['app.version']}
        </div>
    </body>
</html>
