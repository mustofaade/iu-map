
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import '../map.scss';

import 'leaflet-draw';
import 'leaflet-toolbar';

const BASE_URL = 'https://geocoding.oslogdev.com/v1/autocomplete'

let map = null

const MapLocation = ({ location, onDragMarkerEnd }) => {
  let markerLocation;
  let markerLayer;
  let controlDraw;
  let drawnItems;
  let selectedFeature;

  useEffect(() => {

    // INITIALIZE MAP
    if (!map) {
      map = L.map('map', { zoomControl: false }).setView([-2.721044, 116.62442], 5);
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
      ).addTo(map);

      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);


    }
  }, []);


  useEffect(() => {
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    controlDraw = new L.Control.Draw({
      draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: true
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    map.addControl(controlDraw);
    map.on(L.Draw.Event.CREATED, function (event) {
      var lay = event.layer;
      drawnItems.addLayer(lay);
      const item = drawnItems.toGeoJSON()
      console.log(item)

      // markerLayer = L.geoJson(item, {
      //   onEachFeature: function (feature, layer) {
      //     map.addLayer(layer);
      //     layer.on('click', function (e) {
      //       if (selectedFeature) {
      //         selectedFeature.editing.disable();
      //         // and Here I'll add the code to store my edited polygon in the DB or whatever I want to do with it
      //       }
      //       selectedFeature = e.target;
      //       e.target.editing.enable();
      //     });
      //   }
      // }).addTo(map);

      // const data = layer.toGeoJSON()
      // // console.log(layer)

      // onAddFeatureGroupLayer(geo)
      // onAddSingleFeatureGroupLayer(data)

    });

  }, []);


  useEffect(() => {
    if (location) {
      markerLocation = L.marker(location).addTo(map);
      markerLocation.on('dragend', function (e, latlng) {
        console.log({ e, latlng })
        const lat = markerLocation.getLatLng().lat
        const lng = markerLocation.getLatLng().lng
        markerLocation.setLatLng([lat, lng]);
        map.panTo([lat, lng]);
      });
    }

    return () => {
      markerLocation.removeFrom(map);
    };
  }, [location]);

  return (
    <>
      <div id="map" />
    </>

  );
}

export default MapLocation;