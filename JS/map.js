var map = L.map('map').setView([-1.3, 36.8], 6);

// Add OpenStreetMap tile layer to map element
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// control that shows county info on hover
const info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    const contents = props ? `<b>${props.COUNTIES}</b><br />${props.POP_DENSIT} persons / km<sup>2</sup>` : 'Hover over a county';
    this._div.innerHTML = `<h4>Kenya Population Density</h4>${contents}`;
};

info.addTo(map);

let geoJSON;
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.POP_DENSIT),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

//Add interactivity through highlighting on mouseover

function highlight_feature(e) {
    var layer = e.target;
    e.target.setStyle({weight: 5, color: "#969696", fillOpacity: 0.7});
    e.target.bringToFront();
    info.update(layer.feature.properties);
}

function reset_highlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

// Zoom to a particular county when clicked
function zoom_feature(e){
    map.fitBounds(e.target.getBounds());
}

function reset_zoom(e){
map.setView([-1.3, 36.8], 6);
}


fetch("Data/Ken_PopDen.geojson")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        geojson = L.geoJSON(data, {
            style: style,
            onEachFeature: function(feature, layer) {
                layer.addEventListener("mouseover", highlight_feature);
                layer.addEventListener("mouseout", reset_highlight);
                layer.addEventListener("click", zoom_feature);
            }
        }).addTo(map);
    });

// Add a legend 

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function() {
    var  div = L.DomUtil.create("div", "info legend");
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];
    div.innerHTML =
    '<b>Population in 2019</b><br>by statistical area<br>' +
    '<small>Persons/km<sup>2</sup></small><br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div; 
};

legend.addTo(map);

// Create a button to zoom out
var button = L.control({position:'bottomright'});

button.onAdd = function(){
        var div = L.DomUtil.create('button','view');
        div.innerHTML='Reset Zoom';
        div.onclick= reset_zoom
    return div;
    };
button.addTo(map);








