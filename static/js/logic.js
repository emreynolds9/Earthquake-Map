function getColor(mag) {
  return mag > 6 ? '#DC3618' :
         mag > 5  ? '#DB812A' :
         mag > 4  ? '#DBC03C' :
         mag > 3  ? '#c3db4f' :
         mag > 2   ? '#9dda61' :
         mag > 1   ? '#84da73' :
                    '#86DA95';}

// Store our API endpoint inside queryUrl
var quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function getData(url1, url2){

// Perform a GET request to the query URL
d3.json(url1, function(data1) {
  // Once we get a response, send the data.features object to the createFeatures function
    d3.json(url2, function(data2) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data2)
        createFeatures(data1.features,data2.features);
  });
});
}

console.log(getData(quakesURL,platesURL))

function createFeatures(earthquakeData,platesData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachCircle(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  function onEachLine(feature, layer) {
    layer.bindPopup("<h3>Plate Name: " + feature.properties.Name +
      "</h3>")
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachCircle,
    pointToLayer: function (feature) {
      return L.circle(feature.geometry.coordinates, 
        {color: "black",
        weight: 1,
          fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.8,
        radius: feature.properties.mag*10000}
        );
  }})

  var plates = L.geoJSON(platesData,
    {color: "green",
    onEachFeature: onEachLine}
  )
  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, plates);
}

function createMap(earthquakes, plates) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": plates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, 0
    ],
    zoom: 2,
    layers: [streetmap, plates, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,1,2,3,4,5,6],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
}


