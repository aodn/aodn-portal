<%--

Copyright 2013 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<h2>Latest Ocean Currents and Temperature Graphs</h2>
<div class="minispacer floatLeft homePanelWidget"  style="width:230px">

  <a class="imageLabel" title="Latest 'OceanCurrent' graph for the randomly chosen region" href="${oceanCurrent.baseURL}${oceanCurrent.acron}${oceanCurrent.parentPage}"  target="_blank" >
    <img class="roundedImages" src="${oceanCurrent.imageURL}" width="230"> ${oceanCurrent.speil}</img>
  </a>
  <br/>
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
