
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import '../map.scss';

import 'leaflet-draw';
import 'leaflet-toolbar';

import SearchBarMap from './SearchBar';

const BASE_URL = 'https://geocoding.oslogdev.com/v1/autocomplete'

let map = null
let SearchbarControl;
let geojsonMarker

const PopupMarker = ({ data }) => {
  const { properties } = data
  return (
    <>
      <Typography style={{ fontWeight: 'bold' }} variant="subtitle1" gutterBottom component="div">
        {properties.label}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        {properties.street ? properties.street : properties.name}
      </Typography>
    </>
  )
}


const MapSearchAddress = () => {
  let controlDraw;
  let drawnItems;
  const [openLeftDrawer, setOpenLeftDrawer] = useState(false);
  const [dataListAddress, setdataListAddress] = useState([]);

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

  // useEffect(() => {
  //   if (drawControl) {
  //     drawnItems = new L.FeatureGroup();
  //     map.addLayer(drawnItems);

  //     controlDraw = new L.Control.Draw({
  //       position: 'topright',
  //       edit: {
  //         featureGroup: drawnItems
  //       }
  //     });
  //     map.addControl(controlDraw);
  //   }
  //   return () => {
  //     controlDraw.removeFrom(map);
  //   };
  // }, [drawControl]);

  const onEachFeature = (feature, layer) => {
    // console.log({ feature, layer })
    const { properties } = feature

    layer.bindPopup(ReactDOMServer.renderToString(<PopupMarker data={feature} />), {
      maxWidth: 300
    });
  }

  const handleGetAddress = param => {
    console.log(param)
    if (geojsonMarker) map.removeLayer(geojsonMarker);
    const { geometry } = param
    let data = L.geoJSON(param);
    // L.marker(geometry.coordinates).addTo(map);
    map.fitBounds(data.getBounds());

    geojsonMarker = L.geoJSON(param, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
      },
      // filter: soffParkingFilter,
      onEachFeature: onEachFeature
    }).addTo(map);

  }

  const handleGetListAddress = (param) => {

    setdataListAddress(param)
    geojsonMarker = L.geoJSON(param, {
      pointToLayer: function (feature, latlng) {
        console.log('feature', feature)
        return L.marker(latlng)
      },
      // filter: soffParkingFilter,
      onEachFeature: onEachFeature
    }).addTo(map);
    map.fitBounds(geojsonMarker.getBounds());
  }

  const handleClickListAddress = (param) => {
    geojsonMarker = L.geoJSON(param)
    map.fitBounds(geojsonMarker.getBounds());
  }


  const handleCloseDrawer = () => {
    setOpenLeftDrawer(false)
    if (geojsonMarker) map.removeLayer(geojsonMarker);
  }

  const handleOpenDrawer = () => {
    setOpenLeftDrawer(true)
  }

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={openLeftDrawer}
        onClose={() => setOpenLeftDrawer(false)}
      >
        {/* {list(anchor)} */}
        <div style={{ width: 380, marginTop: 60, padding: 10 }}>
          <div style={{ padding: 20 }}>
            {dataListAddress.map((res, idx) => {
              const { properties } = res
              return (
                <>
                  <div className='list-address-drawer' onClick={() => handleClickListAddress(res)}>
                    <Typography style={{ fontWeight: 'bold' }} variant="subtitle1" gutterBottom component="div">
                      {properties.label}
                    </Typography>
                    <Typography variant="body2" gutterBottom component="div">
                      {properties.street ? properties.street : properties.name}
                    </Typography>

                  </div>
                  <Divider />
                </>
              )
            })}

          </div>
        </div>
      </Drawer>
      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 1201 }}>
        <SearchBarMap
          openLeftDrawer={openLeftDrawer}
          handleGetAddress={handleGetAddress}
          handleCloseDrawer={handleCloseDrawer}
          handleOpenDrawer={handleOpenDrawer}
          handleGetListAddress={handleGetListAddress}
        />
      </div>
      <div id="map" />
    </>

  );
}

export default MapSearchAddress;