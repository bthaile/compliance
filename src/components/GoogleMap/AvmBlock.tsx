import { useEffect, useState } from 'react';
import currencyFormatter from 'shared/utils/formatters';

export interface IAvm {
  status: string;
}

export interface ICensus {
  totalPersons: number;
  totPopHisOnly: number;
  totPopBlack: number;
  incomeLevel: string;
  FFIECEstMSAMD: number;
  CensusTract: number;
  minorityPopPercent: number;
  State: string;
  County: string;
}

export interface ICity {
  id: number;
  name: string;
}

export interface AvmBlockProps {
  position: {
    lat: number;
    lng: number;
  };
  addressComponents?: { long_name: string; types: string[] }[];
  census?: ICensus;
}

const AvmBlock = (props: AvmBlockProps) => {
  const [census, setCensus] = useState<ICensus>();
  const [avm, setAvm] = useState<IAvm>();
  const [incomeLevel, setIncomeLevel] = useState<string>();
  const [medianIncome, setMedianIncome] = useState<string>();
  const [minorityPercent, setMinorityPercent] = useState<string>();
  const [hispanicPercent, setHispanicPercent] = useState<string>();
  const [blackPercent, setBlackPercent] = useState<string>();

  const pStyle = {
    marginBottom: 0,
  };

  useEffect(() => {
    setCensus(props.census);
    switch (Number(props.census?.incomeLevel)) {
      case 0:
        setIncomeLevel('Not Available');
        break;
      case 1:
        setIncomeLevel('Low');
        break;
      case 2:
        setIncomeLevel('Moderate');
        break;
      case 3:
        setIncomeLevel('Middle');
        break;
      case 4:
        setIncomeLevel('Upper');
        break;

      default:
        break;
    }
    setMedianIncome(
      currencyFormatter.format(Number(props.census?.FFIECEstMSAMD)),
    );
    if (props.census?.minorityPopPercent) {
      let tempMinorityPercent = Number(props.census?.minorityPopPercent);
      if (tempMinorityPercent > 100 && tempMinorityPercent < 1000) {
        tempMinorityPercent = Number(props.census?.minorityPopPercent) / 10;
      } else if (tempMinorityPercent > 1000) {
        tempMinorityPercent = Number(props.census?.minorityPopPercent) / 100;
      }
      setMinorityPercent(
        tempMinorityPercent.toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
      );
    } else {
      setMinorityPercent('0.0');
    }
    if (props.census?.totPopHisOnly) {
      const hispanics =
        (Number(props.census?.totPopHisOnly) /
          Number(props.census?.totalPersons)) *
        100;
      setHispanicPercent(hispanics.toFixed(1).toString());
    } else {
      setHispanicPercent('0.0');
    }
    if (props.census?.totPopBlack) {
      const blacks =
        (Number(props.census?.totPopBlack) /
          Number(props.census?.totalPersons)) *
        100;
      setBlackPercent(blacks.toFixed(1).toString());
    } else {
      setBlackPercent('0.0');
    }
  }, [props.census]);

  if (census) {
    return (
      <div>
        {avm && avm.status === 'AVM_STATUS_WAITING' && (
          // TODO: Create a loading component
          <></>
        )}
        <div style={{ fontWeight: 450 }}>
          <p style={pStyle}>State: {census.State}</p>
          <p style={pStyle}>County: {census.County}</p>
          {/* <p style={pStyle}>{`Census: ${JSON.stringify(census)}`}</p> */}
          <p style={pStyle}>Income Level: {incomeLevel}</p>
          <p style={pStyle}>Median Income: {medianIncome}</p>
          <p style={pStyle}>Minority %: {minorityPercent}</p>
          <p style={pStyle}>Hispanic %: {hispanicPercent}</p>
          <p style={pStyle}>Black %: {blackPercent}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {avm && avm.status === 'AVM_STATUS_WAITING' && (
          // TODO: Create a loading component
          <></>
        )}
        <p>State: Unknown</p>
        <p>County: Unknown</p>
        <p>Census: Unknown</p>
        <p>Minority %: Unknown</p>
      </div>
    );
  }
};

export default AvmBlock;
