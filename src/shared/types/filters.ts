import { Dispatch, SetStateAction } from "react";

export interface Field {
  name: string;
  active: boolean;
  value: string | undefined;
  setValue: Dispatch<SetStateAction<string | undefined>>;
}