import { CSSProperties } from "react";

export type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];

export type PinMarker = {
  title: string;
  position: google.maps.LatLngLiteral;
  listingAgent: string;
  isOpen: boolean;
}

export type PinXLSX = {
  Address: string;
  AgentPhone: string;
  AgentEmail: string;
  AgentOffice: string;
  Categories: string;
  City: string;
  ListDate: string;
  ListPrice: string;
  ListingAgent: string;
  MLSNumber: string;
  MLSPropertyType: string;
  PropertyType: string;
  State: string;
  Status: string;
  ZipCode: string;
}

export type SearchRadius = {
  isOpen: boolean;
  radius: number;
  position: google.maps.LatLngLiteral;
  draggable: boolean;
  editable: boolean;
  options: CSSProperties;
}

export type Coordinate = {
  lat: number;
  lng: number;
}

export type Geometry = {
  type: string;
  coordinates: [number[]];
}

export type Property = {
  H?: string;
  I?: string;
  ID: string;
  M?: string;
  A?: string;
  X?: string;
  option?: string;
}

export type Feature = {
  type: string;
  properties: Property;
  geometry: Geometry;
}

export type FeatureCollection = {
  type: string;
  features: Feature[];
}
