<g:render template="/core_theme_includes"></g:render>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'general.css')}?v=${resourceVersionNumber}"/>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css/font-awesome-4.3.0/css/', file: 'font-awesome.min.css')}"/>

<g:if test="${grailsApplication.config.portal.localThemeCss}"><link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: grailsApplication.config.portal.localThemeCss)}?v=${resourceVersionNumber}"/></g:if>
<g:if test="${grailsApplication.config.portal.externalThemeCss}"><link rel="stylesheet" type="text/css" href="${grailsApplication.config.portal.externalThemeCss}?v=${resourceVersionNumber}"/></g:if>

<link rel="stylesheet" type="text/css" href="${createLink(controller: 'search', action: 'css')}?v=${new Date().time}"/>

<link href='https://fonts.googleapis.com/css?family=Arimo:400,700' rel='stylesheet' type='text/css'>
<link href='https://fonts.googleapis.com/css?family=Oswald:400,700' rel='stylesheet' type='text/css'>
