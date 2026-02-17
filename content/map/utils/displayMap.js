var map = L.map('map').setView([42.3601, -71.0595], 12);

// Base layer
var watercolorLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.png', {
maxZoom: 16,
minZoom: 11,
opacity: .7,
className: 'watercolor-layer',
attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
}).addTo(map);

// Overlay layers
var liteCitiesLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png', {
maxZoom: 16,
minZoom: 11,
opacity: 1,
className: 'lite-neighborhood-layer',
attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
}).addTo(map);

var osm = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');
map.removeLayer(osm);

var mbtaLinesLayer = L.geoJSON(mbtaArcsJson, {
    style: function(feature) {
        return { 
            weight: 7,
            opacity: .9,
            color: getLineColor(feature)
        }
    },
    filter: function (feature) {
        return filterSilver(feature);
    }
}).addTo(map);

var mbtaStationsLayer = L.geoJSON(mbtaNodesJson, {
    // square?
    pointToLayer: function(point, latlng) {
        var circle = L.circle(latlng, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.85,
            radius: 50
        });
        circle.bindTooltip(`${point.properties.STATION}`, {
            permanent: true,
            className: "my-label", // Optional: for custom CSS styling
            direction: 'center', // Centers the label within the circle
            offset: [0, 0] // Optional: adjust position
        }).openTooltip();
        return circle;
    },
    filter: function (feature) {
        return filterSilver(feature);
    }
});

// MBTA layer group
// var mbtaLayerGroup = L.layerGroup(mbtaLinesLayer, mbtaStationsLayer);

// Layer controls, scale configuration
var baseMaps = {
'Natural geography': watercolorLayer
}
var overlayMaps = {
'Cities and streets': liteCitiesLayer,
'MBTA lines': mbtaLinesLayer,
'2.5D buildings': osm
}
L.control.layers(baseMaps, overlayMaps).addTo(map);
L.control.betterscale({maxWidth: 200, metric: false, isMobile: isMobile()}).addTo(map);

// Zoom event listener
// to toggle station layer
map.on('zoomend', function() {
    if (map.getZoom() >= 13 ) {
         map.addLayer(mbtaStationsLayer);
    } else {
        map.removeLayer(mbtaStationsLayer);
    }
});

// var popup = L.popup()
//   .setLatLng([42.41, -71.10])
//   .setContent("I am a standalone popup.")
//   .openOn(map);

function getLineColor(feature) {
    switch (feature.properties.LINE) {
        case 'RED': return "#d1342cdd";
        case 'BLUE': return "#2374e6cf";
        case 'GREEN': return "#0d7210df";
        case 'ORANGE': return "#ffa200d2";
    }
}

function filterSilver(feature) {
    return !feature.properties.LINE.includes('SILVER');
}

function isMobile() {
// return navigator.userAgentData.mobile;
return window.matchMedia("only screen and (max-width: 768px)").matches;
};
