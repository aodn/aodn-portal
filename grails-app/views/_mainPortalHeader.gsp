
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

  <div id="header" style="height:${configInstance?.headerHeight}px">
	<img src="${resource(dir:'images',file: grailsApplication.config.portal.header.logo)}" id="logo" />
	<h1 id="headerTitle">${configInstance?.name}</h1>
    <g:if test="${showLinks}">
    <div id="viewPortLinks">
      <div class="viewPortLinksBackground viewPortLinks" id="viewPortTab0"><a href="" onClick="setViewPortTab(0); return false;">Home</a></div>
      <div class="viewPortLinksBackground viewPortLinks" id="viewPortTab1"><a href="" onClick="setViewPortTab(1); return false;">Map</a></div>
      <div class="viewPortLinksBackground viewPortLinks" id="viewPortTab2"><a href="" onClick="setViewPortTab(2); return false;">Search</a></div>
    </div>
    </g:if>

    <div id="toplinks" >
        <g:if test="${flash.openidErrorMessage}">
            <strong>${ flash.openidErrorMessage}</strong>
        </g:if>
        <shiro:notUser>
            <g:link controller="auth" action="login">Log in</g:link> or 
            <g:link controller="auth" action="register">Register</g:link>
        </shiro:notUser>
        <shiro:user>
          Welcome <user:loggedInUser property="fullName" />
          <g:link controller="auth" action="logOut">Log out</g:link>
          <shiro:hasPermission permission="config:edit"> - <g:link controller="config">Administration</g:link></shiro:hasPermission>
        </shiro:user>
        <a class="external mainlinks" target="_blank" href="http://www.emii.org.au" title="e-Marine Information Infrastructure" >eMII</a>
        <a class="external mainlinks" target="_blank" href="${ grailsApplication.config.portal.header.organisationLink.url }" title="${ grailsApplication.config.portal.header.organisationLink.tooltipText }">${ grailsApplication.config.portal.header.organisationLink.linkText }</a>
      	<a class="external mainlinks" target="_blank" href="${grailsApplication.config.help.url}" title="Portal Help files" >Help</a>
    </div>
    <div id="downloadCart" class="hiddenCart">
      Download cart: <b><span id="downloadCartSize">0</span></b> item(s)<br/><div id="downloadCartControls"><a href="#" onclick="javascript:doDownload();">download</a> | <a href="javascript:clearDownloadCart();">clear cart</a></div>
    </div>
  </div>
<div id="headerTail" >&nbsp;</div>
