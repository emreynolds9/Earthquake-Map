// // Function to determine marker size based on population
// function markerSize(mag) {
//   return mag*100000;
// }

// function getColor(mag) {
//   return mag > 6 ? '#bf0c00' :
//          mag > 5  ? '#c73111' :
//          mag > 4  ? '#cf5722' :
//          mag > 3  ? '#d77d33' :
//          mag > 2   ? '#dfa244' :
//          mag > 1   ? '#e7c855' :
//                     '#f0ee66';
// }
// var myMap = L.map("map", {
//   center: [37.09, -95.71],
//   zoom: 2})

// // Define arrays to hold created city and state markers
// var quakes = [];
// var lines = [];

// link="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// d3.json(link, function (data) {
//   var entry = data.features
//   for (var i = 0; i < entry.length; i++) {
//       quakes.push(
//         L.circle(entry[i].geometry.coordinates, {
//         fillOpacity: 0.75,
//         color: "white",
//         fillColor: getColor(entry[i].properties.mag),
//         // Setting our circle's radius equal to the output of our markerSize function
//         // This will make our marker's size proportionate to its population
//         radius: markerSize(entry[i].properties.mag)    
//       })
//       .bindPopup("<h1>" + entry[i].properties.place + "</h1> <hr> <h3>Magnitude: " + entry[i].properties.mag + "</h3>")
//       ).addTo(myMap)
//     }
//   })
// console.log(quakes);
// var plateslink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// // Perform a GET request to the query URL
// d3.json(plateslink, function(data) {
//     // Once we get a response, send the data.features object to the createFeatures function
//     createFeatures(data.features);
//   });
  
// function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("hello");
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   lines.push(
//     L.geoJSON(earthquakeData, {
//     style: {color: "green"},
//     onEachFeature: onEachFeature
//   })).addTo(myMap);
//   // Sending our earthquakes layer to the createMap function
// }


// // Define variables for our base layers
// var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// });

// var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.dark",
//   accessToken: API_KEY
// });

// // Create a baseMaps object
// var baseMaps = {
//   "Street Map": streetmap,
//   "Dark Map": darkmap
// };

// // Create an overlay object
// var overlayMaps = {
//   "State Population": quakeLayer,
//   "City Population": platesLayer
// };

// // Define a map object

// // Pass our map layers into our layer control
// // Add the layer control to the map
// L.control.layers(baseMaps, overlayMaps).addTo(myMap);


// var myMap = L.map("map", {
//     center: [37.09, -5.71],
//     zoom: 2
//   });

var myMap = L.map("map", {
  center: [46.2276, 2.2137],
  zoom: 6,
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);




link="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

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
var quakes = []
d3.json(link, function (data) {
    var entry = data.features
    for (var i = 0; i < entry.length; i++) {
        quakes.push(L.circle(entry[i].geometry.coordinates, {
          fillOpacity: 0.75,
          color: "white",
          fillColor: getColor(entry[i].properties.mag),
          // Setting our circle's radius equal to the output of our markerSize function
          // This will make our marker's size proportionate to its population
          radius: markerSize(entry[i].properties.mag)    
        })
        
        .bindPopup("<h1>" + entry[i].properties.place + "</h1> <hr> <h3>Magnitude: " + entry[i].properties.mag + "</h3>")
        ).addTo(myMap);
      }
})

var plateslink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var lines=[]
// Perform a GET request to the query URL
d3.json(plateslink, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  lines.push(L.geoJSON(earthquakeData, {
    style: {color: "green"},
    onEachFeature: onEachFeature
  })).addTo(myMap);

  // Sending our earthquakes layer to the createMap function
}
  