var map = L.map('map').setView([42.3601, -71.0595], 12);
map.setMaxBounds([
    [42.54631602002316, -70.91989523904654],
    [42.187134871022494, -71.30475356314114]
]);

map.createPane("storyPane");
map.getPane('storyPane').style.zIndex = 625; 

// Base layer
var watercolorLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.png', {
maxZoom: 16,
minZoom: 11,
maxNativeZoom: 14,
opacity: .7,
className: 'watercolor-layer',
attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
}).addTo(map);

// Overlay layers
var liteCitiesLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png', {
maxZoom: 16,
minZoom: 11,
maxNativeZoom: 15,
opacity: 1,
className: 'lite-neighborhood-layer',
attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
}).addTo(map);

var waterBaseLayer = L.geoJSON(waterFeatures, {
    interactive: false,
    style: {
    "color": 'rgba(23, 199, 226, 0.59)',
    "weight": 2,
    fillColor: '#33cfff',
    fillOpacity: 0.5,  
    "opacity": .8 
    }
});

var mystic = L.divIcon({
className: 'water-names',
html: `<p>Mystic River</p>`,
iconSize: [100, 20],
iconAnchor: [0, 8]
});
          
var mysticLabel = L.marker([42.40009400779573, -71.07482885756201], {
    interactive: false,
    icon: mystic
});
var charles = L.divIcon({
className: 'water-names',
html: `<p>Charles River</p>`,
iconSize: [100, 20],
iconAnchor: [0, 8]
});
var charlesLabel = L.marker([42.362017581174115, -71.11067084783625], {
    interactive: false,
    icon: charles
});
var harbor = L.divIcon({
className: 'water-names',
html: `<p>Boston Harbor</p>`,
iconSize: [100, 20],
iconAnchor: [0, 8]
});
var harborLabel = L.marker([42.35223432675292, -71.0233620966038], {
    interactive: false,
    icon: harbor
});
          
var waterLayer = L.layerGroup([waterBaseLayer]);
// mysticLabel.addTo(waterLayer);
// charlesLabel.addTo(waterLayer);
harborLabel.addTo(waterLayer);
waterLayer.addTo(map);

var water1630Layer = L.geoJSON(waterFeatures1630, {
    interactive: false,
    style: {
    "color": 'rgba(23, 199, 226, 0.59)',
    "weight": 2,
    fillColor: '#33cfff',
    fillOpacity: 0.5,  
    "opacity": .8 
    }
});

var osm = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');
map.removeLayer(osm);

var mbtaLinesLayer = L.geoJSON(mbtaArcsJson, {
    interactive: false,
    style: function(feature) {
        return { 
            weight: 6.5,
            opacity: .6,
            color: getLineColor(feature)
        }
    },
    filter: function (feature) {
        return filterSilver(feature);
    }
});

var mbtaStationsNoDowntownLayer = L.geoJSON(mbtaNodesJson, {
    interactive: false,
    pointToLayer: function(point, latlng) {
        var text = L.divIcon({
        className: 'station-names',
        html: `<p>${point.properties.STATION}</p>`,
        iconSize: [100, 20],
        iconAnchor: [0, 8]
        });
        var label = L.marker([latlng.lat, latlng.lng], {
            interactive: false,
            icon: text
        });

        var circle = L.circleMarker(latlng, {
        interactive: false,
        color: 'rgb(0, 0, 0)',
        fillColor: getLineColor(point),
        fillOpacity: .85,
        radius: 7,
        weight: 1
        });
        
        return L.featureGroup([label, circle]);
    },
    filter: function (feature) {
        return filterSilver(feature) && filterGreenLineWest(feature) && filterDowntown(feature);
    }
});

var mbtaStationsDowntownOnlyLayer = L.geoJSON(mbtaNodesJson, {
    interactive: false,
    pointToLayer: function(point, latlng) {
        var text = L.divIcon({
        className: 'station-names',
        html: `<p>${point.properties.STATION}</p>`,
        iconSize: [100, 20],
        iconAnchor: [0, 7]
        });
        var label = L.marker([latlng.lat, latlng.lng], {
            interactive: false,
            icon: text
        });

        var circle = L.circleMarker(latlng, {
        interactive: false,
        color: 'rgb(0, 0, 0)',
        fillColor: getLineColor(point),
        fillOpacity: 1,
        radius: 7,
        weight: 1
        });
        
        return L.featureGroup([label, circle]);
    },
    filter: function (feature) {
        return filterSilver(feature) && !filterDowntown(feature);
    }
});

