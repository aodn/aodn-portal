
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
	<div class="p-centre-item" style="width:520px">
	<h1>Welcome to the SOOS Data Network</h1>

   <p>This Portal is the primary access point for search, discovery, mapping and download of data
   that has been determined to be of significance to the <a href="http://www.soos.aq/" target="_blank" class="external wrap" >Southern Ocean Observing System (SOOS)</a>.
   As existing data of relevance are detected by SOOS participants they will be made discoverable via this Portal.
   All new data generated directly as a result of SOOS-related activities will be published via this site.</p>
   <p>This SOOS Portal is a data aggregating service and as such many of the datasets discoverable via this
   interface may also be available from dedicated web sites operated by SOOS <a href="http://www.soos.aq/index.php/about-us/sponsors" target="_blank" class="external wrap">sponsors</a>,
       <a href="http://www.soos.aq/index.php/links" target="_blank" class="external wrap" >communities</a> and existing,
       <a href="http://www.soos.aq/index.php/science/themes" target="_blank" class="external wrap" >'theme-specific'</a> data networks. The 'points of truth' for all such data are listed in the metadata for each discovered dataset.</p>

   <h3>The portal provides two ways of discovering data:</h3>
        <p>Either through our <a onclick="setViewPortTab(1);return false;" href="">map</a> interface or by searching our <a onclick="setViewPortTab(2);return false;" href="">metadata catalogue</a>.
        </p>


   <h3>Want to contribute data to the SOOS Data Portal?</h3>
        <p>Please see how to <a href="http://www.soos.aq/index.php/data" target="_blank" class="external wrap" >contribute data</a> to the SOOS Portal</p>


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
