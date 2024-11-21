import * as pmtiles from "pmtiles";
import * as maplibregl from "maplibre-gl";
import layers from "protomaps-themes-base";

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const myMap = new maplibregl.Map({
  container: "map", // container id
  style: {
    version: 8,
    glyphs: "https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf",
    sources: {
      protomaps: {
        type: "vector",
        // url: `pmtiles://${mapUrl}`,
        url: `pmtiles://${location.protocol}//${location.host}${location.pathname}hmb.pmtiles`,
        attribution:
          '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    layers: layers("protomaps", "light"),
  },
});
myMap.on("load", () => {
  const myBounds = myMap.getSource("protomaps").bounds;
  myMap.setMaxBounds(myBounds);
  // Now load the places.json
  fetch("places.json").then((response) => {
    response.json().then((data) => {
        data.rows.forEach((row) => {            
            const message = JSON.parse(row.message);
            const messagelist = [message.main].join(
                ", ",
            );
            const object = JSON.parse(row.object).value;
            const objectlist = [object].join(
                ", ",
            );
            let color = '#FF0000';
            if (/Охранник/.test(objectlist)) {
                color = '#00FF00';
            }
            if (/Скамья/.test(objectlist)) {
          color = '#0000FF';
            };
            const timestamp = JSON.parse(row.timestamp);
            const timelist = [timestamp.main].join(
                ", ",
            );
            const id = JSON.parse(row.id);
            const idlist = [id.main].join(
                ", ",
            );
        const marker = new maplibregl.Marker({ scale: 0.5, color: color });
        marker
          .setLngLat([row.longitude, row.latitude])
          .setPopup(
            new maplibregl.Popup().setHTML(
                `<strong>${"ID: "}</strong>${idlist}
                <br><strong>${"TimeStamp: "}</strong>${timelist}
                <br><strong>${"Object: "}</strong>${object}
                <br><strong>${"Message: "}</strong>${messagelist}`,
            ),
          );
        marker.addTo(myMap);
      });
    });
  });
});
