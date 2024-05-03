import { Circle, InfoBox, InfoWindow } from '@react-google-maps/api';
import { CSSProperties, FC, useState, useEffect } from 'react';

export interface CircleBlockProps {
  isOpen: boolean;
  radius: number;
  position: google.maps.LatLngLiteral;
  draggable: boolean;
  editable: boolean;
  options?: google.maps.CircleOptions;
  getCircleCenter?: (position: google.maps.LatLngLiteral) => void;
  getCircleRadius?: (radius: number) => void;
}

const CircleBlock: FC<CircleBlockProps> = ({
  isOpen,
  radius,
  position,
  draggable,
  editable,
  options,
  getCircleCenter,
  getCircleRadius,
}) => {
  const [circleInstance, setCircleInstance] = useState<google.maps.Circle>();
  const [circleRadius, setCircleRadius] = useState<number>();
  const [circlePosition, setCirclePosition] =
    useState<google.maps.LatLngLiteral>();

  const handleLoad = (circle: google.maps.Circle) => {
    if (circle) {
      setCircleInstance(circle);
      setCircleRadius(radius);
      setCirclePosition(position);
    }
  };

  const handleUnmount = () => {
    setCircleInstance(undefined);
  };

  const handleCenterChange = () => {
    if (circleInstance) {
      const newLat = circleInstance.getCenter()?.lat();
      const newLng = circleInstance.getCenter()?.lng();
      if (newLat && newLng && getCircleCenter) {
        getCircleCenter({ lat: newLat, lng: newLng });
        console.log(position);
      }
    }
  };

  const handleRadiusChange = () => {
    if (circleInstance) {
      const newRadius = circleInstance.getRadius();
      if (newRadius && getCircleRadius) {
        getCircleRadius(newRadius);
      }
    }
  };

  return (
    <>
      <Circle
        radius={circleRadius}
        center={circlePosition}
        editable={editable}
        draggable={draggable}
        onCenterChanged={handleCenterChange}
        onRadiusChanged={handleRadiusChange}
        onLoad={handleLoad}
        onUnmount={handleUnmount}
        options={{ fillColor: '#FF0000' }}
      />
    </>
  );
};

export default CircleBlock;
