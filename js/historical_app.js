var map;
function init() {
  // create map and set center and zoom level

  map = new L.map("mapid");
  map.setView([39.8283, -98.5795], 5);
  // create tile layer and add it to map
  var tiles = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png?api_key=41fb0f86-dbe6-455a-ac7d-9d78e4d503bf"
  );
  tiles.addTo(map);
  // create State/ Territory Boundaries and Major Cities thematic layer and add it to map

  State_Terr_Layer = L.geoJSON(State_Terr_geojson, {
    style: State_Terr_Style,
    onEachFeature: State_Terr_OnEachFeature,
    filter: function (feature, layer) {
      return (
        feature.properties.START_DATE <= "1783-12-31" &&
        feature.properties.END_DATE >= "1783-12-31"
      );
    },
  }).addTo(map);

  Major_Cities_Layer = L.geoJSON(Cities_geojson, {
    pointToLayer: Major_Cities_Style,
    onEachFeature: Major_Cities_OnEachFeature,
    filter: function (feature, layer) {
      return feature.properties.City_Date <= 1783;
    },
  }).addTo(map);

  // define the styles and handle click events for the State/ Territory Layer (unselected and selected)
  var State_Terr_Layer;
  var Major_Cities_Layer;
  var selection;
  var selectedLayer;

  function State_Terr_Style(feature) {
    return {
      fillColor: "#8c6d0f",
      fillOpacity: 0.75,
      color: "#000000",
      weight: 1,
    };
  }

  function State_Terr_SelectedStyle(feature) {
    return {
      fillColor: "#0e968b",
      color: "#000000",
      fillOpacity: 0.75,
      weight: 1,
    };
  }

  function State_Terr_OnEachFeature(feature, layer) {
    layer.on({
      click: function (e) {
        if (selection) {
          resetStyles();
        }

        e.target.setStyle(State_Terr_SelectedStyle());
        selection = e.target;
        selectedLayer = State_Terr_Layer;

        // Insert some HTML with the feature name
        buildSummaryLabel(feature);

        L.DomEvent.stopPropagation(e); // stop click event from being propagated further
      },
    });
  }

   // define the styles and handle click events for the Major Cities Layer (unselected and selected)
  function Major_Cities_Style(feature, latlng) {
    return L.circle(latlng, {
      color: "black",
      fillColor: "#6b1f66",
      fillOpacity: 1,
      radius: 20000,
    });
  }

  function Major_Cities_SelectedStyle(feature, latlng) {
    return {
      color: "black",
      fillColor: "#0e968b",
      fillOpacity: 1,
      radius: 20000,
    };
  }

  function Major_Cities_OnEachFeature(feature, layer) {
    layer.on({
      click: function (e) {
        if (selection) {
          resetStyles();
        }
        console.log("Hello");
        e.target.setStyle(Major_Cities_SelectedStyle());
        selection = e.target;
        selectedLayer = Major_Cities_Layer;

        // Insert some HTML with the feature name
        buildSummaryLabel(feature);

        L.DomEvent.stopPropagation(e); // stop click event from being propagated further
      },
    });
  }

  function resetStyles() {
    if (selectedLayer === State_Terr_Layer) selectedLayer.resetStyle(selection);
    if (selectedLayer === Major_Cities_Layer)
      selectedLayer.resetStyle(selection);
  }
  // function to build the HTML for the summary label using the selected feature's "name" property
  function buildSummaryLabel(currentFeature) {
    // If selected layer is State/Territory
    if (selectedLayer == State_Terr_Layer) {
      document.getElementById("summaryLabel").innerHTML =
        "<p id='infographics'><b>Name:</b>&nbsp;" +
        currentFeature.properties.FULL_NAME +
        "<br/>" +
        "<b>Changes:</b>&nbsp;" +
        currentFeature.properties.CHANGE +
        "</p>";
    }
    // If selected layer is City
    if (selectedLayer == Major_Cities_Layer) {
      document.getElementById("summaryLabel").innerHTML =
        "<p id='infographics'><b>City Name:</b>&nbsp;" +
        currentFeature.properties.NAME +
        "<br/>" +
        "<b>Date founded:</b>&nbsp;" +
        currentFeature.properties.City_Date +
        "</p>";
    }
  }
  // handle clicks on the map that didn't hit a feature
  map.addEventListener("click", function (e) {
    if (selection) {
      resetStyles();
      selection = null;
      document.getElementById("summaryLabel").innerHTML =
        "<p id='infographics' >Click a state or territory on the map and select a date to get more information.</p>";
    }
  });

  // handle reloading the GeoJson layer when the date changed
  const dateControl = document.querySelector('input[type="date"]');

  document.getElementById("dateButton").addEventListener("click", function () {
    map.removeLayer(State_Terr_Layer);

    State_Terr_Layer = L.geoJSON(State_Terr_geojson, {
      style: State_Terr_Style,
      onEachFeature: State_Terr_OnEachFeature,
      filter: function (feature, layer) {
        return (
          feature.properties.START_DATE <= dateControl.value &&
          feature.properties.END_DATE >= dateControl.value
        );
      },
    }).addTo(map);

    map.removeLayer(Major_Cities_Layer);
    Major_Cities_Layer = L.geoJSON(Cities_geojson, {
      pointToLayer: Major_Cities_Style,
      onEachFeature: Major_Cities_OnEachFeature,
      filter: function (feature, layer) {
        return (
          feature.properties.City_Date <= Number(dateControl.value.slice(0, 4))
        );
      },
    }).addTo(map);

    document.querySelector("input[type=range]").value = new Date(
      dateControl.value
    ).getTime();
  });

  // handle slider
  var slider = document.getElementById("myRange");

  slider.setAttribute("min", new Date("1783-09-04").getTime());
  slider.setAttribute("value", new Date("1783-09-03").getTime());
  slider.setAttribute("max", new Date("1959-08-22").getTime());

  slider.oninput = function () {
    var date = new Date(Number(slider.value));

    var datestring =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    dateControl.value = datestring;

    map.removeLayer(State_Terr_Layer);

    State_Terr_Layer = L.geoJSON(State_Terr_geojson, {
      style: State_Terr_Style,
      onEachFeature: State_Terr_OnEachFeature,
      filter: function (feature, layer) {
        return (
          feature.properties.START_DATE <= dateControl.value &&
          feature.properties.END_DATE >= dateControl.value
        );
      },
    }).addTo(map);

    map.removeLayer(Major_Cities_Layer);
    Major_Cities_Layer = L.geoJSON(Cities_geojson, {
      pointToLayer: Major_Cities_Style,
      onEachFeature: Major_Cities_OnEachFeature,
      filter: function (feature, layer) {
        return (
          feature.properties.City_Date <= Number(dateControl.value.slice(0, 4))
        );
      },
    }).addTo(map);

    document.querySelector("input[type=range]").value = new Date(
      dateControl.value
    ).getTime();
  };
}
