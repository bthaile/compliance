import { IconButton, Menu, MenuItem, Switch, Typography } from '@mui/material';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface IOption {
  name: string;
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
}
interface IDropdownList {
  buttonString: string;
  title: string;
  itemList: IOption[];
}

const DropdownList: FC<IDropdownList> = ({ buttonString, itemList }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (item: IOption) => {
    item.setActive(!item.active);
  };

  const [menuItems, setMenuItems] = useState<IOption[] | never[]>([]);
  const [loadList, setLoadList] = useState<boolean>(false);

  useEffect(() => {
    setMenuItems(itemList);
    setLoadList(true);
  }, [itemList]);

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Typography
          variant="caption"
          noWrap
          sx={{ flexGrow: 1 }}
          component="div"
          color="white"
        >
          {buttonString}
        </Typography>
        <KeyboardArrowDownIcon />
      </IconButton>
      {loadList && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {menuItems &&
            menuItems.map((menuItem) => {
              return (
                <MenuItem key={menuItem.name} disabled={menuItem.disabled}>
                  <Switch
                    onChange={() => {
                      handleChange(menuItem);
                    }}
                    checked={menuItem.active}
                  />
                  {menuItem.name}
                </MenuItem>
              );
            })}
        </Menu>
      )}
    </div>
  );
};

export default DropdownList;
