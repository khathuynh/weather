// Filtering utils
function filterSilver(feature) {
    return !feature.properties.LINE.includes('SILVER');
}

function filterGreenLineWest(feature) {
    // Show east branches and BCDE shared stations,and show only termini on west
    return feature.properties.TERMINUS === 'Y' ||
    !(
        feature.properties.ROUTE.includes('C - Cleveland Circle') ||
        feature.properties.ROUTE.includes('E - Heath Street') ||
        feature.properties.ROUTE.includes('B - Boston College') ||
        feature.properties.ROUTE.includes('D - Riverside')
    );
}

function filterDowntown(feature) {
    return !(
        feature.properties.STATION.includes('North Station') ||
        feature.properties.STATION.includes('Haymarket') ||
        feature.properties.STATION.includes('Chinatown') ||
        // feature.properties.STATION.includes('Park Street') ||
        feature.properties.STATION.includes('Downtown Crossing') ||
        feature.properties.STATION.includes('Government Center') ||
        feature.properties.STATION.includes('State') ||
        feature.properties.STATION.includes('Aquarium') ||
        feature.properties.STATION.includes('Lechmere') ||
        feature.properties.STATION.includes('Bowdoin') ||
        feature.properties.STATION.includes('Arlington') ||
        feature.properties.STATION.includes('Copley') ||
        feature.properties.STATION.includes('Boylston')
    );
}

function filterForTravelPath(feature) {
    // TODO for each segment
        // filter on ROUTE and STATIONS include stations on segment
        // exclude before and after stations
    return (
    feature.properties.ROUTE.includes('Forest Hills to Oak Grove') &&
    feature.properties.STATIONS?.some(station => ["Wellington", "Assembly", "Community College", "North Station"].includes(station))
    );
}

// Other
function getLineColor(feature) {
    switch (feature.properties.LINE) {
        case 'RED': return "#f40041";
        case 'BLUE': return "#2374e6";
        case 'GREEN': return "#0d7210";
        case 'ORANGE': return "#ffa200";
        default: return "#e0ea2bef";
    }
}

// Get path for an itinerary
function getTravelPath() {
    return L.geoJSON(mbtaArcsJson, {
        style: function(feature) {
            return { 
                weight: 12,
                opacity: .6,
                color: 'rgb(227, 20, 155)'
                // color: getLineColor(feature)
            }
        },
        filter: function (feature) {
            return filterForTravelPath(feature);
        }
    });
}

function isMobile() {
// return navigator.userAgentData.mobile;
return window.matchMedia("only screen and (max-width: 768px)").matches;
};