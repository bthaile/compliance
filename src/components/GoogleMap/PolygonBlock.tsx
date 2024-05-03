import { Polygon } from '@react-google-maps/api';
import { FC, useEffect, useState } from 'react';
import states from '../../assets/data/states.json';

export interface PolygonBlockProps {
  coords: google.maps.LatLng[];
}

const PolygonBlock: FC<PolygonBlockProps> = ({ coords }) => {
  const [polygonInstance, setPolygonInstance] = useState<google.maps.Polygon>();
  const [polygonPaths, setPolygonPaths] = useState<google.maps.LatLng[]>();

  const handleOnLoad = (polygon: google.maps.Polygon) => {
    setPolygonInstance(polygon);
  };

  useEffect(() => {
    if (coords) {
      setPolygonPaths(coords);
    }
  }, coords);

  return <Polygon onLoad={handleOnLoad} paths={polygonPaths} />;
};

export default PolygonBlock;
