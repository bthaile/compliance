import {
  CssBaseline,
  AppBar,
  IconButton,
  Typography,
  Divider,
  List,
  Box,
  Toolbar,
  styled,
  Drawer,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import RestoreIcon from '@mui/icons-material/Restore';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';

import { FC } from 'react';
import Image from 'next/image';

import CadenceLogo from '../../assets/img/cadencelogo.jpg';
import ScaLogo from '../../assets/img/scalogo.jpg';
import TerravalueLogo from '../../assets/img/terravaluelogo.jpg';
import useAuth from 'contexts/auth/useAuth';
import { useRouter } from 'next/router';
import { AuthActions } from 'contexts/auth/types';

const generalSidebarItems = [
  { name: 'Maps', icon: <MapIcon />, route: '/' },
  { name: 'CRP Leads', icon: <GpsFixedIcon />, route: '/crp-table' },
  { name: 'Compliance', icon: <EqualizerIcon />, route: '/compliance' },
  { name: 'CRP Calendar', icon: <CalendarMonthIcon />, route: '/crp-calendar' },
  {
    name: 'User Profile',
    icon: <ManageAccountsIcon />,
    route: '/user-profile',
  },
];

const managementSidebarItems = [
  {
    name: 'User Management',
    icon: <PeopleIcon />,
    route: '/user-management',
  },
  /* { name: 'Activity Log', icon: <RestoreIcon />, route: '/activity-log' },
  { name: 'CRP Statistics', icon: <EqualizerIcon />, route: '/crp-statistics' }, */
];

const actionSidebarItems = [{ name: 'Logout', icon: <LogoutIcon /> }];

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface ISideBar {
  open: boolean;
  handleDrawerChange: (open: boolean) => void;
}

const Sidebar: FC<ISideBar> = ({ open, handleDrawerChange }) => {
  const { dispatch } = useAuth();
  const router = useRouter();

  const handleDrawerClose = () => {
    handleDrawerChange(false);
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#00a2e8' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#00a2e8',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ backgroundColor: 'white' }}>
          <Image src={TerravalueLogo} alt="Cadence Logo" width={200} height={68} />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ color: 'white', height: '100%' }}>
          <Typography marginTop={1}>General</Typography>
          <List sx={{ backgroundColor: '#00a2e8' }}>
            {generalSidebarItems.map((item) => {
              return (
                <ListItemButton
                  key={item.name}
                  onClick={() => {
                    router.push(item.route);
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  {item.name}
                </ListItemButton>
              );
            })}
          </List>
          <Divider />
          <Typography paddingLeft={2} marginTop={1}>
            Management
          </Typography>
          <List>
            {managementSidebarItems.map((item) => {
              return (
                <ListItemButton
                  key={item.name}
                  onClick={() => {
                    router.push(item.route);
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  {item.name}
                </ListItemButton>
              );
            })}
          </List>
          <Divider />
          <List>
            {actionSidebarItems.map((item) => {
              return (
                <ListItemButton
                  key={item.name}
                  onClick={() => {
                    dispatch({
                      type: AuthActions.LOGOUT,
                    });
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  {item.name}
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
