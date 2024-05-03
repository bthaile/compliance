import { LoadScript } from '@react-google-maps/api';
import { GoogleMap, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { Feature, FeatureCollection, Libraries } from 'shared/types/googleMaps';
import CircleBlock from './CircleBlock';
import axios from 'axios';
import { IOption } from 'components/toolbar/DropdownList';
import MarkerBlock, {
  IDefaultMarker,
  IParsedResponse,
  IPinData,
} from './MarkerBlock';
import Socket from 'simple-websocket';
import { v4 } from 'uuid';
import InfoWindowBlock from './InfoWindowBlock';
import { ICensus } from './AvmBlock';
import {
  BXS_ICON,
  CADENCE_ICON,
  SOUTH_ICON,
  DEFAULT_STATE,
  DEDHAM_ICON,
  WHITE_ICON,
  Icons,
} from 'shared/constants/googleContants';
import { MapboxGoogleOverlay } from './MapBoxGL/MapboxGoogleOverlay';
import { DEFAULTS } from './MapBoxGL/MapboxDefaults';
import { usePubSub } from 'contexts/socket/WebSocketProvider';

export interface MapProps {
  containerStyle: CSSProperties;
  apiKey: string;
  libraries: Libraries;
  mapPinList: IPinData[];
  searchRadius: boolean;
  options: IOption[];
  handleCenterChange?: (position: google.maps.LatLngLiteral) => void;
  handleRadiusChange?: (radius: number) => void;
}

const MapBlock: FC<MapProps> = ({
  containerStyle,
  apiKey,
  libraries,
  mapPinList,
  searchRadius,
  options,
  handleCenterChange,
  handleRadiusChange,
}) => {
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>();
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 30.271968,
    lng: -97.752396,
  });
  const [mapPlaces, setMapPlaces] = useState<google.maps.places.PlaceResult>();
  const [mapMarkers, setMapMarkers] = useState<IPinData[]>();
  const [displayMarkers, setDisplayMarkers] = useState<IPinData[]>();
  const [bxsMarkers, setBxsMarkers] = useState<IDefaultMarker[]>();
  const [cadeMarkers, setCadeMarkers] = useState<IDefaultMarker[]>();
  const [southMarkers, setSouthMarkers] = useState<IDefaultMarker[]>();
  const [loanMarkers, setLoanMarkers] = useState<IDefaultMarker[]>();
  const [demoMarkers, setDemoMarkers] = useState<IDefaultMarker[]>();
  const [mapInstance, setMapInstance] = useState<google.maps.Map>();
  const [searchBoxInstance, setSearchBoxInstance] =
    useState<google.maps.places.SearchBox>();
  const [mapZoom, setMapZoom] = useState<number>(8);
  const [lmiFeatures, setLmiFeatures] = useState<MapboxGoogleOverlay>();
  const [dpaFeatures, setDPAFeatures] = useState<MapboxGoogleOverlay>();
  const [hopeFeatures, setHOPEFeatures] = useState<MapboxGoogleOverlay>();
  const [atlFeatures, setATLFeatures] = useState<MapboxGoogleOverlay>();
  const [minMajFeatures, setMinMajFeatures] = useState<MapboxGoogleOverlay>();
  const [aaFeatures, setAAFeatures] = useState<MapboxGoogleOverlay>();
  const [cadeaaFeatures, setCADEAAFeatures] = useState<MapboxGoogleOverlay>();
  const [hispFeatures, setHispFeatures] = useState<MapboxGoogleOverlay>();
  const [geoJSON, setGeoJSON] = useState<FeatureCollection>();
  const [census, setCensus] = useState<ICensus>();
  const [isCensusOpen, setIsCensusOpen] = useState<boolean>(false);
  const [tileX, setTileX] = useState<number>(0);
  const [tileY, setTileY] = useState<number>(0);
  const [featureList, setFeatureList] = useState<MapboxGoogleOverlay[]>([]);

  const handleMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
  };

  const handleSearchBoxLoad = (searchBox: google.maps.places.SearchBox) => {
    setSearchBoxInstance(searchBox);
  };

  const handleBoundsChange = () => {
    if (mapInstance) {
      setMapBounds(mapInstance.getBounds());
    }
  };

  const handleUnmountMap = () => {
    setMapInstance(undefined);
  };

  const handleUnmoutSearchBox = () => {
    setSearchBoxInstance(undefined);
  };

  const handlePlacesChange = () => {
    if (searchBoxInstance) {
      const searchPlaceResult = searchBoxInstance.getPlaces();
      if (searchPlaceResult?.length) {
        setMapPlaces(searchPlaceResult[0]);
      }
    }
  };

  const getCircleCenter = (position: google.maps.LatLngLiteral) => {
    if (handleCenterChange) {
      handleCenterChange(position);
    }
  };

  const getCircleRadius = (radius: number) => {
    if (handleRadiusChange) {
      handleRadiusChange(radius);
    }
  };

  const handleZoomChange = () => {
    if (mapInstance) {
      const zoom = mapInstance.getZoom();
      if (zoom) {
        setMapZoom(zoom);
      }
    }
  };

  const handleCensusCloseWindow = () => {
    setIsCensusOpen(false);
  };

  useEffect(() => {
    if (options && mapInstance) {
      const tempFeatureList = featureList;
      console.log('INCLUDING LIST');
      console.log(mapInstance.overlayMapTypes);
      options.forEach((option: IOption) => {
        switch (option.name) {
          case 'LMI': {
            if (option.active) {
              if (!lmiFeatures) {
                const lmiTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.lmistyle,
                });
                lmiTemp.addToMap(mapInstance);
                setLmiFeatures(lmiTemp);
              }
            } else {
              if (lmiFeatures) lmiFeatures.removeFromMap(mapInstance);
              setLmiFeatures(undefined);
            }
            break;
          }
          case 'Minority': {
            if (option.active) {
              if (!minMajFeatures) {
                const minTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.majminstyle,
                });
                minTemp.addToMap(mapInstance);
                setMinMajFeatures(minTemp);
              }
            } else {
              if (minMajFeatures) minMajFeatures.removeFromMap(mapInstance);
              setMinMajFeatures(undefined);
            }
            break;
          }
          case 'HISP': {
            if (option.active) {
              if (!hispFeatures) {
                const hispTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.hispstyle,
                });
                hispTemp.addToMap(mapInstance);
                setHispFeatures(hispTemp);
              }
            } else {
              if (hispFeatures) hispFeatures.removeFromMap(mapInstance);
              setHispFeatures(undefined);
            }
            break;
          }
          case 'AA': {
            if (option.active) {
              if (!aaFeatures) {
                const aaTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.aastyle,
                });
                aaTemp.addToMap(mapInstance);
                setAAFeatures(aaTemp);
              }
            } else {
              if (aaFeatures) aaFeatures.removeFromMap(mapInstance);
              setAAFeatures(undefined);
            }
            break;
          }
          case 'DPA': {
            if (option.active) {
              if (!dpaFeatures) {
                const dpaTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.dpastyle,
                });
                dpaTemp.addToMap(mapInstance);
                setDPAFeatures(dpaTemp);
              }
            } else {
              if (dpaFeatures) dpaFeatures.removeFromMap(mapInstance);
              setDPAFeatures(undefined);
            }
            break;
          }
          case 'HOPE FOCUS': {
            if (option.active) {
              if (!hopeFeatures) {
                const hopeTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.assessmentminstyle,
                });
                hopeTemp.addToMap(mapInstance);
                setHOPEFeatures(hopeTemp);
              }
            } else {
              if (hopeFeatures) hopeFeatures.removeFromMap(mapInstance);
              setHOPEFeatures(undefined);
            }
            break;
          }
          case 'ATL-MEM': {
            if (option.active) {
              if (!atlFeatures) {
                const atlTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.atlmemstyle,
                });
                atlTemp.addToMap(mapInstance);
                setATLFeatures(atlTemp);
              }
            } else {
              if (atlFeatures) atlFeatures.removeFromMap(mapInstance);
              setATLFeatures(undefined);
            }
            break;
          }
          case 'CADE AA': {
            if (option.active) {
              if (!cadeaaFeatures) {
                const cadeaaTemp = new MapboxGoogleOverlay({
                  style: DEFAULTS.assessmentstyle,
                });
                cadeaaTemp.addToMap(mapInstance);
                setCADEAAFeatures(cadeaaTemp);
              }
            } else {
              if (cadeaaFeatures) cadeaaFeatures.removeFromMap(mapInstance);
              setCADEAAFeatures(undefined);
            }
            break;
          }

          case 'CADE': {
            if (option.active) {
              const tempBXS: IDefaultMarker[] = [];
              const tempCade: IDefaultMarker[] = [];
              DEFAULT_STATE.forEach((location: IDefaultMarker) => {
                if (location.icon === Icons[CADENCE_ICON]) {
                  tempCade.push(location);
                }
                if (location.icon === Icons[BXS_ICON]) {
                  tempBXS.push(location);
                }
              });
              setCadeMarkers(tempCade);
              setBxsMarkers(tempBXS);
            } else {
              setCadeMarkers([]);
              setBxsMarkers([]);
            }
            break;
          }
          case 'SOUTHSTAR': {
            if (option.active) {
              const tempSOUTH: IDefaultMarker[] = [];

              DEFAULT_STATE.forEach((location: IDefaultMarker) => {
                if (location.icon === Icons[SOUTH_ICON]) {
                  tempSOUTH.push(location);
                }
              });

              setSouthMarkers(tempSOUTH);
            } else {
              setSouthMarkers([]);
            }
            break;
          }
          case 'DEMO': {
            if (option.active) {
              const tempDEMO: IDefaultMarker[] = [];

              DEFAULT_STATE.forEach((location: IDefaultMarker) => {
                if (location.icon === Icons[DEDHAM_ICON]) {
                  tempDEMO.push(location);
                }
              });

              setDemoMarkers(tempDEMO);
            } else {
              setDemoMarkers([]);
            }
            break;
          }
          case 'Loan': {
            if (option.active) {
              const tempLoan: IDefaultMarker[] = [];

              DEFAULT_STATE.forEach((location: IDefaultMarker) => {
                if (location.icon === Icons[WHITE_ICON]) {
                  tempLoan.push(location);
                }
              });

              setLoanMarkers(tempLoan);
            } else {
              setLoanMarkers([]);
            }
            break;
          }
        }
      });

      setFeatureList(tempFeatureList);

      if (!mapMarkers?.length) {
        setDisplayMarkers([]);
      }
    }
  }, [geoJSON, options, mapMarkers]);

  useEffect(() => {
    const tempMarkers = mapMarkers;
    const tempDisplayMarkers: IPinData[] = [];

    const optionList = options
      .filter((option) => option.active)
      .map((option) => option.name);

    if (tempMarkers?.length) {
      tempMarkers.forEach((marker) => {
        optionList.forEach((option) => {
          if (marker.Categories.includes(option)) {
            tempDisplayMarkers.push(marker);
          }
        });
      });
      if (tempDisplayMarkers.length) {
        setDisplayMarkers(tempDisplayMarkers);
      } else {
        setDisplayMarkers(mapMarkers);
      }
    }
  }, [options, mapMarkers]);

  useEffect(() => {
    setMapMarkers(mapPinList);
  }, [mapPinList]);

  useEffect(() => {
    if (mapPlaces) {
      const lat = mapPlaces.geometry?.location?.lat();
      const lng = mapPlaces.geometry?.location?.lng();
      const viewport = mapPlaces.geometry?.viewport;
      if (lat && lng && viewport && mapInstance) {
        setMapCenter({ lat: lat, lng: lng });
        mapInstance.fitBounds(viewport);
      }

      const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ?? 'wss://wss.terravalue.net:8089');

      const id = v4().replace(/-/g, '');

      socket2.on('connect', (data) => {
        console.log('connected');
        socket2.send(
          JSON.stringify({
            status: 'GET_CENSUS',
            lat: Number(lat),
            lon: Number(lng),
          }),
        );
      });

      socket2.on('data', (data: BufferSource | undefined) => {
        console.log('socket2');
        const resp = new TextDecoder('utf-8').decode(data);
        console.log(resp);
        const parsedResponse: IParsedResponse = JSON.parse(
          resp,
        ) as IParsedResponse;
        if (parsedResponse.payload) {
          const censusData: ICensus = parsedResponse.payload as ICensus;
          setCensus(censusData);
        }
      });
    }
  }, [mapPlaces, mapInstance]);

  useEffect(() => {
    if (census && mapPlaces) {
      setIsCensusOpen(true);
    }
  }, [census, mapPlaces]);



  const subPub = usePubSub();
  subPub.subscribe('GET_CENSUS_RECEIVE', (data: any) => {
    console.log('CENSUS DATA');
    console.log(data);
  });

  subPub.publish('GET_CENSUS_SEND',
    {
      status: 'GET_CENSUS',
      lat: Number(30.2672),
      lon: Number(97.7431),
    })

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <StandaloneSearchBox
        onPlacesChanged={handlePlacesChange}
        onLoad={handleSearchBoxLoad}
        onUnmount={handleUnmoutSearchBox}
      >
        <input
          type="text"
          placeholder="Search for a place ..."
          style={{
            position: 'absolute',
            zIndex: 1,
            left: '200px',
            top: '-17px',
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `30%`,
            height: `40px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={mapZoom}
        center={mapCenter}
        onZoomChanged={handleZoomChange}
        onLoad={handleMapLoad}
        onUnmount={handleUnmountMap}
      >
        {mapPlaces &&
          census &&
          isCensusOpen &&
          mapPlaces.address_components?.length && (
            <InfoWindowBlock
              position={mapCenter}
              census={census}
              title={mapPlaces.address_components[0].long_name}
              content={`
            ${mapPlaces.address_components[0].long_name}, 
            ${mapPlaces.address_components[3]
                  ? mapPlaces.address_components[2]?.short_name
                  : mapPlaces.address_components[1]?.short_name
                }, 
            ${mapPlaces.address_components[3]?.short_name ||
                mapPlaces.address_components[2]?.short_name
                }`}
              handleClose={handleCensusCloseWindow}
            />
          )}
        {searchRadius && (
          <CircleBlock
            isOpen={true}
            draggable={true}
            editable={true}
            position={mapCenter}
            radius={10000}
            getCircleCenter={getCircleCenter}
            getCircleRadius={getCircleRadius}
          />
        )}
        {displayMarkers &&
          displayMarkers.map((marker, index) => {
            return (
              <MarkerBlock
                key={index}
                position={marker.position}
                icon={marker.icon}
                pinData={marker}
              />
            );
          })}
        {bxsMarkers &&
          bxsMarkers.map((marker, index) => {
            return (
              <Marker
                key={index}
                icon={marker.icon.src}
                position={marker.position}
              />
            );
          })}
        {cadeMarkers &&
          cadeMarkers.map((marker, index) => {
            return (
              <Marker
                key={index}
                icon={marker.icon.src}
                position={marker.position}
              />
            );
          })}
        {southMarkers &&
          southMarkers.map((marker, index) => {
            return (
              <Marker
                key={index}
                icon={marker.icon.src}
                position={marker.position}
              />
            );
          })}
        {demoMarkers &&
          demoMarkers.map((marker, index) => {
            return (
              <Marker
                key={index}
                icon={marker.icon.src}
                position={marker.position}
              />
            );
          })}
        {loanMarkers && loanMarkers.map((marker, index) => {
          return (
            <Marker
              key={index}
              icon={marker.icon.src}
              position={marker.position}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapBlock;
