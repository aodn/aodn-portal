
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
	<div class="p-centre-item" style="width:560px">


	<h1>Welcome to the Western Australian Ocean Data Network</h1>

	<p>This portal is the primary access point for search, discovery, access and download of data for Western Australia collected by the Australian marine community. These data are presented as a regional view of all the data available from the <a  target="_blank" class="external"  title="Main AODN Portal" href="http://portal.aodn.org.au/webportal/" >Australian Ocean Data Network</a>.
Primary datasets are contributed by Commonwealth Government agencies, State Government agencies, Universities, the <a  target="_blank" class="external"  title="IMOS home page" href="http://www.imos.org.au" >Integrated Marine Observing System (IMOS)</a> an Australian Government Research Infrastructure project, and WAMSI (Western Australia Marine Science Institute).</p>

	<h3>Want to contribute data to the AODN?</h3>
	<p>Please see the web site for information on the AODN and how you and your institution can <a class="external" target="_blank" href="${ grailsApplication.config.help.url }?q=node/142" title="Contribute data" >contribute data</a>.</p>

	<h3>The portal provides two ways of discovering data:</h3>

	<div class="floatLeft">Either through our <a href="" onClick="setViewPortTab(MAP_TAB); return false;" >map</a> interface,<BR>or by searching our <a href="" onClick="setViewPortTab(SEARCH_TAB); return false;" >metadata catalogue</a>.</div>

	<div id="viewPortHomepageLinks" class="floatLeft">
	  <div class="viewPortLinksBackground viewPortLinks"><a onclick="setViewPortTab(MAP_TAB); return false;" href="">Map</a></div>
	  <div class="viewPortLinksBackground viewPortLinks"><a onclick="setViewPortTab(SEARCH_TAB); return false;" href="">Search</a></div>
	</div>

	  <div class="clear spacer"></div>


	<div class="spacer floatLeft homePanelWidget"  style="width:230px">
	  <a class="imageLabel" title="Latest 'OceanCurrent' graph for the randomly chosen region" href="${oceanCurrent.baseURL}${oceanCurrent.acron}${oceanCurrent.parentPage}"  target="_blank" ><img class="roundedImages" src="${oceanCurrent.imageURL}" width="230" />${oceanCurrent.speil}</a>
	  <BR>
	  </div>

	<div class="spacer floatLeft homePanelWidget"  style="width:250px">
	The oceans around Australia are dynamic and ever-changing, to view the latest state of Australian oceans and coastal seas,
	go to our <a class="external" title="Ocean Current page"  href="${oceanCurrent.baseURL}" target="_blank"><NOBR>Ocean Current</NOBR></a> page.


	<div class="spacer"></div>
	<h4>Also please see our forum:</h4>
	<ul>
        <li><a class="external" href="${ grailsApplication.config.help.url }?q=forum/7" title="Frequently Asked Questions" target="_blank">Frequently Asked Questions</a></li>
        <li><a class="external" href="${ grailsApplication.config.help.url }?q=forum/11" title="forum" target="_blank">Newest Portal Features</a></li>
        <li><a class="external" href="${ grailsApplication.config.help.url }?q=node/95" title="map navigation help forum" target="_blank">Navigating the map</a></li>
        <li><a class="external" href="${ grailsApplication.config.help.url }?q=node/108" title="search help forum" target="_blank">Searching for data</a></li>
        <li><a class="external" href="${ grailsApplication.config.help.url }" title="forum" target="_blank">Help forum</a></li>
	</ul>
	</div>

    <div class="clear spacer">
      <h3>Want to see data for all Australasia?</h3>
      <p><a href="http://portal.aodn.org.au/webportal" title="Australian Ocean Data Network" >Main AODN portal</a>.</p>
    </div>

    <div class="clear"></div>
    <div class="spacer clear footer">
        <div class="spacer floatLeft homePanelWidget"  style="width:100px">
            <img class="minispacer" src="images/DIISRTE-stacked-2012.png" alt="DIISTRE logo"/>
        </div>
        <div class="spacer floatLeft homePanelWidget"  style="width:370px">
            ${ cfg.footerContent }
        </div>
    </div>
    <div class="clear footer"> ${ portalBuildInfo }</div>
  </div>
</div>
