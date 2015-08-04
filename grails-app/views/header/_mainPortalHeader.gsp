

<div id="header">

    <div id="logoContainer">
        <a href="landing"><img src="${portalBranding.logoImage}" alt="logo" id="logo" />
        </a>
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
        <g:each in="${grailsApplication.config.portal.header.externalLinks}" var="link">
            <a class="external mainlinks" target="_blank" href="${link.href}" title="${link.tooltipText}">${link.linkText}</a>
        </g:each>
    </div>
</div>
