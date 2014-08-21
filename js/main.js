require([
  "esri/map",
  "esri/dijit/LayerSwipe",
  "esri/arcgis/utils",
  "dojo/_base/array",
  "esri/layers/layer",
  "dojo/domReady!"
], function (Map, LayerSwipe, arcgisUtils, array, Layer) {

  //First string is the map ID from arcGIS online
  var mapDeferred = arcgisUtils.createMap("c5658cd5b8f6469fbfe9af4e678a3169", "map");
  mapDeferred.then(function(response) {
    
    //initailizes the layer used in the scope widget. first controls whether the app is on its first go or not. var will equal 0 i
    var initScope = function(lName,first) {
      var id,
          map = response.map,
          title = lName;
      
      //loop through all the operational layers in the web map 
      //to find the one with the specified title;
      var layers = response.itemInfo.itemData.operationalLayers;
      var layerIDs = [];
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
        var swipeLayer = map.getLayer(id);
        for (var i=0; i<layerIDs.length; i++) {
          var tempLayer = map.getLayer(layerIDs[i]);
          if (tempLayer != swipeLayer) {
            tempLayer.hide();
          }
        }
        
        if(first) {
          var swipeWidget = new LayerSwipe({
            type: "scope",  //Try switching to "scope" or "horizontal"
            map: map,
            layers: [swipeLayer]
          }, "swipeDiv");
          swipeWidget.startup();

        } else {
          swipeWidget.destroy();
          swipeWidget = null;
          swipeWidget = new LayerSwipe({
            type: "scope",  //Try switching to "scope" or "horizontal"
            map: map,
            layers: [swipeLayer]
          }, "swipeDiv");
          swipeWidget.startup();
        }
      }

    };
    //Sets the initial scope to be for 2012 imagery. base map imagery is 2014. 
    initScope('IMG_2012_C',1);
   

    $(document).ready(function() {
      $('#brad').on('click', function() {
        initScope('IMG_1930_BW',0);
      });
    });

  });
 
});
