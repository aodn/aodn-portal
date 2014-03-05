<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<!-- First import JQUERY -->
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-1.4.1.min.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/portal', file: 'jquery.js')}"></script>
<!-- Import extra pluggins-->
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-autocomplete1.1.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery.rotate.1-1.js')}"></script>

<script type="text/javascript" src="${resource(dir: 'js/log4javascript-1.4.6', file: 'log4javascript_uncompressed.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'Logging.js')}"></script>

<script src="${resource(dir: 'js/portal/common', file: 'helpers.js')}" type="text/javascript"></script>


<g:if env="development">
    <script src="${resource(dir: 'js/ext-3.3.1/adapter/ext', file: 'ext-base-debug.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/ext-3.3.1', file: 'ext-all-debug.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/OpenLayers-2.10', file: 'OpenLayers.js')}" type="text/javascript"></script>
    <!--- GeoExt (Has to be after Openlayers and ExJS) -->
    <script src="${resource(dir: 'js/GeoExt1.1/lib', file: 'GeoExt.js')}" type="text/javascript"></script>
</g:if>
<g:else>
    <script src="${resource(dir: 'js/ext-3.3.1/adapter/ext', file: 'ext-base.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/ext-3.3.1', file: 'ext-all.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/OpenLayers-2.10', file: 'OpenLayers.js')}" type="text/javascript"></script>
    <!--- GeoExt (Has to be after Openlayers and ExJS) -->
    <script src="${resource(dir: 'js/GeoExt1.1/script', file: 'GeoExt.js')}" type="text/javascript"></script>
</g:else>

<!-- GeoNetwork - required classes only -->
<script src="${resource(dir: 'js/Geonetwork/lib/OpenLayers/addins/Format', file: 'GeoNetworkRecords.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork', file: 'Util.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork/lang', file: 'en.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork', file: 'Catalogue.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork/util', file: 'SearchTools.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork/data', file: 'OpenSearchSuggestionReader.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork/data', file: 'OpenSearchSuggestionStore.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork/map', file: 'ExtentMap.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/Geonetwork/lib/GeoNetwork/map/Ext.ux/form', file: 'DateTime.js')}" type="text/javascript"></script>

<script src="${resource(dir: 'js/ext-ux/SuperBoxSelect', file: 'SuperBoxSelect.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/ext-ux/Hyperlink', file: 'Hyperlink.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/ext-ux/util', file: 'MessageBus.js')}" type="text/javascript"></script>

    <r:require modules="common"/>
