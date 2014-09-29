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
  "esri/dijit/LocateButton", 
  "esri/dijit/Geocoder",
  "esri/graphic", 
  "esri/symbols/SimpleMarkerSymbol",
  "esri/geometry/screenUtils",
  "dojo/_base/Color",
  "dojo/domReady!"
], function (Map,LayerSwipe, arcgisUtils, array, Layer, on, dom, query, domStyle,_WidgetBase,LocateButton,Geocoder, Graphic, SimpleMarkerSymbol, screenUtils, Color) {

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
        
        
        //layer wipe widget
        var swipeWidget = new LayerSwipe({
            type: "scope",  //Try switching to "scope" or "horizontal"
            map: map,
            layers: layerIDs
          }, "swipeDiv");
        swipeWidget.startup();
        console.log(swipeWidget);

        //toggles the view of the comparison on toolbar button click.
        on(dom.byId('scopeSelect'), 'change', function(evt) {
          if(evt.srcElement.value == 'Slider') {
            swipeWidget.set("type","vertical");
          } else {
            swipeWidget.set("type","scope");
          }
          
        });

        //geolacte gos button
        var geoLocate = new LocateButton({
          map: map,
        }, "LocateButton");
        
        //search box
        var geocoder = new Geocoder({
          arcgisGeocoder: {
            placeholder: "Type Street Address",
            sourceCountry: "USA"
          },
          map: map,
          autoComplete: true,
            }, "search");
        //triggers show location when a address is searched
        geocoder.on("select", showLocation);

        //puts a marker on the address searched for
        function showLocation(evt) {
          map.graphics.clear();
          var point = evt.result.feature.geometry;
          var symbol = new SimpleMarkerSymbol()
          .setStyle("square")
          .setColor(new Color([255,0,0,0.5]));
          var graphic = new Graphic(point, symbol);
          map.graphics.add(graphic);
        }
        
      }



  
    $(document).ready(function() {
      
      //calls the setscope function to change the scope or swipers layer
      $('#layerSelect').on('change', function() {
        setScope(this.value);
      });

      //when the zoom slider loads it sets its z-index to 0
      $('#map_zoom_slider').ready(function () {
        $('#map_zoom_slider').css("z-index",0);
      });

    });

  });
 
});
