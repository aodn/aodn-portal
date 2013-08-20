
<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
  <div class="p-centre-item" style="width:560px">

    <g:render template='waodnIntroduction' />
    <g:render template='navigationSnippet' />

	<div class="clear spacer"></div>

    <g:render template='oceanCurrent' />

    <div class="clear spacer">
      <h3>Want to see data for all Australasia?</h3>
      <p><a href="http://portal.aodn.org.au/" title="Australian Ocean Data Network" >Main AODN portal</a>.</p>
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
