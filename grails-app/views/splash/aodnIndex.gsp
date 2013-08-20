
<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
  <div class="p-centre-item" style="width:520px">
	<h1>Welcome to the Australian Ocean Data Network</h1>

	<p>This portal is the primary access point for search, discovery, access and download of data collected by the Australian marine community. Primary datasets are contributed by the <a  target="_blank" class="external"  title="IMOS home page" href="http://www.imos.org.au" >Integrated Marine Observing System (IMOS)</a> an Australian Government Research Infrastructure project, and the six Commonwealth Agencies with responsibilities in the Australian marine jurisdiction (Australian Antarctic Division, Australian Institute for Marine Science, Bureau of Meteorology, Commonwealth Science and Industrial Research Organisation, Geoscience Australia and the Royal Australian Navy). You can obtain full information about the AODN via the <a title="AODN home page" class="external" target="_blank"  href="http://www.imos.org.au/aodn.html" >AODN Webpage</a>.</p>

	<h3>Want to contribute data to the AODN?</h3>
	<p>Please see the web site for information on the AODN and how you and your institution can <a class="external" target="_blank" href="${ grailsApplication.config.help.url }?q=node/142" title="Contribute data" >contribute data</a>.</p>

	<h3>The portal provides two ways of discovering data:</h3>

	<div class="floatLeft">Either through our <a href="" onClick="setViewPortTab(TAB_INDEX_MAP); return false;" >map</a> interface,<BR>or by searching our <a href="" onClick="setViewPortTab(TAB_INDEX_SEARCH); return false;" >metadata catalogue</a>.</div>

    <g:render template='navigationSnippet' />

    <div class="clear spacer"></div>
    <div class="">
      <h3>Want to see data in your region?</h3>
      <p><img src="images/WAODN_logoPortal2Small.png" class="WAMiniLogo" alt="Western Australian AODN logo" /> <a  href="http://wa.aodn.org.au/" title="Western Australian Ocean Data Network" >Western Australia</a>.</p>
    </div>

    <h2>Latest Ocean Currents and Temperature Graphs</h2>
	<div class="minispacer floatLeft homePanelWidget"  style="width:230px">

	  <a class="imageLabel" title="Latest 'OceanCurrent' graph for the randomly chosen region" href="${oceanCurrent.baseURL}${oceanCurrent.acron}${oceanCurrent.parentPage}"  target="_blank" ><img class="roundedImages" src="${oceanCurrent.imageURL}" width="230" /> ${oceanCurrent.speil}</a>
	  <BR>
	  </div>
	  <div class="minispacer floatLeft homePanelWidget"  style="width:250px">
	    The oceans around Australia are dynamic and ever-changing, to view the latest state of Australian oceans and coastal seas,
	    go to our <a class="external" title="Ocean Current page"  href="${oceanCurrent.baseURL}" target="_blank"><NOBR>Ocean Current</NOBR></a> page.


	    <div class="spacer"></div>
	    <h3>Also please see our forum:</h3>
	    <ul>
          <li><a class="external" href="${ grailsApplication.config.help.url }?q=forum/7" title="Frequently Asked Questions" target="_blank">Frequently Asked Questions</a></li>
          <li><a class="external" href="${ grailsApplication.config.help.url }?q=forum/11" title="forum" target="_blank">Newest Portal Features</a></li>
          <li><a class="external" href="${ grailsApplication.config.help.url }?q=node/95" title="map navigation help forum" target="_blank">Navigating the map</a></li>
          <li><a class="external" href="${ grailsApplication.config.help.url }?q=node/108" title="search help forum" target="_blank">Searching for data</a></li>
          <li><a class="external" href="${ grailsApplication.config.help.url }" title="forum" target="_blank">Help forum</a></li>
	    </ul>
	  </div>


      <div class="clear spacer"></div>
      <div >There is a technical summary for those interested in the <a class="external" href="${ grailsApplication.config.help.url }?q=node/99" title="technical summary" target="_blank">information infrastructure</a> behind this portal.
      </div>

      <div class="clear spacer"></div>
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
