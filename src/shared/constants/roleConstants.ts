export const realestate = "realestate";
export const loanofficer = "loanofficer";
export const areamanager = "areamanager";
export const regionalmanager = "regionalmanager";
export const seniormanager = "seniormanager";
export const tech = "tech";
export const root = "root";
export const appraiser = "appraiser";

export const LEVEL0 = [root];
export const BASE_LEVEL = [
  tech,
  root,
  seniormanager,
  regionalmanager,
  areamanager,
  loanofficer,
  realestate,
];
export const LOAN_LEVEL = [
  tech,
  root,
  seniormanager,
  regionalmanager,
  areamanager,
  loanofficer,
];
export const AREA_LEVEL = [
  tech,
  root,
  seniormanager,
  regionalmanager,
  areamanager,
];
export const REGIONAL_LEVEL = [tech, root, seniormanager, regionalmanager];
export const EXE_LEVEL = [tech, root, seniormanager];
export const TECH_LEVEL = [tech, root];
export const APPRAISER_LEVEL = [appraiser, root, tech];

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