import { InfoWindow } from '@react-google-maps/api';
import AvmBlock, { ICensus } from './AvmBlock';
import { IPinData } from './MarkerBlock';
import currencyFormatter from 'shared/utils/formatters';

export interface IGoogleInfoWindow {
  title?: string;
  content?: string;
  position: {
    lat: number;
    lng: number;
  };
  census?: ICensus;
  pinData?: IPinData;
  handleClose: () => void;
}

export const InfoWindowBlock = (props: IGoogleInfoWindow) => {
  let content = (
    <div style={{ fontWeight: 600 }}>
      {props.title}
      <div style={{ fontWeight: 400 }}>{props.content}</div>
    </div>
  );

  const censusContent = (
    <div style={{ fontWeight: 600 }}>
      {props.title}
      <div style={{ fontWeight: 400 }}>{props.content}</div>

      {props.position && props.census && (
        <AvmBlock census={props.census} position={props.position} />
      )}
    </div>
  );

  const pStyle = {
    marginBottom: 0,
  };

  const markerContent = (
    <div style={{ fontWeight: 450 }}>
      <p style={pStyle}>{props.pinData?.Address}</p>
      <p style={pStyle}>MLS Number: {props.pinData?.MLSNumber}</p>
      <p style={pStyle}>Office: {props.pinData?.AgentOffice}</p>
      <p style={pStyle}>Listing Agent: {props.pinData?.ListingAgent}</p>
      <p style={pStyle}>Email: {props.pinData?.AgentEmail}</p>
      <p style={pStyle}>Phone: {props.pinData?.AgentPhone}</p>
      <p style={pStyle}>
        Listing Price:{' '}
        {currencyFormatter.format(Number(props.pinData?.ListPrice))}
      </p>
      <p style={pStyle}>Categories: {props.pinData?.Categories.join(', ')}</p>
      <p style={pStyle}>Status: {props.pinData?.Status}</p>
      <p style={pStyle}>Days On Market: {props.pinData?.DaysOnMarket}</p>
      <p style={pStyle}>List Date: {props.pinData?.ListDate.split('T')[0]}</p>
    </div>
  );

  if (props.census) {
    content = censusContent;
  } else if (props.pinData) {
    content = markerContent;
  }

  return (
    <InfoWindow position={props.position} onCloseClick={props.handleClose}>
      {content}
    </InfoWindow>
  );
};

export default InfoWindowBlock;
