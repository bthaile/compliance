import { IconButton, Menu, Tooltip, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image, { StaticImageData } from 'next/image';

export interface IconProp {
  key: string;
  icon: StaticImageData;
  title: string;
  tooltip: string;
}
interface IDropdown {
  buttonString: string;
  itemList: IconProp[];
}

const Dropdown: FC<IDropdown> = ({ buttonString, itemList }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [menuItems, setMenuItems] = useState<IconProp[] | never[]>([]);
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
                <Tooltip
                  key={menuItem.key}
                  title={menuItem.tooltip}
                  placement="left"
                >
                  <div
                    style={{
                      wordBreak: 'break-all',
                      maxWidth: '250px',
                      flexDirection: 'row',
                    }}
                  >
                    <h5 style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                      <Image
                        src={menuItem.icon}
                        alt={menuItem.title}
                        width={30}
                        height={30}
                      />{' '}
                      {menuItem.title}
                    </h5>
                  </div>
                </Tooltip>
              );
            })}
        </Menu>
      )}
    </div>
  );
};

export default Dropdown;
