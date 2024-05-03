export interface IWebSocketRequest {
  id?: string;
  status: string;
  userId?: string;
  // Record<string, never> is the {} that we might get on the back-end
  payload?: number | Record<string, never> | string;
  lat?: number;
  lon?: number;
}

export interface ICRPCalendar {
  title: string;
  start: number;
  end: number;
}

export interface ILoadCRP {
  AgentEmail: string;
  AgentPhone: string;
  AptNum: string | null;
  Assignee: string;
  AssigneeUID: string;
  CRPStatus: string;
  City: string;
  ClientAddress: string;
  ClientName: string;
  Created: string;
  CustomerType: string;
  DateLastModified: string;
  DaysOnMarket: number;
  DocumentId: string;
  Id: number;
  LMI: string;
  ListAgent: string;
  ListDate: string;
  ListPrice: number;
  Location: {
    Latitude: number;
    Longitude: number;
  };
  MLO: string;
  MLOEmail: string;
  MLOId: string;
  MLSAddress: string;
  MLSArea: string;
  MLSNumber: string;
  Notes: string;
  PropertyType: string;
  SoldDate: string;
  SoldPrice: number;
  Status: string;
  Variance: number;
  Zipcode: string;
  editing?: boolean;
  updatedNote?: string;
}

export interface ILoadMapPins {
  lat: number;
  lng: number;
  city: string;
  radiusInMiles: number;
  filters: string[];
  hideOver350K: boolean;
  soldListings: boolean;
}

export interface IAPIUserMgmtLoadManagers {
  status: string;
  payload: { UserId: string; Name: string }[];
}
