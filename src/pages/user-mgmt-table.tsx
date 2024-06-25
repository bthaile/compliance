import React from 'react';
import {
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  Switch,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IColumnItem, IUser, IManager, SYSTEM_ROLES } from 'shared/types/user';



interface AppBarComponentProps {
  openDrawer: boolean;
  handleDrawerChange: (open: boolean) => void;
  handleOpenColumns: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleRefresh: () => void;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  openDrawer,
  handleDrawerChange,
  handleOpenColumns,
  handleRefresh,
}) => {
  return (
    <AppBar position="sticky">
      <Toolbar style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => handleDrawerChange(!openDrawer)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ marginTop: '5px' }}>
            User Management
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <IconButton
            color="inherit"
            aria-label="open columns"
            onClick={handleOpenColumns}
            edge="start"
            style={{ marginRight: '20px' }}
          >
            <ViewColumnIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="refresh"
            onClick={handleRefresh}
            edge="start"
            style={{ marginRight: '20px' }}
          >
            <RefreshIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;