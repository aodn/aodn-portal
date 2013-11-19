
<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
  <div class="p-centre-item" style="width:560px">

    <g:render template='waodnIntroduction' />

    <div class="clear spacer"></div>

    <g:render template='oceanCurrent' />

    <div class="clear spacer">
      <h3>Want to see data for all Australasia?</h3>
      <p><a href="http://portal.aodn.org.au/" title="Australian Ocean Data Network" >Main AODN portal</a>.</p>
    </div>

    <div class="clear"></div>
    <div class="spacer clear footer">
      <div class="spacer floatLeft homePanelWidget"  style="width:110px">
        <img class="minispacer" src="http://static.emii.org.au/images/logo/NCRIS_Initiative_stacked110.png" alt="DIISTRE logo"/>
      </div>
      <div class="spacer floatLeft homePanelWidget"  style="width:360px">
        ${ cfg.footerContent }
      </div>
    </div>
    <div class="clear footer"> ${ portalBuildInfo }</div>
  </div>
</div>
