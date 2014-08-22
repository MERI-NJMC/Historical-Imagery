require([
  "esri/map",
  "esri/dijit/LayerSwipe",
  "esri/arcgis/utils",
  "dojo/_base/array",
  "esri/layers/layer",
  "dojo/on",
  "dojo/dom",
  "dojo/query",
  "dojo/dom-style",
  "dijit/_WidgetBase",
  "dojo/domReady!"
], function (Map, LayerSwipe, arcgisUtils, array, Layer, on, dom, query, domStyle,_WidgetBase) {

  var swipeWidget;

  //First string is the map ID from arcGIS online
  var mapDeferred = arcgisUtils.createMap("c5658cd5b8f6469fbfe9af4e678a3169", "map");
  mapDeferred.then(function(response) {
    

      var id,
          map = response.map,
          layers = response.itemInfo.itemData.operationalLayers,
          layerIDs = [],
          swipeLayer,
          tempLayer;
      //loop through all the operational layers in the web map 
      //to find the one with the specified title;
      
      setScope('IMG_2012_C');
      function setScope(title){
        layerIDs = [];
        array.some(layers, function(layer) {
              layerIDs.push(layer.id);
              if (layer.title === title) {
                id = layer.id;
                if(layer.featureCollection && layer.featureCollection.layers.length) {
                  id = layer.featureCollection.layers[0].id;
                }
              } else {
      
                return false;
      
              }
            });
            
            if (id) {
              swipeLayer = map.getLayer(id);
              for (var i=0; i<layerIDs.length; i++) {
                tempLayer = map.getLayer(layerIDs[i]);
                if (tempLayer != swipeLayer) {
                  tempLayer.hide();
                } else {
                  tempLayer.show();
                }
              }
          }
        
        
        var swipeWidget = new LayerSwipe({
            type: "scope",  //Try switching to "scope" or "horizontal"
            map: map,
            layers: layerIDs
          }, "swipeDiv");
        swipeWidget.startup();
        console.log(swipeWidget);
        
      }



  
    $(document).ready(function() {
      $('#layerSelect').on('change', function() {
        setScope(this.value);
      });
    });

  });
 
});
