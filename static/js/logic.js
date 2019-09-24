// Define basemap layers
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
  layers: [darkmap, streetmap]
});

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

//Create controls so we can toggle our baseMaps and overlays
L
  .control
  .layers(baseMaps, overlayMaps, { collapsed: false })
  .addTo(myMap);

// This function assigns a color based on the magnitude of each earthquake
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

var quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// updateMap(quakesURL)
var text;
var dropdown = document.getElementById("time-range");

dropdown.addEventListener("change", function () {
  text = dropdown.value;

  if (text == "week") {
    quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  }
  else if (text == "day") {
    quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  }
  else quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
  console.log(quakesURL)

  earthquakes.clearLayers();


  updateMap(quakesURL)
})

  // This function calculates a radius based of each earthquake's magnitude, which we will use
  // for the size of each circle marker.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 0.5;
    }
    return magnitude * 4;
  }

  // Store our API endpoints
  var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

  function updateMap(quakesURL) {
    // Retrieve earthquake geoJSON data from API.
    d3.json(quakesURL, function (data) {

      // Configure GeoJSON layer for earthquakes
      L.geoJson(data, {
        // Pass each coordinate through earthquakes layer.
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },
        // Style each point (now a circle) in our layer using the color and radius functions
        style: function styleInfo(feature) {
          return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
          };
        },
        //add pop-up for each earthquake
        onEachFeature: function (feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag +  "<br>Location: " +
          feature.properties.place +
          "<br>Time: " + Date(feature.properties.time) + "</br>");
          console.log(Date(feature.properties.time))
        }
        // add the data to the earth quake layer
      }).addTo(earthquakes);

      // add the layer to the map. This way we can use the control to toggle it on and off
      earthquakes.addTo(myMap);


      // Rinse and repeat for tectonic plates, which are much simpler than earthquakes
      d3.json(platesURL,
        function (platedata) {
          // Adding our geoJSON data, along with style information, to the tectonicplates
          // layer.
          L.geoJson(platedata, {
            color: "purple",
            weight: 3,
            onEachFeature: function (feature, layer) {
              layer.bindPopup("Plate Boundary: " + feature.properties.Name);
            }
          })

            .addTo(plates);

          // add plates layer to the map.
          plates.addTo(myMap);
        });
    })
  }
  // Add legend
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6],
      labels = ['<strong>MAGNITUDE</strong>'],
      from, to;

    // loop through our intervals and use color function to generate legend items
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
  // add legend directly to map
  legend.addTo(myMap);