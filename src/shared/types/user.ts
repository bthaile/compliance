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
