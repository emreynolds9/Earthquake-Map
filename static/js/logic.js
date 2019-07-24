// Function to determine marker size based on population
function markerSize(mag) {
  return mag*100000;
}

function getColor(mag) {
  return mag > 6 ? '#bf0c00' :
         mag > 5  ? '#c73111' :
         mag > 4  ? '#cf5722' :
         mag > 3  ? '#d77d33' :
         mag > 2   ? '#dfa244' :
         mag > 1   ? '#e7c855' :
                    '#f0ee66';
}
// An array containing all of the information needed to create city and state markers
// var locations = [
//   {
//     coordinates: [40.7128, -74.0059],
//     state: {
//       name: "New York State",
//       population: 19795791
//     },
//     city: {
//       name: "New York",
//       population: 8550405
//     }
//   },
//   {
//     coordinates: [34.0522, -118.2437],
//     state: {
//       name: "California",
//       population: 39250017
//     },
//     city: {
//       name: "Lost Angeles",
//       population: 3971883
//     }
//   },
//   {
//     coordinates: [41.8781, -87.6298],
//     state: {
//       name: "Michigan",
//       population: 9928300
//     },
//     city: {
//       name: "Chicago",
//       population: 2720546
//     }
//   },
//   {
//     coordinates: [29.7604, -95.3698],
//     state: {
//       name: "Texas",
//       population: 26960000
//     },
//     city: {
//       name: "Houston",
//       population: 2296224
//     }
//   },
//   {
//     coordinates: [41.2524, -95.9980],
//     state: {
//       name: "Nebraska",
//       population: 1882000
//     },
//     city: {
//       name: "Omaha",
//       population: 446599
//     }
//   }
// ];

// Define arrays to hold created city and state markers
var quakes = [];
var lines = [];

link="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(link, function (data) {
  var entry = data.features
  for (var i = 0; i < entry.length; i++) {
      quakes.push(
        L.circle(entry[i].geometry.coordinates, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: getColor(entry[i].properties.mag),
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(entry[i].properties.mag)    
      })
      .bindPopup("<h1>" + entry[i].properties.place + "</h1> <hr> <h3>Magnitude: " + entry[i].properties.mag + "</h3>")
      )
    }
  })
console.log(quakes);
var plateslink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// Perform a GET request to the query URL
d3.json(plateslink, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("hello");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  lines.push(
    L.geoJSON(earthquakeData, {
    style: {color: "green"},
    onEachFeature: onEachFeature
  }));
  // Sending our earthquakes layer to the createMap function
}

console.log(lines)


// Define variables for our base layers
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

// Create two separate layer groups: one for cities and one for states
var quakeLayer = new L.layerGroup(quakes);
var platesLayer = new L.layerGroup(lines);

// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create an overlay object
var overlayMaps = {
  "State Population": quakeLayer,
  "City Population": platesLayer
};

// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 2,
  layers: [streetmap, quakeLayer, platesLayer]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);
