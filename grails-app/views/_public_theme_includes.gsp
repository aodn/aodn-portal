<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<g:render template="/core_theme_includes"></g:render>

<r:external uri="/css/general.css"/>


<g:if test="${grailsApplication.config.portal.instance?.css}">
    <r:external uri="${grailsApplication.config.portal.instance.css}"/>
</g:if>
<g:elseif test="${grailsApplication.config.portal.instance?.name}">
    <r:external uri="/css/${grailsApplication.config.portal.instance.name + '.css'}"/>
</g:elseif>
