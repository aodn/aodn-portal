<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<div id="header">

    <div id="logoContainer">
        <g:link controller="landing"><g:img uri="${resource(base: portalBranding.brandingBase, file: portalBranding.logoImage)}" alt="logo" id="logo" />
        </g:link>
    </div>
    <div id="landingHeaderContainer" class="headerHeightOverlord">
        <h1 id="headerTitle">${portalBranding.siteHeader}</h1>
    </div>

    <g:if test="${showLinks}">
        <div id="viewPortLinks">
            <g:each var="viewPortLink" status="i"
                    in="${[['tabIndex': 'TAB_INDEX_SEARCH', 'description': 'Select a Data Collection'],
                           ['tabIndex': 'TAB_INDEX_VISUALISE', 'description': 'Create a Subset'],
                           ['tabIndex': 'TAB_INDEX_DOWNLOAD', 'description': 'Download']]}" >
                <g:render template="/header/viewPortLink"
                          model="['stepIndex': i, 'tabIndex': viewPortLink.tabIndex, 'description': viewPortLink.description]" />
            </g:each>
        </div>
    </g:if>

    <div id="toplinks">
        <a class="external mainlinks" target="_blank" href="${grailsApplication.config.help.url}" title="Portal Help">Help</a>
    </div>
</div>
