<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<r:external uri="/js/GeoExt1.1/resources/css/geoext-all.css" />
<!-- User extensions -->
<r:external uri="/js/ext-ux/SuperBoxSelect/superboxselect.css" />
<r:external uri="/js/ext-ux/Hyperlink/hyperlink.css" />

%{--<r:require modules="coreTheme"/>--}%
<r:external uri="/js/ext-3.3.1/resources/css/ext-all-notheme.css" />
<r:external uri="/js/ext-3.3.1/resources/css/xBaseTheme.css" />


<g:if test="${grailsApplication.config.portal.instance?.name}">
<r:external file="${grailsApplication.config.portal.instance.name + 'favicon.ico'}" dir="images"  type="ico"/>
</g:if>
