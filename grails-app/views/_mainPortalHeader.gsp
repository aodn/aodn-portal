  <div id="header" style="height:${configInstance?.headerHeight}px">
      
    <img src="../../Portal2/images/AODN_logo.png" id="logo" />
    <h1 id="headerTitle">Australian Ocean Data Network</h1>
    <g:if test="${showLinks}">
    <div id="freeChoiceLinks" >
      <a href="" class="toplinksBackground" onClick="setViewPortTab(0);return false;" >Map</a> 
      <a href="" class="toplinksBackground" onClick="setViewPortTab(1);return false;" >Search</a> 
    </div>
    </g:if>
    
    <div id="toplinks" >
      <shiro:user>
          <!--Logged-in as: <g:link controller="user" action="updateAccount">
          <shiro:principal /></g:link> -->
           <g:link controller="auth" action="signOut">Log out</g:link>
      </shiro:user>
    <shiro:notUser>
      <g:if test="${showLogin}">
        <g:link controller="auth" action="login">Log in</g:link> or 
        <g:link controller="auth" action="register">Register</g:link>
      </g:if>
    </shiro:notUser>
      <a class="external mainlinks" target="_blank"href="http://www.emii.org.au" 
         title="e-Marine Information Infrastructure" >eMII</a>
      <a class="external mainlinks" target="_blank"href="http://www.imos.org.au"  
         title="Integrated Marine Observing System" >IMOS</a>
      <a  title="IMOS Ocean Portal Help files" >Help</a>
    </div>
    <div id="downloadCart">
      Download cart: <b><span id="downloadCartSize">0</span></b> item(s)<br/><div id="downloadCartControls"><g:link controller="download" action="downloadFromCart" class="mainlinks">Download</g:link> | <a href="javascript:clearDownloadCart();">clear cart</a></div>
    </div>
  </div>

<div id="headerTail" >&nbsp;</div>
