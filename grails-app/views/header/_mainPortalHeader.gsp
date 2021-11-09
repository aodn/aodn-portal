<div id="header"class="headerHeightOverlord" >
    <div id="header-bg-image"></div>
    <div id="logoContainer">
        <a href="${createLink(uri: '', absolute: true)}"><img src="${portalBranding.logoImage}" alt="main logo" width="180" />
        </a>
    </div>
    <div id="headerContainer" >
        <h1 id="headerTitle">${portalBranding.siteHeader}</h1>
    </div>
    <g:if test="${portalBranding.secondaryLogoImage}">
    <div id="secondaryLogoContainer">
        <img src="${portalBranding.secondaryLogoImage}" alt="secondary logo" width="120" />
    </div>
    </g:if>
    <div id="toplinks">
        <g:each in="${grailsApplication.config.portal.header.externalLinks}" var="link">
            <a class="external mainlinks" target="_blank" href="${link.href}" title="${link.tooltipText}">${link.linkText}</a>
        </g:each>
    </div>
    <div id="login-status-container" style="position: absolute; margin-left: 100%; height: 36px; width: 300px; background-color: red">
    <div id="nameTag"></div>
    <div id="authStatus"></div>
</div>
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
        <g:if test="${grailsApplication.config.featureToggles.cognitoAuthentication}">
            <g:render template="/auth/authStatusBar"></g:render>
        </g:if>
    </div>
</g:if>
