<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<g:render template="/core_theme_includes"></g:render>

<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'general.css')}?v=${resourceVersionNumber}"/>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css/font-awesome-4.3.0/css/', file: 'font-awesome.min.css')}"/>

<g:if test="${grailsApplication.config.portal.instance?.css}">
    <link rel="stylesheet" type="text/css" href="${grailsApplication.config.portal.instance.css}?v=${resourceVersionNumber}"/>
</g:if>
<g:elseif test="${grailsApplication.config.portal.instance?.name}">
    <link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: grailsApplication.config.portal.instance.name + '.css')}?v=${resourceVersionNumber}"/>
</g:elseif>

<link rel="stylesheet" type="text/css" href="${createLink(controller: 'home', action: 'css')}?v=${new Date().time}"/>