var supBikeNetworkLayer = L.geoJSON(supBikeNetworkArc, {
    interactive: false,
    style: function(feature) {
        return { 
            weight: 2.5,
            opacity: .9,
            color: 'rgb(9, 74, 2)'
            // dashArray: '2, 5'
        }
    }
}).addTo(map);
var sblBikeNetworkLayer = L.geoJSON(sblBikeNetworkArc, {
    interactive: false,
    style: function(feature) {
        return { 
            weight: 2.5,
            opacity: .9,
            color: 'rgb(98, 45, 232)',
            dashArray: '2, 5'
        }
    }
}).addTo(map);
var blBikeNetworkLayer = L.geoJSON(blBikeNetworkArc, {
    interactive: false,
    style: function(feature) {
        return { 
            weight: 1.5,
            opacity: .9,
            color: 'rgb(232, 57, 45)'
            // dashArray: '2, 5'
        }
    }
});

var libraryLayer = L.geoJSON(libraryNode, {
    interactive: false, 
    pointToLayer: function(point, latlng) {
        var text = new L.icon({
        className: 'library-icon',
        html: `<p>${point.properties.name}</p>`,
        iconUrl: './assets/libby.svg',
        iconSize: [20, 20],
        iconAnchor: [0, 0]
        });
        var label = L.marker([latlng.lat, latlng.lng], {
        interactive: false,
        icon: text
        });
        return label;
    }
});

var boatLayer = L.geoJSON(boatNode, {
    interactive: false,
    pointToLayer: function(point, latlng) {
        var text = new L.icon({
        className: 'sailboat-icon',
        html: `<p>${point.properties.name}</p>`,
        iconUrl: './assets/sailboat.png',
        iconSize: [19, 19],
        iconAnchor: [0, 0]
        });
        var label = L.marker([latlng.lat, latlng.lng], {
        interactive: false,
        icon: text
        });
        return label;
    }
});

// Layer groups
// var mbtaLayerGroup = L.layerGroup(mbtaStationsNoDowntownLayer, mbtaStationsDowntownOnlyLayer);

// Layer controls, scale configuration
var baseMaps = {
'Natural geography': watercolorLayer
}
var overlayMaps = {
'Cities + streets': liteCitiesLayer,
'MBTA lines': mbtaLinesLayer,
'Bike trails': supBikeNetworkLayer,
'Separated bike lanes': sblBikeNetworkLayer,
'Scary bike lanes': blBikeNetworkLayer,
'Public boat launches': boatLayer,
'Libraries': libraryLayer,
'Water features': waterLayer,
'Shoreline 1630 WIP': water1630Layer,
'2.5D buildings (high zoom only)': osm
}
var layerControl = L.control.layers(baseMaps, overlayMaps, { hideSingleBase: true }).addTo(map);
L.control.betterscale({maxWidth: 200, metric: false, isMobile: isMobile()}).addTo(map);

var container = layerControl.getContainer();
var title = document.createElement('span');
title.classList.add('layer-control-title');
title.innerHTML = 'Layers';
container.prepend(title);

// Event listeners

// Toggle station labels at various zoom levels
map.on('zoomend', function() {
    toggleStationLabels();
});

// When MBTA Lines layer removed, also remove station labels
mbtaLinesLayer.on('remove', function(e) {
    map.removeLayer(mbtaStationsNoDowntownLayer);
    map.removeLayer(mbtaStationsDowntownOnlyLayer);
});
// Inverse, considering zoom levels
mbtaLinesLayer.on('add', function(e) {
    toggleStationLabels();
});

// Please refactor me
function toggleStationLabels() {
    if (map.hasLayer(mbtaLinesLayer)) {
        // console.log(map.getZoom());
        // Show station labels, no downtown
        if (map.getZoom() === 13 || map.getZoom() === 14) {
            if (!map.hasLayer(mbtaStationsNoDowntownLayer)) {
                map.addLayer(mbtaStationsNoDowntownLayer);
            }
            map.removeLayer(mbtaStationsDowntownOnlyLayer);
        // Very zoomed in, show downtown
        } else if (map.getZoom() > 14) {
            if (!map.hasLayer(mbtaStationsDowntownOnlyLayer)) {
                map.addLayer(mbtaStationsDowntownOnlyLayer);
            }
        }
        else {
        map.removeLayer(mbtaStationsDowntownOnlyLayer);
        map.removeLayer(mbtaStationsNoDowntownLayer);
        }
    }
    // MBTA layer not on
    else {
        map.removeLayer(mbtaStationsDowntownOnlyLayer);
        map.removeLayer(mbtaStationsNoDowntownLayer);
    }
}

// Hue slider
const slider = document.getElementById("hueSlider");
const watercolorLayerDOM = document.querySelector(".watercolor-layer");
const valueDisplay = document.getElementById("hueSliderValue");
slider.addEventListener("input", function () {
    const hue = slider.value;
    watercolorLayerDOM.style.filter = `hue-rotate(${hue}deg)`;
    valueDisplay.textContent = `${hue}°`;
});

