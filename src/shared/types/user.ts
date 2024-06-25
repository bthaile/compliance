import { Dispatch, SetStateAction } from "react";

export type IUser = {
  AVMAccess: boolean;
  AccountEnabled: boolean;
  Email: string;
  ManagerName: string;
  ManagerUserId: string;
  MlsAreas: string[];
  Name: string;
  Title: string;
  UserId: string;
  bank: string,
}

export type IManager = {
  Name: string;
  UserId: string;
}

export type IActivity = {
  Time: string;
  ActionType: string;
  UserId: string;
  IPAddress: string;
}


export const SYSTEM_ROLES = {
  tech: "IT Compliance/Encompass",
  seniormanager: "Senior Management",
  regionalmanager: "Regional Manager",
  areamanager: "Area Manager",
  loanofficer: "Loan Officer",
  realestate: "Realtor/Builder",
  appraiser: "Appraiser",
  '': "No Roles",
};


export interface IColumnItem {
  name: string;
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}