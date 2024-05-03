import { Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AlabamaFlag from 'components/core/Icons/AlabamaFlag';
import ArkansasFlag from 'components/core/Icons/ArkansasFlag';
import FloridaFlag from 'components/core/Icons/FloridaFlag';
import GeorgiaFlag from 'components/core/Icons/GeorgiaFlag';
import LouisianaFlag from 'components/core/Icons/LouisianaFlag';
import MississippiFlag from 'components/core/Icons/MississippiFlag';
import MissouriFlag from 'components/core/Icons/MissouriFlag';
import OklahomaFlag from 'components/core/Icons/OklahomaFlag';
import TennesseeFlag from 'components/core/Icons/TennesseeFlag';
import TexasFlag from 'components/core/Icons/TexasFlag';
import { FC, ReactElement, useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MassachusettsFlag from 'components/core/Icons/MassachusettsFlag';

interface State {
  city: string;
  code: string;
  stateFlag: ReactElement;
}

const flagMaxHeight = '20px';
const flagMaxWidth = '30px';

const states: State[] = [
  {
    city: 'Tyler',
    code: 'Tyler',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Houston',
    code: 'Houston2',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'San Antonio',
    code: 'SanAntonioTX',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Kerrville',
    code: 'KerrvilleTX',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Austin',
    code: 'Austin2',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Central TX',
    code: 'Central TX',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Longview',
    code: 'Longview',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Dallas',
    code: 'Dallas2',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Houston',
    code: 'Houston2',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Texarkana',
    code: 'Texarkana',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Waco',
    code: 'Waco',
    stateFlag: (
      <TexasFlag style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }} />
    ),
  },
  {
    city: 'Auburn',
    code: 'Auburn',
    stateFlag: (
      <AlabamaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Birmingham',
    code: 'Birmingham',
    stateFlag: (
      <AlabamaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Huntsville',
    code: 'Huntsville',
    stateFlag: (
      <AlabamaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Mobile',
    code: 'MobileAL',
    stateFlag: (
      <AlabamaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Tuscaloosa',
    code: 'Tuscaloosa',
    stateFlag: (
      <AlabamaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'St. Louis',
    code: 'St. Louis',
    stateFlag: (
      <MissouriFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Springfield',
    code: 'Springfield',
    stateFlag: (
      <MissouriFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Alexandria',
    code: 'Alexandria',
    stateFlag: (
      <LouisianaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Lafayette',
    code: 'Lafayette',
    stateFlag: (
      <LouisianaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Monroe',
    code: 'Monroe',
    stateFlag: (
      <LouisianaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Shreveport',
    code: 'Shreveport',
    stateFlag: (
      <LouisianaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Lake Charles',
    code: 'Lake Charles',
    stateFlag: (
      <LouisianaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Baton Rouge',
    code: 'Baton Rouge',
    stateFlag: (
      <LouisianaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Hattiesburg',
    code: 'Hattiesburg',
    stateFlag: (
      <MississippiFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Gulfport',
    code: 'Gulfport',
    stateFlag: (
      <MississippiFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Nesbit',
    code: 'Nesbit',
    stateFlag: (
      <MississippiFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Jackson',
    code: 'Jackson',
    stateFlag: (
      <MississippiFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Tupelo',
    code: 'Tupelo',
    stateFlag: (
      <MississippiFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'GoldenTriangle',
    code: 'GoldenTriangle',
    stateFlag: (
      <MississippiFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Oxford',
    code: 'Oxford',
    stateFlag: (
      <MississippiFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Central Ark',
    code: 'Central Ark',
    stateFlag: (
      <ArkansasFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Fort Smith',
    code: 'Fort Smith',
    stateFlag: (
      <ArkansasFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Hot Springs',
    code: 'Hot Springs',
    stateFlag: (
      <ArkansasFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Jonesboro',
    code: 'Jonesboro',
    stateFlag: (
      <ArkansasFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Lowell',
    code: 'Lowell',
    stateFlag: (
      <ArkansasFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Memphis',
    code: 'Memphis',
    stateFlag: (
      <TennesseeFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Chattanooga',
    code: 'Chattanooga',
    stateFlag: (
      <TennesseeFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Cleveland',
    code: 'Cleveland',
    stateFlag: (
      <TennesseeFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Nashville',
    code: 'Nashville',
    stateFlag: (
      <TennesseeFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Navarre',
    code: 'Navarre',
    stateFlag: (
      <FloridaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Stellar',
    code: 'StellarFL',
    stateFlag: (
      <FloridaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Tulsa',
    code: 'Tulsa',
    stateFlag: (
      <OklahomaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Georgia Florida',
    code: 'Georgia Florida',
    stateFlag: (
      <GeorgiaFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'BostonMA',
    code: 'BostonMA',
    stateFlag: (
      <MassachusettsFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
  {
    city: 'Massachusetts',
    code: 'Massachusetts',
    stateFlag: (
      <MassachusettsFlag
        style={{ maxHeight: flagMaxHeight, maxWidth: flagMaxWidth }}
      />
    ),
  },
];

export interface IFlagDropdown {
  onFlagClick: (code: string) => void;
}

const FlagDropdown: FC<IFlagDropdown> = ({ onFlagClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onFlagClick('merged-mls-data');
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [menuItems, setMenuItems] = useState<State[] | never[]>([]);
  const [loadList, setLoadList] = useState<boolean>(false);

  useEffect(() => {
    setMenuItems(states);
    setLoadList(true);
  }, []);

  const handleFlagClick = (code: string) => {
    onFlagClick(code);
    handleClose();
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
          Show Pins
        </Typography>
        
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
          <h4 style={{ margin: '10px' }}>Locations</h4>
          <Divider />
          <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '500px' }}>
            {menuItems &&
              menuItems.map((menuItem) => {
                return (
                  <MenuItem
                    key={menuItem.city}
                    style={{
                      flex: '1 0 30%',
                      padding: '5px',
                      maxWidth: '300px',
                    }}
                    onClick={() => handleFlagClick(menuItem.code)}
                  >
                    {menuItem.stateFlag}
                    {menuItem.city}
                  </MenuItem>
                );
              })}
          </div>
        </Menu>
      )}
    </div>
  );
};

export default FlagDropdown;
