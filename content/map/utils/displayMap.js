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
    interactive: false,
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

var mbtaStationsNoDowntownLayer = L.geoJSON(mbtaNodesJson, {
    interactive: false,
    pointToLayer: function(point, latlng) {
        var text = L.divIcon({
        className: 'station-names',
        html: `<p>${point.properties.STATION}</p>`,
        iconSize: [100, 20],
        iconAnchor: [0, 0]
        });
        var label = L.marker([latlng.lat, latlng.lng], {icon: text});

        var circle = L.circle(latlng, {
        stroke: false,
        color: 'rgba(0, 0, 0, 0.48)',
        fillColor: 'rgb(0, 0, 0)',
        fillOpacity: .7,
        radius: 60
        });
        
        return L.featureGroup([label, circle]);
    },
    filter: function (feature) {
        return filterSilver(feature) && filterGreenLineWest(feature) && filterDowntown(feature);
    }
});

var mbtaStationsDowntownOnlyLayer = L.geoJSON(mbtaNodesJson, {
    // square?
    interactive: false,
    pointToLayer: function(point, latlng) {
        var text = L.divIcon({
        className: 'station-names',
        html: `<p>${point.properties.STATION}</p>`,
        iconSize: [100, 20],
        iconAnchor: [0, 0]
        });
        var label = L.marker([latlng.lat, latlng.lng], {icon: text});

        var circle = L.circle(latlng, {
        stroke: false,
        color: 'rgba(0, 0, 0, 0.48)',
        fillColor: 'rgb(0, 0, 0)',
        fillOpacity: .7,
        radius: 60
        });
        
        return L.featureGroup([label, circle]);
    },
    filter: function (feature) {
        return filterSilver(feature) && !filterDowntown(feature);
    }
});

// Layer groups
// var mbtaLayerGroup = L.layerGroup(mbtaStationsNoDowntownLayer, mbtaStationsDowntownOnlyLayer);

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

