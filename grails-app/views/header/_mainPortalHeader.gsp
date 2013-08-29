<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div id="header" style="height:${configInstance?.headerHeight}px">

    <img src="${resource(dir: 'images', file: grailsApplication.config.portal.header.logo)}" alt="logo" id="logo"/>

    <h1 id="headerTitle">${configInstance?.name}</h1>

    <g:if test="${showLinks}">
        <div id="viewPortLinks">
            <g:each var="viewPortLink" status="i"
                    in="${[['tabIndex': 'TAB_INDEX_SEARCH', 'description': 'Search for Data Collections'],
                           ['tabIndex': 'TAB_INDEX_VISUALISE', 'description': 'Visualise and Subset'],
                           ['tabIndex': 'TAB_INDEX_DOWNLOAD', 'description': 'Download']]}" >
                <g:render template="/header/viewPortLink"
                          model="['stepIndex': i, 'tabIndex': viewPortLink.tabIndex, 'description': viewPortLink.description]" />
            </g:each>
        </div>
    </g:if>

    <div id="toplinks">
        <g:if test="${flash.openidErrorMessage}">
            <strong>${flash.openidErrorMessage}</strong>
        </g:if>
        <shiro:notUser>

        <%-- Drop down dialog, enable selection of openid providers --%>
            <g:if test="${grailsApplication.config.openId.enableUserSuppliedProvider || grailsApplication.config.openId.providers.size > 1}">

            <%-- button supported by script --%>
                <a href="#" id="loginbutton">Login</a>

            <%-- the popup --%>
                <div id="loginpopup" style="padding: 6px; display: none; border: solid 1px silver; background-color: #ffffff; position: absolute; border-radius: 10px;"><ol>

                <%-- Generate the customisable list of providers and icons --%>
                    <g:each in="${grailsApplication.config.openId.providers}" var="link">
                        <li style="margin: 5px">
                            <g:link controller="auth" action="login" params='[openIdProvider: "${link.providerHref}"]' style='display: block;' class="highlight">
                                <img width="32px" height="32px" src="${link.iconHref}" style="vertical-align: middle" alt="provider icon">
                                ${link.name}
                            </g:link>
                        </li>
                    </g:each>

                <%-- Text input option to enable user to supply their own provider --%>
                    <g:if test="${grailsApplication.config.openId.enableUserSuppliedProvider}">
                        <li style="border-top: solid #888 1px; padding-top: 3px">
                            <div>
                                <g:form controller="auth">
                                    <g:textField onfocus="clearOnce(this)" name="openIdProvider" value="Other OpenID provider..."/>
                                    <g:actionSubmit value="&raquo" action="login"/>
                                </g:form>
                            </div>
                        </li>
                    </g:if>

                </ol></div>
            </g:if>

        <%-- If there's a single provider then just create a simple link --%>
            <g:else>
                <g:link controller="auth" action="login" params='[openIdProvider: "${grailsApplication.config.openId.providers.first().providerHref }"]'>Login</g:link>
            </g:else>

        <%-- Support registered provider --%>
            <g:if test="${grailsApplication.config.openId.registerProvider}">
                <g:link controller="auth" action="register" params='[openIdProvider: "${grailsApplication.config.openId.registerProvider.providerHref}"]'>Register</g:link>
            </g:if>

        </shiro:notUser>
        <shiro:user>
            Welcome <user:loggedInUser property="fullName"/>
            <g:link controller="auth" action="logOut">Log out</g:link>
            <shiro:hasPermission permission="config:edit">
                - <g:link controller="config">Administration</g:link>
            </shiro:hasPermission>
            <shiro:hasPermission permission="wmsScanner:controls">
                <shiro:lacksPermission permission="config:edit">
                    - <g:link controller="wmsScanner" action="controls">Administration</g:link>
                </shiro:lacksPermission>
            </shiro:hasPermission>

        </shiro:user>
        <g:each in="${grailsApplication.config.portal.header.externalLinks}" var="link">
            <a class="external mainlinks" target="_blank" href="${link.href}" title="${link.tooltipText}">${link.linkText}</a></g:each>
    </div>
</div>
