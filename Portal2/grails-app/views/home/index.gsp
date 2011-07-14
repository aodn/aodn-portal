<html>

<head>

<!-- First import JQUERY -->  
<script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery-1.4.1.min.js')}"></script>
<!-- Import extra pluggins-->
<script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery-autocomplete1.1.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery.rotate.1-1.js')}"></script>

<!-- ExtJS JQUERY adapter-->
<script src="${resource(dir:'js',file:'ext-3.3.1/adapter/jquery/ext-jquery-adapter.js')}" defer="defer"  type="text/javascript"></script>


<!-- ExJS-->
<script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'ext-3.3.1/ext-all.js')}" defer="defer"   type="text/javascript"></script>
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'ext-3.3.1/resources/css/ext-all.css')}" />
<link rel="stylesheet" type="text/css" href="${resource(dir:'js',file:'ext-3.3.1/resources/css/xtheme-gray.css')}" />


<!-- Open Layers-->
<script src="${resource(dir:'js',file:'OpenLayers-2.10/OpenLayers.js')}" defer="defer" type="text/javascript"></script>
<link rel="stylesheet" media="screen" type="text/css"  href="${resource(dir:'css',file:'map.css')}" />
<link rel="stylesheet" media="print" type="text/css"  href="${resource(dir:'css',file:'mapprint.css')}" />

<!--- GeoExt (Has to be after Openlayers and ExJS) -->
<script src="${resource(dir:'js',file:'GeoExt/script/GeoExt.js')}" defer="defer"  type="text/javascript"></script>
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'GeoExt/resources/css/geoext-all-debug.css')}" />


<!-- Portal clases-->
<script src="${resource(dir:'js',file:'portal/map.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/components/MainMapPanel.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/viewport.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ramadda.js')}" defer="defer"  type="text/javascript"></script>


<link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />

<title> Portal 2.0</title>

<style>
  .x-tree-node-icon { display: none !important; }


    /* Line styles 
    .x-tree-lines .x-tree-elbow{
        background-image:url(../images/default/tree/elbow.gif);
    }
     .x-tree-lines .x-tree-elbow-end{
        background-image:url(../images/default/tree/elbow-end.gif);
    }
     .x-tree-lines .x-tree-elbow-line{
        background-image:url(../images/default/tree/elbow-line.gif);
    }
    */
    .x-tree-lines .x-tree-elbow-plus{
        background-image:url(${resource(dir:'img/icons/',file:'treePlus.png')});
    }
    .x-tree-lines .x-tree-elbow-minus{
        background-image:url(${resource(dir:'img/icons/',file:'treeMinus.png')});
    }
   
    .x-tree-lines .x-tree-elbow-end-plus{
        background-image:url(${resource(dir:'img/icons/',file:'treePlus.png')});
    }
    .x-tree-lines .x-tree-elbow-end-minus{
        background-image:url(${resource(dir:'img/icons/',file:'treeMinus.png')});
    }
   



</style>

</head>

<body>
    <div id="blah"></div>
</body>

</html>
