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

interface TableComponentProps {
  columnsList: IColumnItem[];
  displayedUsers: IUser[];
  managers: IManager[];
  handleTitleChange: (user: IUser, event: React.ChangeEvent<{ value: unknown }>) => void;
  handleManagerChange: (user: IUser, event: React.ChangeEvent<{ value: unknown }>) => void;
}

interface TableComponentProps {
  columnsList: IColumnItem[];
  displayedUsers: IUser[];
  managers: IManager[];
  handleTitleChange: (user: IUser, event: React.ChangeEvent<{ value: unknown }>) => void;
  handleManagerChange: (user: IUser, event: React.ChangeEvent<{ value: unknown }>) => void;
  onRowClick: (user: IUser) => void;
}

export const TableComponent: React.FC<TableComponentProps> = ({
  columnsList,
  displayedUsers,
  managers,
  handleTitleChange,
  handleManagerChange,
  onRowClick,
}) => {
  const validateValue = (value: string, options: string[]): string => {
    return options.includes(value) ? value : '';
  };

  return (
    <TableContainer component={Paper} id="userTable">
      <Table sx={{ minWidth: 650 }} aria-label="User Management Table">
        <TableHead>
          <TableRow>
            {columnsList.filter((column) => column.enabled).map((column, index) => (
              <TableCell key={index}>{column.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedUsers.map((user, index) => (
            <TableRow key={index} onClick={() => onRowClick(user)} style={{ cursor: 'pointer' }}>
              {columnsList[0].enabled && <TableCell>{user.Name}</TableCell>}
              {columnsList[1].enabled && (
                <TableCell>
                  <Select
                    value={validateValue(user.Title || '', Object.keys(SYSTEM_ROLES))}
                    label="Title"
                    variant="standard"
                    onChange={(event) => handleTitleChange(user, event)}
                  >
                    {Object.keys(SYSTEM_ROLES).map((role, index) => (
                      <MenuItem key={index} value={role}>
                        {SYSTEM_ROLES[role as keyof typeof SYSTEM_ROLES]}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              )}
              {columnsList[2].enabled && (
                <TableCell>
                  <Select
                    value={user.MlsAreas && user.MlsAreas.length > 0 ? user.MlsAreas[0] : ''}
                    label="MLS Areas"
                    variant="standard"
                    onChange={() => { }}
                  >
                    {user.MlsAreas && user.MlsAreas.map((mls, index) => (
                      <MenuItem key={index} value={mls}>{mls}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              )}
              {columnsList[3].enabled && (
                <TableCell>
                  <Select
                    value={validateValue(user.ManagerUserId || '', managers.map((m) => m.UserId))}
                    label="Manager"
                    variant="standard"
                    onChange={(event) => handleManagerChange(user, event)}
                  >
                    {managers.map((manager, index) => (
                      <MenuItem key={index} value={manager.UserId}>{manager.Name}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              )}
              {columnsList[4].enabled && <TableCell>{user.Email}</TableCell>}
              {columnsList[5].enabled && (
                <TableCell>
                  <InputLabel>{user.AccountEnabled ? 'Yes' : 'No'}</InputLabel>
                  <Switch checked={user.AccountEnabled} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


interface AppBarComponentProps {
  openDrawer: boolean;
  handleDrawerChange: (open: boolean) => void;
  handleOpenColumns: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleRefresh: () => void;
}

export const AppBarComponent: React.FC<AppBarComponentProps> = ({
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
