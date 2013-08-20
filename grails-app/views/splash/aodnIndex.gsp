
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

    <g:render template='navigationSnippet' />

    <div class="clear spacer"></div>

    <div class="">
      <h3>Want to see data in your region?</h3>
      <p><img src="images/WAODN_logoPortal2Small.png" class="WAMiniLogo" alt="Western Australian AODN logo" /> <a  href="http://wa.aodn.org.au/" title="Western Australian Ocean Data Network" >Western Australia</a>.</p>
    </div>

    <g:render template='oceanCurrent' />

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
