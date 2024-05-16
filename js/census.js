var geojson;
var geojson2;
var toggle = "Precinct";
var reset_toggle=""
var map = L.map("map").setView([40.6331, -89.3985], 7);
var
  Black_Total = 0,
  White_Total = 0,
  Asian_Total=0,
  Hispanic_Total=0,
  Native_Total=0,
  Pacific_Total=0,
  Total = 0,
  Winner = "Tie";

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap Sources: US Census Bureau",
}).addTo(map);

const response3 = fetch("/JSON/Totals.json")
  .then((response3) => response3.json())
  .then((response3) => {
    calc_total(response3);
  });

const response = fetch("/JSON/Illinois_2020_Census_Tracts.geojson")
  .then((response) => response.json())
  .then((response) => {
    geojson = L.geoJson(response, {
      style: style,
      onEachFeature: onEachFeature,
    });

    map.addLayer(geojson);
    reset_toggle= Winner;
    reset();
    
  });

const response2 = fetch("/JSON/Illinois_County.geojson")
  .then((response2) => response2.json())
  .then((response2) => {
    geojson2 = L.geoJson(response2, {
      style: style,
      onEachFeature: onEachFeature,
    });
  });

function highlightFeature(e) {
  var layer = e.target;
  highlight_reset_row(layer.feature.properties);
  layer.setStyle({
    weight: 2,
    color: "#000000",

    fillOpacity: 0.7,
  });
  info(layer.feature.properties);

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }


  
 
}
function style(feature) {
  return {
    weight: 0.5,
    opacity: 0.7,
    color: getColor(feature.properties.Winner,feature.properties.Margin),
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.Winner,feature.properties.Margin)
  };
}
function resetHighlight(e) {
  
  geojson.resetStyle(e.target);
  highlight_reset_row(e.target.feature.properties.Winner);
  reset();

}

//function zoomToFeature(e) {
//        map.fitBounds(e.target.getBounds());
//}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    //click: zoomToFeature
  });
}

function getColor(d,c) {
  return d == 1
    ? choropleth(c,'#143935','#215e58','#2e847c','#3caa9f','#55c3b8','#7bd1c8','#a1ded8','#c6ebe7')
    : d == 0
    ? choropleth(c,'#600624','#900936','#c00c48','#f00f5a','#f33f7b','#f66f9c','#f99fbd','#fccfde')
    : d == 2
    ? choropleth(c,'#613305','#914d08','#c2660a','#f2800d','#f5993d','#f7b36e','#facc9e','#fce6cf')
    : d == 3
    ? choropleth(c,'#2c1056','#421881','#5820ac','#6e28d7','#8b53df','#a87ee7','#c5a9ef','#e2d4f7')
    : "#ccc9c0";
    
}

choropleth =function(d,c1,c2,c3,c4,c5,c6,c7,c8){
  return d > 0.5
  ? c1
  : d >0.4
  ? c2
  : d >0.3
  ? c3
  : d > 0.2
  ? c4
  : d > 0.15
  ? c5
  : d > .10
  ? c6
  : d > .05
  ? c7
  : d > 0
  ? c8
  : "#ccc9c0";
};

info = function (props) {
  if (toggle == "Precinct") {
    document.getElementById("Name").innerHTML =
    props.County.toUpperCase()+": "+  props.Name
      
  } else {
    document.getElementById("Name").innerHTML =
    props.Name + " COUNTY"
  }

  
  document.getElementById("Black_votes").innerHTML =
    props.Black.toLocaleString("en-US");
  document.getElementById("Black_percent").innerHTML = (
    divide(props.Black, props.Total) * 100
  ).toFixed(2);

  document.getElementById("White_votes").innerHTML =
    props.White.toLocaleString("en-US");
  document.getElementById("White_percent").innerHTML = (
    divide(props.White, props.Total) * 100
  ).toFixed(2);

  document.getElementById("Asian_votes").innerHTML =
    props.Asian.toLocaleString("en-US");
  document.getElementById("Asian_percent").innerHTML = (
    divide(props.Asian, props.Total) * 100
  ).toFixed(2);

  document.getElementById("Hispanic_votes").innerHTML =
    props.Hispanic.toLocaleString("en-US");
  document.getElementById("Hispanic_percent").innerHTML = (
    divide(props.Hispanic, props.Total) * 100
  ).toFixed(2);

  document.getElementById("Native_votes").innerHTML =
    props.Native.toLocaleString("en-US");
  document.getElementById("Native_percent").innerHTML = (
    divide(props.Native, props.Total) * 100
  ).toFixed(2);

  document.getElementById("Pacific_votes").innerHTML =
    props.Pacific.toLocaleString("en-US");
  document.getElementById("Pacific_percent").innerHTML = (
    divide(props.Pacific, props.Total) * 100
  ).toFixed(2);

  
  document.getElementById("Total_votes").innerHTML =
    props.Total.toLocaleString("en-US");
  
  const candidates =[{row:'White_row', value:props.White},
                   {row:'Asian_row', value:props.Asian},
                   {row:'Black_row', value:props.Black},
                   {row:'Hispanic_row', value:props.Hispanic},
                   {row:'Native_row', value:props.Native},
                   {row:'Pacific_row', value:props.Pacific}
  ];

  candidates.sort((a, b) => a.value - b.value)
  //console.log(candidates)
  for(key of candidates){
   
    var content = document.getElementById(key.row);
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild.nextSibling);

  }
  console.log(props.Winner)
  highlight_row(props.Winner);
  reset_toggle=props.Winner;
};

