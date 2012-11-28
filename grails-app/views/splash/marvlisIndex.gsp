
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>


<div class="p-centre">
	<div class="p-centre-item" style="width:560px">


	<h1>Welcome to the Marine Virtual Laboratory Information System Portal</h1>

	<p>The MARVLIS portal delivers products that are tailored to support the management and assessment in the marine environment of a) public health (beach safety and shellfish toxicity) and b) ecosystem health (long-term environmental assessment and consequences of aquaculture management options. </p>

	<h3>The portal provides two ways of discovering data:</h3>

	<div class="floatLeft">Either through our <a href="" onClick="setViewPortTab(1);return false;" >map</a> interface,<BR>or by searching our <a href="" onClick="setViewPortTab(2);return false;" >metadata catalogue.</a></div>

	<div id="viewPortHomepageLinks" class="floatLeft">
	  <div  class="viewPortLinksBackground viewPortLinks"><a onclick="setViewPortTab(1);return false;" href="">Map</a></div>
	  <div  class="viewPortLinksBackground viewPortLinks"><a onclick="setViewPortTab(2);return false;" href="">Search</a></div>
	</div>

	  <div class="clear spacer"></div>


	<div class="spacer floatLeft homePanelWidget"  style="width:450px">
	MARVLIS is funded by the Australian National Data Service
	<a class="external" title="ANDS"  href="http://ands.org.au/" target="_blank"><img width="80" src="images/ands-logo-hi-res.jpg"/></a>
	</div>

    <div class="clear spacer">
        <h3>Want to see data for all Australasia?</h3>
        <p><a href="http://portal.aodn.org.au/webportal" title="Australian Ocean Data Network" >AODN portal</a>.</p>
    </div>

	  <div class="clear"></div>
  </div>
</div>
<div class="footer">
    <div style="float: left;">
        <img src="images/DIISRTE_Inline-PNGSmall_200h.png" alt="DIISTRE logo"/>
    </div>
    <div class="footerText">
        ${ cfg.footerContent }
        ${ portalBuildInfo }
    </div>
</div>
