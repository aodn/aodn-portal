<div id="header"class="headerHeightOverlord" >
    <div id="header-bg-image"></div>
    <div id="headerBrand">
        <div id="logoContainer">
            <a href="${createLink(uri: '', absolute: true)}"><img src="${portalBranding.logoImage}" alt="main logo" width="180" />
            </a>
        </div>
        <div id="headerContainer" >
            <h1 id="headerTitle">${portalBranding.siteHeader}</h1>
        </div>
    </div>
    <g:set var="betaBanner" value="${grailsApplication.config.portal.header.betaBanner}" />
    <g:if test="${betaBanner.enabled}">
        <div id="betaBanner">
            <div class="betaBannerItem betaBannerMessage">${betaBanner.messageOne}</div>
            <div class="betaBannerItem">
                <a class="betaBannerButton" target="_blank" rel="noopener" href="${betaBanner.buttonOne.href}">${betaBanner.buttonOne.linkText}</a>
            </div>
            <div class="betaBannerItem betaBannerMessage">${betaBanner.messageTwo}</div>
            <div class="betaBannerItem">
                <a class="betaBannerButton" target="_blank" rel="noopener" href="${betaBanner.buttonTwo.href}">${betaBanner.buttonTwo.linkText}</a>
            </div>
        </div>
    </g:if>
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
    <div id="login-status-container" style="position: absolute; margin-left: 100%; height: 36px; width: 300px; pointer-events: none">
    <div id="nameTag"></div>
    <div id="authStatus"></div>
</div>
</div>
<g:if test="${betaBanner.enabled && showMobileBetaBanner}">
    <div id="betaBannerMobile">
        <div class="betaBannerMobileBlock">
            <div class="betaBannerMobileMessage">${betaBanner.messageOne}</div>
            <a class="betaBannerButton" target="_blank" rel="noopener" href="${betaBanner.buttonOne.href}">${betaBanner.buttonOne.linkText}</a>
        </div>
        <div class="betaBannerMobileBlock">
            <div class="betaBannerMobileMessage">${betaBanner.messageTwo}</div>
            <a class="betaBannerButton" target="_blank" rel="noopener" href="${betaBanner.buttonTwo.href}">${betaBanner.buttonTwo.linkText}</a>
        </div>
    </div>
</g:if>
<g:if test="${showLinks}">
    <div id="viewPortLinks">
        <g:each var="viewPortLink" status="i"
            in="${[['tabIndex': 'TAB_INDEX_SEARCH', 'description': 'Select a Data Collection'],
                   ['tabIndex': 'TAB_INDEX_VISUALISE', 'description': 'Create a Subset'],
                   ['tabIndex': 'TAB_INDEX_DOWNLOAD', 'description': 'Download']]}" >
            <g:render template="/header/viewPortLink"
                model="['stepIndex': i, 'tabIndex': viewPortLink.tabIndex, 'description': viewPortLink.description]" />
        </g:each>
        <g:render template="/auth/authStatusBar"></g:render>
    </div>
</g:if>
