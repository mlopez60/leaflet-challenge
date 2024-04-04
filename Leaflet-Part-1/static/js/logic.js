// Get the url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Grab the data
d3.json(queryUrl).then(function (data) {
  // Run Data through function
  createFeatures(data.features);
});

// Function to store data and plug into other functions (Marker, marker size, marker color, createMap)
function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${(feature.properties.mag)}</p><p>Depth: ${(feature.geometry.coordinates[2])}</p><p>Lat: ${(feature.geometry.coordinates[1])} Long: ${(feature.geometry.coordinates[0])}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  function createCircle(feature, latlng){
    let styles = {
        color: markerColor(feature.geometry.coordinates[2]),
        fillColor:markerColor(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag)
    }
    return L.circleMarker(latlng, styles)
  }

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircle
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


// function to create map
function createMap(earthquakes) {
    // tile layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // baseMap
    let baseMaps = {
        "Topographic Map" : topo
    };

    // Create an overlayMaps object to hold the earthquakes layer.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create the map object with options.
  let map = L.map("map", {
    center: [0, 0],
    zoom: 3,
    layers: [topo, earthquakes]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  legend.addTo(map);
}


// Determine marker size and color
function markerSize(magnitude) {
    return Math.sqrt(magnitude)*10;
}

function markerColor(depth) {
  if (depth <= 10) {
    return "lime";
  }
  else if (depth <= 30) {
    return  "green";
  }
  else if (depth <= 50) {
    return  "yellow";
  }
  else if (depth <= 70) {
    return  "gold";
  }
  else if (depth <= 90) {
    return  "orange";
  }
  else if (depth > 90) {
    return  "red";
  }

};


// Function for Labels, unable to get color to work properly
let legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend')
    labels = ['<strong>Depth</strong>'];
    groups = ['Lime: <10', 'Green: 10-30', 'Yellow: 30-50', 'Gold: 50-70', 'Orange: 70-90', 'Red: 90+']
    values = [10,30,50,70,90,100]
    for (var i = 0; i < groups.length; i++) {
            div.innerHTML +=
            labels.push('<i style=\"background-color:' + markerColor(values[i]) + '"></i> ' +(values[i] ? groups[i] : '+'));
        }
      div.innerHTML =labels.join('<br>');
    
    return div;
  };