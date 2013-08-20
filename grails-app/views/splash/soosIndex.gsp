
<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
  <div class="p-centre-item" style="width:520px">

    <g:render template='soosIntroduction' />

    <g:render template='navigationSnippet' />

    <div class="clear spacer"></div>

    <p>The sea-ice around Antarctica is dynamic and ever-changing, to view the latest state of the Antarctic sea-ice go to the Centre
    for Australian Weather and Climate Research (CAWCR)
    <a href="http://www.cawcr.gov.au/staff/preid/seaice/gsfc_daily_maps.html" target="_blank" class="external wrap">sea-ice concentration and extents page</a>.</p>




    <div class="clear footer">

      <div class="spacer floatLeft homePanelWidget" style="width:100px">
        <img class="minispacer" src="images/soos/baselogo-dark.png" alt="SOOS Logo" /><BR>
        <a href="http://imos.org.au/"><img src="images/soos/IMOSLogo.png"  class="minispacer"  alt="IMOS Logo" /></a>
      </div>

      <div class="spacer floatLeft homePanelWidget" style="width:370px">
        <p>Copyright 2012
        <BR>Southern Ocean Observing System.
        <br>All rights reserved.</p>
        <div id="note">
          <p>The SOOS Portal is hosted by IMOS on behalf of the Southern Ocean Observing System (SOOS).</p>


          <div class="footer"> ${ portalBuildInfo }</div>
        </div>
      </div>



      ${ cfg.footerContent } </div>

    </div>
  </div>
