<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<g:render template="/core_theme_includes"></g:render>
 
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'general.css')}"/>

<g:if test="${grailsApplication.config.portal.instance?.css}">
    <link rel="stylesheet" type="text/css" href="${grailsApplication.config.portal.instance.css}"/>
</g:if>
<g:elseif test="${grailsApplication.config.portal.instance?.name}">
    <link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: grailsApplication.config.portal.instance.name + '.css')}"/>
</g:elseif>
