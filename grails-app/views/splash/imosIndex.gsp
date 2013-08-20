
<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<div class="p-centre">
  <div class="p-centre-item" style="width:560px">

    <h1>Welcome to the IMOS Ocean Portal</h1>

    <p class="spacer">This portal is the primary access point for search, discovery, access and download of data collected by the Integrated Marine Observing System (IMOS), an Australian Government Research Infrastructure project. You can obtain full information about IMOS via the <a class="external" title="IMOS home page" href="http://www.imos.org.au" target="_blank">IMOS Webpage</a>. IMOS is a contributor to the Australian Ocean Data Network (AODN). Please see the web site for information on the AODN and how you and your institution can <a class="external" href="${ grailsApplication.config.help.url }?q=node/142" target="_blank">contribute data</a>.</p>

    <g:render template='navigationSnippet' />

	<div class="clear spacer"></div>

    <g:render template='oceanCurrent' />

    <div class="clear"></div>
    <div >There is a technical summary for those interested in the <a class="external" href="${ grailsApplication.config.help.url }?q=node/99" title="technical summary" target="_blank">information infrastructure</a> behind this portal.
    </div>


    <div class="spacer clear footer">
      <div class="spacer floatLeft homePanelWidget"  style="width:100px">
        <img class="minispacer" src="images/DIISRTE-stacked-2012.png" alt="DIISTRE logo"/>
        <img class="minispacer" src="images/Utas_vert.png" alt="UTAS logo"/>
      </div>
      <div class="spacer floatLeft homePanelWidget"  style="width:420px">
        ${ cfg.footerContent }
      </div>
    </div>
    <div class="clear footer"> ${ portalBuildInfo }</div>

  </div>

</div>
