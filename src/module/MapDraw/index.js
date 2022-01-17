
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

const MapDraw = ({ onAddFeatureGroupLayer, onAddSingleFeatureGroupLayer }) => {
  let controlDraw;
  let drawnItems;
  let fg;

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
      edit: {
        featureGroup: drawnItems
      }
    });
    map.addControl(controlDraw);
    map.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;

      drawnItems.addLayer(layer);


      const geo = drawnItems.toGeoJSON()
      const data = layer.toGeoJSON()
      // console.log(layer)
      console.log(geo)
      onAddFeatureGroupLayer(geo)
      onAddSingleFeatureGroupLayer(data)

    });
    // return () => {
    //   controlDraw.removeFrom(map);
    // };
  }, []);

  return (
    <>
      <div id="map" />
    </>

  );
}

export default MapDraw;