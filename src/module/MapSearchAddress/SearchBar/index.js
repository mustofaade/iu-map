import DraftsIcon from '@mui/icons-material/Drafts';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { useState, useEffect } from 'react';
import axios from 'axios'

const BASE_URL = 'https://geocoding.oslogdev.com/v1'

const SearchBarMap = ({ handleGetAddress, handleGetListAddress, handleOpenDrawer, handleCloseDrawer, openLeftDrawer }) => {
  const [search, setSearch] = useState("");
  const [dataAddress, setDataAddress] = useState([]);

  const getdataAddress = async (endpoint, param) => {
    const URL = `${BASE_URL}/${endpoint}?text=${param}&size=5`
    const result = await axios.get(URL).then(res => res).catch(err => err.response)
    // console.log('result', result)
    if (result.status === 200) {
      const { features } = result.data
      return features
    }

    return []
  }

  useEffect(async () => {
    // getdataAddress('panorama')
    if (search.length > 2) {
      const val = await getdataAddress('autocomplete', search)
      setDataAddress(val)
    }
  }, [search]);


  const handleCLickAddress = param => {
    // console.log(param)
    handleGetAddress(param)
    setDataAddress([])
  }

  const handlePressSearch = async (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      setDataAddress([])
      handleOpenDrawer()
      // put the login here
      if (search.length > 2) {

        const val = await getdataAddress('search', search)
        handleGetListAddress(val)
      }
    }
  }

  const handleClickSearch = async () => {
    handleOpenDrawer()
    if (search.length > 2) {

      const val = await getdataAddress('search', search)
      handleGetListAddress(val)
      setDataAddress([])
    }
  }

  return (
    <>
      <Paper
        style={{ zIndex: 1201 }}
        component="form"
        sx={{
          p: '2px 4px', display: 'flex', alignItems: 'center', width: 365,
          borderBottomRightRadius: search.length > 0 && dataAddress.length > 0 ? 0 : 3,
          borderBottomLeftRadius: search.length > 0 && dataAddress.length > 0 ? 0 : 3,
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Maps"
          inputProps={{ 'aria-label': 'search maps' }}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={async () => {
            const val = await getdataAddress('autocomplete', search)
            setDataAddress(val)
          }}
          onKeyDown={handlePressSearch}
        />

        {openLeftDrawer ? (
          <IconButton onClick={() => handleCloseDrawer()} sx={{ p: '10px' }} aria-label="search">
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleClickSearch} sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        )}


        {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
              <DirectionsIcon />
            </IconButton> */}
      </Paper>
      {dataAddress.length > 0 && search.length > 0 && <Paper
        component="form"
        sx={{ width: 373, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      >
        <List dense>
          {dataAddress.map((res, idx) => {
            const { properties } = res
            return (
              <ListItem disablePadding key={idx}>
                <ListItemButton onClick={() => handleCLickAddress(res)}>
                  <ListItemIcon>
                    <PinDropIcon />
                  </ListItemIcon>
                  <ListItemText primary={properties.label} secondary={properties.street ? properties.street : properties.name} />
                </ListItemButton>
              </ListItem>
            )
          })}

        </List>
      </Paper>}
    </>

  );
}

export default SearchBarMap;