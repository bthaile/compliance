import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import React from 'react';
import Sidebar from 'components/toolbar/Sidebar';
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItemButton,
  Typography,
  Alert,
  Stack,
  Box,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import DropdownList, { IOption } from 'components/toolbar/DropdownList';
import FlagDropdown from 'components/toolbar/FlagDropdown';
import Socket from 'simple-websocket';
import MapBlock from 'components/GoogleMap/MapBlock';
import { Libraries, PinXLSX } from 'shared/types/googleMaps';
import useSocket from 'contexts/socket/useSocket';
import { IParsedResponse, IPinData } from 'components/GoogleMap/MarkerBlock';
import Dropdown from 'components/toolbar/Dropdown';
import { LegendItems } from 'shared/constants/googleContants';
import DropdownInput from 'components/toolbar/DropdownInput';
import SupportDialog from 'components/core/SupportDialog';
import axios from 'axios';
import { utils, writeFile } from 'xlsx';

const Home: NextPage = () => {
  const [searchRadius, setSearchRadius] = useState(false);
  const [lmi, setLMI] = useState(false);
  const [minority, setMinority] = useState(false);
  const [aa, setAA] = useState(false);
  const [hope, setHOPE] = useState(false);
  const [dpa, setDPA] = useState(false);
  const [atl, setATL] = useState(false);
  const [cadeaa, setCADEAA] = useState(false);
  const [hisp, setHisp] = useState(false);
  const [branches, setBranches] = useState(false);
  const [loanActivity, setLoanActivity] = useState(false);

  const [rightAtHome, setRightAtHome] = useState(false);
  const [cade, setCADE] = useState(false);
  const [south, setSOUTH] = useState(false);
  const [demo, setDEMO] = useState(false);
  const [loan, setLoan] = useState(false);
  const [cogent, setCogent] = useState(false);
  const [regions, setRegions] = useState(false);
  const [regionsBranches, setRegionsBranches] = useState(false);
  const [pinnacleBranches, setPinnacleBranches] = useState(false);
  const [memphisMinority, setMemphisMinority] = useState(false);
  const [memphisAA, setMemphisAA] = useState(false);

  const [crp, setCRP] = useState(false);

  const apiKey = 'AIzaSyCWedJRxOp8nbE5hZhAxS43oDgCHGvGB-0';
  const libraries: Libraries = ['places'];

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [radiusAlert, setRadiusAlert] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [mapPins, setMapPins] = useState<IPinData[]>([]);
  const [xlsxPinsData, setXlsxPinsData] = useState<PinXLSX[]>([]);

  const [currentRadius, setCurrentRadius] = useState<number>();
  const [currentCenter, setCurrentCenter] =
    useState<google.maps.LatLngLiteral>();

  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [supportDialogOpen, setSupportDialogOpen] = useState<boolean>(false);

  const options: IOption[] = [
    {
      name: 'Search Radius',
      active: searchRadius,
      setActive: setSearchRadius,
      disabled: false,
    },
    { name: 'AA', active: aa, setActive: setAA, disabled: false },
    { name: 'LMI', active: lmi, setActive: setLMI, disabled: false },
    {
      name: 'Minority',
      active: minority,
      setActive: setMinority,
      disabled: false,
    },
    { name: 'HISP', active: hisp, setActive: setHisp, disabled: false },
    { name: 'Branches', active: branches, setActive: setBranches, disabled: false },
    { name: 'Loan Activity', active: loanActivity, setActive: setLoanActivity, disabled: false },

    /* {
      name: 'Right@Homes',
      active: rightAtHome,
      setActive: setRightAtHome,
      disabled: true,
    }, */
    { name: 'DPA', active: dpa, setActive: setDPA, disabled: false },
    { name: 'ATL-MEM', active: atl, setActive: setATL, disabled: false },
    { name: 'CADE', active: cade, setActive: setCADE, disabled: false },
    { name: 'CADE AA', active: cadeaa, setActive: setCADEAA, disabled: false },
    // { name: 'SOUTHSTAR', active: south, setActive: setSOUTH, disabled: false },
    { name: 'Cadence Pins', active: loan, setActive: setLoan, disabled: false },
    { name: 'Regions Pins', active: regions, setActive: setRegions, disabled: false },
    { name: 'Pinnacle Pins', active: cogent, setActive: setCogent, disabled: false },
    { name: 'Regions Branches', active: regionsBranches, setActive: setRegionsBranches, disabled: false },
    { name: 'Pinnacle Branches', active: pinnacleBranches, setActive: setPinnacleBranches, disabled: false },
    { name: 'Memphis Minority', active: memphisMinority, setActive: setMemphisMinority, disabled: false },
    { name: 'Memphis AA', active: memphisAA, setActive: setMemphisAA, disabled: false },
    { name: 'DEMO', active: demo, setActive: setDEMO, disabled: false },
    // { name: 'HOPE FOCUS', active: hope, setActive: setHOPE, disabled: false },
    // { name: 'CRP', active: crp, setActive: setCRP, disabled: true },
  ];

  const requestMapPins = (code: string) => {
    if (searchRadius && currentCenter && currentRadius && code) {
      setMapPins([]);
      setLoading(true);

      const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
        'wss://wss.terravalue.net:8089');

      socket2.on('connect', (data) => {
        console.log('connected');
        socket2.send(
          JSON.stringify({
            id: process.env.SOCKET_ID,
            status: 'ADD_MAP_PINS',
            userId: process.env.SOCKET_USER_ID,
            payload: {
              lat: currentCenter.lat,
              lng: currentCenter.lng,
              city: code,
              radiusInMiles: currentRadius * 0.0006213712, // Convert meters to miles
              filters: 0,
              hideOver350K: false,
              soldListings: false,
              minPrice: minPrice,
              maxPrice: maxPrice,
            },
          }),
        );
      });

      socket2.on('data', (data: BufferSource | undefined) => {
        console.log('socket2');
        const resp = new TextDecoder('utf-8').decode(data);
        if (resp) {
          const responseJSON: IParsedResponse = JSON.parse(
            resp,
          ) as IParsedResponse;
          const parsedResponse = responseJSON.payload as IPinData[];
          console.log(parsedResponse);
          const markerList: IPinData[] = [];
          const xlsxDataList: PinXLSX[] = [];
          const xlsxPins = responseJSON.payload as PinXLSX[];
          xlsxPins.forEach((pin: PinXLSX) => {
            xlsxDataList.push({
              Address: pin.Address,
              AgentPhone: pin.AgentPhone,
              AgentEmail: pin.AgentEmail,
              AgentOffice: pin.AgentOffice,
              Categories: pin.Categories,
              City: pin.City,
              ListDate: pin.ListDate,
              ListPrice: pin.ListPrice,
              ListingAgent: pin.ListingAgent,
              MLSNumber: pin.MLSNumber,
              MLSPropertyType: pin.MLSPropertyType,
              PropertyType: pin.PropertyType,
              State: pin.State,
              Status: pin.Status,
              ZipCode: pin.ZipCode,
            });
          });
          parsedResponse.forEach((item: IPinData) => {
            let markerIcon = '';
            if (item.Categories.includes('LMI')) {
              if (
                (code === 'Austin2' ||
                  code === 'Houston2' ||
                  code === 'Dallas2' ||
                  code === 'Nashville') &&
                Number(item.ListPrice) <= 647200
              ) {
                markerIcon = LegendItems.filter(
                  (item) => item.key === 'blue',
                )[0].icon.src;
              } else if (Number(item.ListPrice) >= 425000) {
                markerIcon = LegendItems.filter(
                  (item) => item.key === 'green',
                )[0].icon.src;
              }
            } else {
              if (Number(item.ListPrice) < 425000) {
                markerIcon = LegendItems.filter(
                  (item) => item.key === 'white',
                )[0].icon.src;
              } else if (Number(item.ListPrice) >= 425000) {
                markerIcon = LegendItems.filter((item) => item.key === 'red')[0]
                  .icon.src;
              }
            }

            markerList.push({
              Address: item.Address,
              MLSNumber: item.MLSNumber,
              AgentOffice: item.AgentOffice,
              ListingAgent: item.ListingAgent,
              AgentEmail: item.AgentEmail,
              AgentPhone: item.AgentPhone,
              ListPrice: item.ListPrice,
              Categories: item.Categories,
              Status: item.Status,
              DaysOnMarket: item.DaysOnMarket,
              ListDate: item.ListDate,
              position: {
                lat: Number(item.Latitude),
                lng: Number(item.Longitude),
              },
              Latitude: item.Latitude,
              Longitude: item.Longitude,
              icon: markerIcon,
            });
          });
          setXlsxPinsData(xlsxDataList);
          setMapPins(markerList);
        }
        setLoading(false);
      });
    } else {
      setRadiusAlert(true);
      setTimeout(() => {
        setRadiusAlert(false);
      }, 3000);
    }
  };

  const handleCenterChange = (position: google.maps.LatLngLiteral) => {
    if (position) {
      setCurrentCenter(position);
    }
  };

  const handleRadiusChange = (radius: number) => {
    if (radius) {
      setCurrentRadius(radius);
    }
  };

  const handleOpenSupportDialog = () => {
    setSupportDialogOpen(true);
  };

  const handleCloseSupportDialog = () => {
    setSupportDialogOpen(false);
  };

  useEffect(() => {
    console.log(mapPins);
  }, [mapPins]);

  const handleDrawerChange = (openDrawer: boolean) => {
    setDrawerOpen(openDrawer);
  };

  const clearPins = () => {
    setMapPins([]);
  };

  const downloadListings = () => {
    if (xlsxPinsData.length) {
      const worksheet = utils.json_to_sheet(xlsxPinsData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Listings');
      writeFile(workbook, 'Listings.xlsx');
    } else {
      setRadiusAlert(true);
      setTimeout(() => {
        setRadiusAlert(false);
      }, 3000);
    }
  };

  return (
    <div className="flex">
      <AppBar position="sticky">
        <Toolbar style={{ margin: '0', maxHeight: '50px' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => handleDrawerChange(!drawerOpen)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <List style={{ display: 'flex' }}>
            <ListItemButton key={'options'}>
              <DropdownList
                buttonString="Options"
                title="Options"
                itemList={options}
              />
            </ListItemButton>

            <ListItemButton>
              <DropdownInput
                buttonString="Price"
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
              />
            </ListItemButton>
            <ListItemButton key={'flags'}>
              <FlagDropdown onFlagClick={requestMapPins} />
            </ListItemButton>
            <ListItemButton>
              <Dropdown buttonString="Legend" itemList={LegendItems} />
            </ListItemButton>
            <ListItemButton key={'clearPins'} onClick={clearPins}>
              <Typography
                variant="caption"
                noWrap
                sx={{ flexGrow: 1 }}
                component="div"
                color="white"
              >
                Clear
              </Typography>
            </ListItemButton>
            <ListItemButton onClick={downloadListings}>
              <Typography
                variant="caption"
                noWrap
                sx={{ flexGrow: 1, textDecoration: 'none' }}
                component="div"
                color="white"
              >
                Download
              </Typography>
            </ListItemButton>
            <ListItemButton>
              <Typography
                variant="caption"
                noWrap
                sx={{ flexGrow: 1 }}
                component="div"
                color="white"
                onClick={handleOpenSupportDialog}
              >
                Support
              </Typography>
            </ListItemButton>
          </List>
        </Toolbar>
      </AppBar>
      <Sidebar open={drawerOpen} handleDrawerChange={handleDrawerChange} />
      <SupportDialog
        isOpen={supportDialogOpen}
        onClose={handleCloseSupportDialog}
      />
      <div
        style={{
          height: '92vh',
          width: '100%',
          filter: `brightness(${loading ? 0.5 : 1})`,
        }}
      >
        <MapBlock
          apiKey={apiKey}
          libraries={libraries}
          containerStyle={{ width: '100%', height: '100%' }}
          mapPinList={mapPins}
          options={options}
          searchRadius={searchRadius}
          handleCenterChange={handleCenterChange}
          handleRadiusChange={handleRadiusChange}
        />

        {radiusAlert && (
          <Stack
            sx={{
              width: '30%',
              position: 'fixed',
              display: 'block',
              top: '90%',
              left: '40%',
            }}
            spacing={2}
          >
            <Alert
              onClose={() => {
                setRadiusAlert(false);
              }}
              severity="warning"
            >
              Radius is not set!
            </Alert>
          </Stack>
        )}
      </div>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            display: 'block',
            left: '50%',
            top: '50%',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default Home;
