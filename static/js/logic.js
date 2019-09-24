  // Define streetmap and darkmap layers
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });



  var myMap = L.map("map", {
    center: [37.09, 0],
    zoom: 2,
    layers: [darkmap, streetmap]});

darkmap.addTo(myMap);

var plates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

  // Define a baseMaps object to hold our base layers
  var baseMaps = {

        "Street Map": streetmap,
        "Dark Map": darkmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": plates
  };

L
  .control
  .layers(baseMaps, overlayMaps, {collapsed: false})
  .addTo(myMap);



function getColor(mag) {
      switch (true) {
    case mag > 5:
      return "#ea2c2c";
    case mag > 4:
      return "#ea822c";
    case mag > 3:
      return "#ee9c00";
    case mag > 2:
      return "#eecc00";
    case mag > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
}

// Store our API endpoint inside queryUrl
var quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Our AJAX call retrieves our earthquake geoJSON data.
d3.json(quakesURL, function(data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of
    // the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
    // We add the data to the earthquake layer instead of directly to the map.
  }).addTo(earthquakes);

  // Then we add the earthquake layer to our map.
  earthquakes.addTo(myMap);

  // Here we create a legend control object.
  var legend = L.control({
    position: "bottomright"
  });

  // Then we add all the details for our legend
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6],
      labels = ['<strong>MAGNITUDE</strong>'],
      from, to;

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<i style="background:' + getColor(from + 1) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };

  // We add our legend to the map.
  legend.addTo(myMap);

  // Here we make an AJAX call to get our Tectonic Plate geoJSON data.
  d3.json(platesURL,
    function(platedata) {
      // Adding our geoJSON data, along with style information, to the tectonicplates
      // layer.
      L.geoJson(platedata, {
        color: "purple",
        weight: 2
      })
      .addTo(plates);

      // Then add the tectonicplates layer to the map.
      plates.addTo(myMap);
    });
});
