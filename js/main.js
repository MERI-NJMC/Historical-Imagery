require([
  "esri/map",
  "esri/dijit/LayerSwipe",
  "esri/arcgis/utils",
  "dojo/_base/array",
  "dojo/domReady!"
], function (Map, LayerSwipe, arcgisUtils, array) {

  //First string is the map ID from arcGIS online
  var mapDeferred = arcgisUtils.createMap("c5658cd5b8f6469fbfe9af4e678a3169", "map");
  mapDeferred.then(function(response) {

    var id,
        map = response.map,
        title = "IMG_2002_C";
    
    //loop through all the operational layers in the web map 
    //to find the one with the specified title;
    var layers = response.itemInfo.itemData.operationalLayers;
    array.some(layers, function(layer) {
      if (layer.title === title) {
        id = layer.id;
        if(layer.featureCollection && layer.featureCollection.layers.length) {
          id = layer.featureCollection.layers[0].id;
        }
        return true;
      } else {
        return false;
      }
    });
    
    //get the layer from the map using the id and set it as the swipe layer. 
    if (id) {
      var swipeLayer = map.getLayer(id);
      var swipeWidget = new LayerSwipe({
        type: "scope",  //Try switching to "scope" or "horizontal"
        map: map,
        layers: [swipeLayer]
      }, "swipeDiv");
      swipeWidget.startup();
    }
  });

});