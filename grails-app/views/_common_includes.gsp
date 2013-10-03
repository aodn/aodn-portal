<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<!-- First import JQUERY -->
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js', file: 'jquery/jquery-1.4.1.min.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/portal', file: 'jquery.js')}"></script>
<!-- Import extra pluggins-->
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js', file: 'jquery/jquery-autocomplete1.1.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js', file: 'jquery/jquery.rotate.1-1.js')}"></script>

<script src="${resource(dir: 'js/portal/common', file: 'helpers.js')}" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-3.3.1/resources/css/ext-all-notheme.css')}"/>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-3.3.1/resources/css/xBaseTheme.css')}"/>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'general.css')}"/>
<g:if test="${grailsApplication.config.portal.instance?.css}">
    <link rel="stylesheet" type="text/css" href="${grailsApplication.config.portal.instance.css}"/>
</g:if>
<g:elseif test="${grailsApplication.config.portal.instance?.name}">
    <link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: grailsApplication.config.portal.instance.name + '.css')}"/>
</g:elseif>

<g:if test="${grailsApplication.config.portal.instance?.name}">
    <link rel="shortcut icon" href="${resource(dir: 'images', file: grailsApplication.config.portal.instance.name + 'favicon.ico')}" type="image/x-icon"/>
</g:if>
