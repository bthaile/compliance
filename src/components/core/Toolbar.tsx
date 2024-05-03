import { FC, ReactNode } from 'react';

export interface IToolbarItem {
  name: string;
  action: () => void;
}

export interface IToolbar {
  title: string;
  children?:
    | JSX.Element
    | JSX.Element[]
    | Array<JSX.Element | string>
    | null
    | string;
}

export const Toolbar: FC<IToolbar> = ({ title, children }) => {
  return (
    <nav className="flex mx-4">
      <div className="text-xl">{title}</div>
      <span className="mx-auto" />
      {children}
    </nav>
  );
};

export default Toolbar;
