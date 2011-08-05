<!DOCTYPE html>
<html>
    <head>
      
        <!--- common styles and JavaScript for the map page and Grails admin pages -->
       <g:render template="/common_includes"></g:render>
       
        <title><g:layoutTitle default="Administration" /></title>
        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />
        
        <g:layoutHead />
        <g:javascript library="application" />
        
        <link rel="stylesheet" media="screen" type="text/css"  href="${resource(dir:'css',file:'grails.css')}" />
    </head>
    <body>
        <div id="spinner" class="spinner" style="display:none;">
            <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
        </div>
        <div id="logo"><img src="${resource(dir:'images',file:'logo.png')}" alt="Portal Logo" border="0" /></div>
        <g:layoutBody />
    </body>
</html>