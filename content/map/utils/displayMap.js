var map = L.map('map').setView([42.3601, -71.0595], 12);
map.setMaxBounds([
    [42.44631602002316, -70.91989523904654],
    [42.187134871022494, -71.20475356314114]
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
var liteCitiesLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png', {
maxZoom: 16,
minZoom: 11,
maxNativeZoom: 15,
opacity: .7,
className: 'lite-neighborhood-layer',
attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
});

var waterLayer = L.geoJSON(waterFeatures, {
    interactive: false,
    style: {
    "color": 'rgba(23, 199, 226, 0.59)',
    "weight": 2,
    fillColor: '#33cfff',
    fillOpacity: 0.5,  
    "opacity": .8 
    }
}).addTo(map);

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
}).addTo(map);

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

var bikeNetworkLayer = L.geoJSON(bikeNetworkArc, {
    interactive: false,
    style: function(feature) {
        return { 
            weight: 1.5,
            opacity: .9,
            color: 'rgb(2, 64, 19)',
            dashArray: '2, 5'
        }
    }
}).addTo(map);

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

var poiLayer = L.geoJSON(pointsOfInterestNode, {
    interactive: false,
    pointToLayer: function(point, latlng) {
        var number = L.divIcon({
            className: 'poi-names',
            html: `<p>${point.properties.id}</p>`,
            iconSize: [100, 20],
            iconAnchor: [0, 12]
        });
        var numberMarker = L.marker([latlng.lat, latlng.lng], {
            interactive: false,
            pane: 'storyPane',
            icon: number});
        var pin = new L.icon({
        iconUrl: './assets/red-pin.png',
        iconSize: [60, 45],
        iconAnchor: [30, 22]
        });
        var pinMarker = L.marker([latlng.lat, latlng.lng], {
        interactive: false,
        icon: pin
        });

        var hoverRadius = L.circleMarker([latlng.lat, latlng.lng],{
            stroke: false,
            pane: 'storyPane',
            fillOpacity: 0,
            fillColor:  'rgb(225, 255, 0)',
            color: 'rgba(225, 255, 0, 0.28)',
            radius: 25
        });
        hoverRadius.bindTooltip(point.properties.description, {
            className: 'tooltip',
            permanent: false,
            direction: 'auto',
            sticky: true
            });
        
        hoverRadius.on('mouseover', function (e) {
            this.setStyle({
            fillOpacity: 0.32,
            stroke: true
            });
        });
        hoverRadius.on('mouseout', function (e) {
            this.setStyle({
            fillOpacity: 0,
            stroke: false
            });
        });
        if (point.properties.id === "1") { 
            hoverRadius.on('click', function(e) {
                console.log(e.latlng);
                // var newy = L.latlng()
                // console.log(newy);
                map.flyTo([42.40359921636448, -71.0856150144597], 14);
            });
        };

        return L.layerGroup([numberMarker, pinMarker, hoverRadius], {pane: 'tooltipPane'});
    }
    // pointToLayer: function(point, latlng) {
    //     var text = L.divIcon({
    //         className: 'poi-names',
    //         html: `<p>${point.properties.id}</p>`,
    //         iconSize: [100, 20],
    //         iconAnchor: [0, 12]
    //     });
    //     var label = L.marker([latlng.lat, latlng.lng], {
    //         interactive: false,
    //         pane: 'storyPane',
    //         icon: text});
        
    //     var circle = L.circleMarker([latlng.lat, latlng.lng],{
    //         interactive: false, 
    //         pane: 'storyPane',
    //         color: 'red',
    //         fillColor: 'rgb(225, 35, 73)',
    //         fillOpacity: 1,
    //         radius: 7
    //     });

    //     var hoverRadius = L.circleMarker([latlng.lat, latlng.lng],{
    //         stroke: false,
    //         pane: 'storyPane',
    //         fillOpacity: 0,
    //         fillColor:  'rgb(225, 255, 0)',
    //         color: 'rgba(225, 255, 0, 0.28)',
    //         radius: 25
    //     });
    //     hoverRadius.bindTooltip(point.properties.description, {
    //         className: 'tooltip',
    //         permanent: false,
    //         direction: 'auto',
    //         sticky: true
    //         });
        
    //     hoverRadius.on('mouseover', function (e) {
    //         this.setStyle({
    //         fillOpacity: 0.32,
    //         stroke: true
    //         });
    //     });
    //     hoverRadius.on('mouseout', function (e) {
    //         this.setStyle({
    //         fillOpacity: 0,
    //         stroke: false
    //         });
    //     });

    //     return L.layerGroup([label, circle, hoverRadius], {pane: 'tooltipPane'});
    // }
});

var poiArcLayer = L.geoJSON(pointsOfInterestArc, {
    interactive: false, 
    style: function(feature) {
        return { 
            weight: 4,
            opacity: .85,
            color: 'rgb(255, 0, 115)',
            dashArray: '5, 5'

        }
    }
});

var startHere = L.tooltip({ 
    permanent: true,
    direction: 'right',
    className: 'start-here'

 })
  .setContent("<- Start here.")
  .setLatLng([42.415, -71.08]);

var ameliaText = L.divIcon({
    className: 'station-names',
    html: `<p>Amelia's house</p>`,
    iconSize: [100, 20],
    iconAnchor: [0, 8]
});
var ameliaLabel = L.marker([42.424686648939506, -71.13112744907478], {
    interactive: false,
    icon: ameliaText
});
var ameliaHouse = L.circleMarker([42.424686648939506, -71.13112744907478], {
    interactive: false,
    color: 'rgb(0, 0, 0)',
    fillColor:'rgb(111, 230, 90)',
    fillOpacity: .85,
    radius: 5,
    weight: 1
    }
);

var storyLayer = L.featureGroup([poiLayer, poiArcLayer, startHere]);
storyLayer.addTo(map);

var ameliaLayer = L.featureGroup([ ameliaHouse, ameliaLabel]);

// Layer groups
// var mbtaLayerGroup = L.layerGroup(mbtaStationsNoDowntownLayer, mbtaStationsDowntownOnlyLayer);

// Layer controls, scale configuration
var baseMaps = {
'Natural geography': watercolorLayer
}
var overlayMaps = {
'Cities + streets': liteCitiesLayer,
'MBTA lines': mbtaLinesLayer,
'Protected bike trails': bikeNetworkLayer,
'Public boat launches': boatLayer,
'Libraries': libraryLayer,
'Water features': waterLayer,
'2.5D buildings (high zoom only)': osm,
'Surprise': ameliaLayer
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

map.on('overlayadd',function() {
    storyLayer.bringToFront();
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

