import { FC } from 'react';

export interface IToolbarButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?:
    | JSX.Element
    | JSX.Element[]
    | Array<JSX.Element | string>
    | null
    | string;
}

const ToolbarButton: FC<IToolbarButtonProps> = (props) => {
  return (
    <button
      type="button"
      className="hover:bg-stone-100 m-1 rounded-lg text-lm px-3 py-2 rounded-md"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default ToolbarButton;
