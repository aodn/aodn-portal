  <div id="header" style="height:${configInstance?.headerHeight}px">
	<img src="${resource(dir:'images',file: grailsApplication.config.portal.header.logo)}" id="logo" />
	<h1 id="headerTitle">${configInstance?.name}</h1>
    <g:if test="${showLinks}">
    <div id="viewPortLinks" class="">
      <div class="viewPortLinksBackground viewPortLinks" id="viewPortTab0"><a href="" onClick="setViewPortTab(0);return false;" >Home</a></div>
      <div class="viewPortLinksBackground viewPortLinks" id="viewPortTab1"><a href="" onClick="setViewPortTab(1);return false;" >Map</a></div>
      <div class="viewPortLinksBackground viewPortLinks" id="viewPortTab2"><a href="" onClick="setViewPortTab(2);return false;" >Search</a></div>
    </div>
    </g:if>
    
    <div id="toplinks" >
      <shiro:user>
        Welcome <g:link controller="user" action="updateAccount" class="userlink" ><user:loggedInUser property="firstName" /></g:link>
        <g:link controller="auth" action="signOut">Log out</g:link>
      </shiro:user>
      <shiro:notUser>
        <g:link controller="auth" action="login">Log in</g:link> or
        <g:link controller="auth" action="register">Register</g:link>
      </shiro:notUser>
      <a class="external mainlinks" target="_blank" href="http://www.emii.org.au" title="e-Marine Information Infrastructure">eMII</a>
      <a class="external mainlinks" target="_blank" href="${ grailsApplication.config.portal.header.organisationLink.url }" title="${ grailsApplication.config.portal.header.organisationLink.tooltipText }">${ grailsApplication.config.portal.header.organisationLink.linkText }</a>
      <a class="external mainlinks" href="http://emii1.its.utas.edu.au/Portal2_help/" title="Portal Help files" target="_blank">Help</a>
    </div>
    <div id="downloadCart" class="hiddenCart">
      Download cart: <b><span id="downloadCartSize">0</span></b> item(s)<br/><div id="downloadCartControls"><a href="downloadCart/download" onclick="return confirm( 'Please be patient, it can take a while to collect and collate items for a download cart. Continue with download?' );">download</a> | <a href="javascript:clearDownloadCart();">clear cart</a></div>
    </div>
  </div>
<div id="headerTail" >&nbsp;</div>