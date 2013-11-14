
<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<div class="p-centre">
  <div class="p-centre-item" style="width:560px">

    <g:render template='imosIntroduction' />

    <div class="clear spacer"></div>

    <g:render template='oceanCurrent' />

    <div class="clear"></div>
    <div >There is a technical summary for those interested in the <a class="external" href="${ grailsApplication.config.help.url }?q=node/99" title="technical summary" target="_blank">information infrastructure</a> behind this portal.
    </div>


    <div class="spacer clear footer">
      <div class="spacer floatLeft homePanelWidget"  style="width:100px">
        <img class="minispacer" src="http://static.emii.org.au/images/logo/NCRIS_Initiative_stacked110.png" alt="DIISTRE logo"/>
        <img class="minispacer" src="http://static.emii.org.au/images/logo/Utas_vert.png" alt="UTAS logo" height="50" />
      </div>
      <div class="spacer floatLeft homePanelWidget"  style="width:420px">
        ${ cfg.footerContent }
      </div>
    </div>
    <div class="clear footer"> ${ portalBuildInfo }</div>

  </div>

</div>
