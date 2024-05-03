import { Box, IconButton, Menu, TextField, Typography } from '@mui/material';
import React, { Dispatch, FC, SetStateAction } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface IconProp {
  key: string;
  icon: string;
  title: string;
  tooltip: string;
}
interface IDropdownInput {
  buttonString: string;
  setMinPrice: Dispatch<SetStateAction<number | undefined>>;
  setMaxPrice: Dispatch<SetStateAction<number | undefined>>;
  minPrice: number | undefined;
  maxPrice: number | undefined;
}

const DropdownInput: FC<IDropdownInput> = ({
  buttonString,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMinPriceChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMinPrice(Number(event.target.value));
  };

  const handleMaxPriceChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMaxPrice(Number(event.target.value));
  };

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
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-number"
            label="min price"
            type="number"
            value={minPrice}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleMinPriceChange}
          />
          <TextField
            id="outlined-number"
            label="max price"
            type="number"
            value={maxPrice}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleMaxPriceChange}
          />
        </Box>
      </Menu>
    </div>
  );
};

export default DropdownInput;
