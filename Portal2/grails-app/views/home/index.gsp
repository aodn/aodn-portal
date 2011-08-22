<html>

<head>


<!--- common styles and JavaScript for the map page and Grails admin pages -->
 <g:render template="/common_includes"></g:render>
 
 <!-- Open Layers-->
<script src="${resource(dir:'js',file:'OpenLayers-2.10/OpenLayers.js')}" defer="defer" type="text/javascript"></script>
<link rel="stylesheet" media="screen" type="text/css"  href="${resource(dir:'css',file:'map.css')}" />
<link rel="stylesheet" media="print" type="text/css"  href="${resource(dir:'css',file:'mapprint.css')}" />
 
 <!--- GeoExt (Has to be after Openlayers and ExJS) -->
<script src="${resource(dir:'js',file:'GeoExt/script/GeoExt.js')}" defer="defer"  type="text/javascript"></script>
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'GeoExt/resources/css/geoext-all.css')}" />


<!-- Portal clases-->
<script src="${resource(dir:'js',file:'portal/map.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/components/mainMapPanel.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/components/menuPanel.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/components/detailsPanel.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/viewport.js')}" defer="defer"  type="text/javascript"></script>

<script src="${resource(dir:'js',file:'portal/ramadda.js')}"  type="text/javascript"></script>

<link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />


<title>${configInstance?.name}</title>

<style>
  


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
