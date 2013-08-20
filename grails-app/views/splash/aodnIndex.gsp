
<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
  <div class="p-centre-item" style="width:520px">

    <g:render template='aodnIntroduction' />

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
