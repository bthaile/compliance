import { Marker } from '@react-google-maps/api';
import InfoWindowBlock from './InfoWindowBlock';
import { useState } from 'react';
import { StaticImageData } from 'next/image';
import { ICensus } from './AvmBlock';
import { PinXLSX } from 'shared/types/googleMaps';
import { ILoadCRP } from 'services/types';
import { IActivity, IManager, IUser } from 'shared/types/user';

export interface IPinData {
  Address: string;
  MLSNumber: string;
  AgentOffice: string;
  ListingAgent: string;
  AgentEmail: string;
  AgentPhone: string;
  ListPrice: string;
  Categories: string[];
  Status: string;
  DaysOnMarket: string;
  ListDate: string;
  position: { lat: number; lng: number };
  Latitude: string;
  Longitude: string;
  icon: string;
}

export interface IDefaultMarker {
  position: { lat: number; lng: number };
  address: string;
  zip: number | string;
  state: string;
  city: string;
  title: string;
  rcType: string;
  icon: StaticImageData;
  phoneNumber?: string | undefined;
}

export interface IParsedResponse {
  id: string | number;
  status: string;
  payload:
    | ICensus
    | IPinData[]
    | PinXLSX[]
    | ILoadCRP[]
    | ILoadCRP
    | IUser[]
    | IManager[]
    | IActivity[];
}

interface IGoogleMarker {
  position: { lat: number; lng: number };
  icon: string;
  pinData: IPinData;
}

const MarkerBlock = (props: IGoogleMarker) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCloseInfoWindow = () => {
    setIsOpen(false);
  };

  const handleOnClick = () => {
    setIsOpen(true);
  };

  return (
    <Marker position={props.position} icon={props.icon} onClick={handleOnClick}>
      {isOpen && (
        <InfoWindowBlock
          position={props.position}
          pinData={props.pinData}
          handleClose={handleCloseInfoWindow}
        />
      )}
    </Marker>
  );
};

export default MarkerBlock;
