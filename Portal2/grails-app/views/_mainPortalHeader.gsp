  <div id="header" style="height:${configInstance?.headerHeight}px">
    <img src="${resource(dir:'images',file:'AODN_logo.png')}" alt="AODN Logo" id="logo" />
    <h1 id="headerTitle">${configInstance?.name}</h1>
    <g:if test="${showLinks}">
    <div id="viewPortLinks" >
      <div class="viewPortLinksBackground" id="viewPortTab0"><a href="" onClick="setViewPortTab(0);return false;" >Home</a></div>
      <div class="viewPortLinksBackground" id="viewPortTab1"><a href="" onClick="setViewPortTab(1);return false;" >Map</a></div>
      <div class="viewPortLinksBackground" id="viewPortTab2"><a href="" onClick="setViewPortTab(2);return false;" >Search</a></div>
    </div>
    </g:if>
    
    <div id="toplinks" >
      <shiro:user>
          <g:link controller="auth" action="signOut">Log out</g:link>
      </shiro:user>
      <a class="external mainlinks" target="_blank" href="http://www.emii.org.au" title="e-Marine Information Infrastructure">eMII</a>
      <a class="external mainlinks" target="_blank" href="http://imos.org.au/aodn.html" title="Australian Ocean Data Network">IMOS</a>
      <a class="mainlinks" href="http://emii1.its.utas.edu.au/Portal2_help/" title="Portal Help files">Help</a>
    </div>
    <div id="downloadCart" class="emptyCart">
      Download cart: <strong><span id="downloadCartSize">0</span></strong> item(s)<br/><div id="downloadCartControls"><g:link controller="download" action="downloadFromCart" >download</g:link> | <a href="javascript:clearDownloadCart();">clear cart</a></div>
    </div>
  </div>
<div id="headerTail" >&nbsp;</div>