reset = function () {
 
  
  document.getElementById("Name").innerHTML = "Total";

  document.getElementById("Black_votes").innerHTML =
    Black_Total.toLocaleString("en-US");
  document.getElementById("Black_percent").innerHTML = (
    divide(Black_Total, Total) * 100
  ).toFixed(2);

  document.getElementById("White_votes").innerHTML =
 White_Total.toLocaleString("en-US");
  document.getElementById("White_percent").innerHTML = (
    divide(White_Total, Total) * 100
  ).toFixed(2);

  document.getElementById("Asian_votes").innerHTML =
  Asian_Total.toLocaleString("en-US");
  document.getElementById("Asian_percent").innerHTML = (
    divide(Asian_Total, Total) * 100
  ).toFixed(2);

  document.getElementById("Hispanic_votes").innerHTML =
  Hispanic_Total.toLocaleString("en-US");
  document.getElementById("Hispanic_percent").innerHTML = (
    divide(Hispanic_Total, Total) * 100
  ).toFixed(2);

  document.getElementById("Native_votes").innerHTML =
  Native_Total.toLocaleString("en-US");
  document.getElementById("Native_percent").innerHTML = (
  divide(Native_Total, Total) * 100
  ).toFixed(2);

  document.getElementById("Pacific_votes").innerHTML =
  Pacific_Total.toLocaleString("en-US");
  document.getElementById("Pacific_percent").innerHTML = (
  divide(Pacific_Total, Total) * 100
  ).toFixed(2);


  document.getElementById("Total_votes").innerHTML =
  Total.toLocaleString("en-US");

  highlight_row(Winner);

  const candidates =[{row:'White_row', value:White_Total},
                   {row:'Asian_row', value:Asian_Total},
                   {row:'Black_row', value:Black_Total},
                   {row:'Hispanic_row', value:Hispanic_Total},
                   {row:'Native_row', value:Native_Total},
                   {row:'Pacific_row', value:Pacific_Total}
                  
  ];

  candidates.sort((a, b) => a.value - b.value)
 
  for(key of candidates){
    var content = document.getElementById(key.row);
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild.nextSibling);

  }

};

ward_click = function () {
  map.removeLayer(geojson);
  map.addLayer(geojson2);
  toggle = "Ward";

  document.getElementById("ward-btn").style.color = "rgba(50,50,50,0.5)";
  document.getElementById("ward-btn").style.backgroundColor = "#ffffff";
  document.getElementById("ward-btn").style.transition = ".5s";

  document.getElementById("precinct-btn").style.color = "#ffffff";
  document.getElementById("precinct-btn").style.backgroundColor =
    "rgba(50,50,50,0.5)";
  document.getElementById("precinct-btn").style.transition = ".5s";
};

precinct_click = function () {
  map.removeLayer(geojson2);
  map.addLayer(geojson);
  toggle = "Precinct";

  document.getElementById("precinct-btn").style.color = "rgba(50,50,50,0.5)";
  document.getElementById("precinct-btn").style.backgroundColor = "#ffffff";
  document.getElementById("precinct-btn").style.transition = ".5s";

  document.getElementById("ward-btn").style.color = "#ffffff";
  document.getElementById("ward-btn").style.backgroundColor =
    "rgba(50,50,50,0.5)";
  document.getElementById("ward-btn").style.transition = ".5s";
};

divide = function (var1, var2) {
  if (var2 == 0) {
    return 0;
  }
  return var1 / var2;
};

calc_total = function (response) {
  Total = response.Total;

  Black_Total = response.Black;
  White_Total = response.White;
  Asian_Total=response.Asian;
  Hispanic_Total=response.Hispanic;
  Native_Total=response.Native;
  Pacific_Total=response.Pacific
 
  Winner = response.Winner;
  console.log(Total)
};

highlight_row = function (feature) {
  switch (feature) {
    case 1:
      document.getElementById("Black_row").style.fontWeight = "bold";
      document.getElementById("Black_block").style.backgroundColor =
        "#4dc0b5";
      document.getElementById("Black_row").style.color = "#fff";
      break;
    case 0:
      document.getElementById("White_row").style.fontWeight = "bold";
      document.getElementById("White_block").style.backgroundColor = "#f66d9b";
      document.getElementById("White_row").style.color = "#fff";
      break;
    case 3:
      document.getElementById("Asian_row").style.fontWeight = "bold";
      document.getElementById("Asian_block").style.backgroundColor =  "#9561e299";
      document.getElementById("Asian_row").style.color = "#fff";
      break;
    case 2:
      document.getElementById("Hispanic_row").style.fontWeight = "bold";
      document.getElementById("Hispanic_block").style.backgroundColor ="#f6993f99";
      document.getElementById("Hispanic_row").style.color = "#fff";
      break;
    
  }
};

highlight_reset_row = function (Winner) {

  document.getElementById("Black_row").style.fontWeight = "normal";
  document.getElementById("Black_block").style.backgroundColor = "#4dc0b599";
  document.getElementById("Black_row").style.color = "#ffffff80";

  document.getElementById("White_row").style.fontWeight = "normal";
  document.getElementById("White_block").style.backgroundColor = "#f66d9b99";
  document.getElementById("White_row").style.color = "#ffffff80";

  document.getElementById("Asian_row").style.fontWeight = "normal";
  document.getElementById("Asian_block").style.backgroundColor =  "#9561e299";
  document.getElementById("Asian_row").style.color = "#ffffff80";

  document.getElementById("Hispanic_row").style.fontWeight = "normal";
  document.getElementById("Hispanic_block").style.backgroundColor = "#f6993f99";
  document.getElementById("Hispanic_row").style.color = "#ffffff80";
}
