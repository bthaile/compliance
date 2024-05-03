import {
  AppBar,
  Box,
  IconButton,
  Menu,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import Sidebar from 'components/toolbar/Sidebar';
import { NextPage } from 'next';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import RefreshIcon from '@mui/icons-material/Refresh';

import { ChangeEvent, useEffect, useState } from 'react';
import Socket from 'simple-websocket';
import { IActivity, IUser } from 'shared/types/user';
import { IParsedResponse } from 'components/GoogleMap/MarkerBlock';
import { v4 } from 'uuid';
import FieldQuery from 'components/toolbar/FieldQuery';

const ActivityLog: NextPage = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [usersMap, setUsersMap] = useState<IUser[]>([]);
  const [activityList, setActivityList] = useState<IActivity[]>([]);
  const [displayedActivities, setDisplayedActivities] = useState<IActivity[]>(
    [],
  );
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [enableTime, setEnableTime] = useState<boolean>(true);
  const [enableActionType, setEnableActionType] = useState<boolean>(true);
  const [enableUserId, setEnableUserId] = useState<boolean>(true);
  const [enableIPAddress, setEnableIPAddress] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openColumns, setOpenColumns] = useState<boolean>(false);
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null);
  const [columnsAnchor, setColumnsAnchor] = useState<null | HTMLElement>(null);

  const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
    'wss://wss.terravalue.net:8089');

  const columnsList = [
    {
      name: 'Time',
      enabled: enableTime,
      setEnabled: setEnableTime,
      keyValue: 'Time',
    },
    {
      name: 'ActionType',
      enabled: enableActionType,
      setEnabled: setEnableActionType,
      keyValue: 'ActionType',
    },
    {
      name: 'UserId',
      enabled: enableUserId,
      setEnabled: setEnableUserId,
      keyValue: 'UserId',
    },
    {
      name: 'IPAddress',
      enabled: enableIPAddress,
      setEnabled: setEnableIPAddress,
      keyValue: 'IPAddress',
    },
  ];

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open);
  };

  useEffect(() => {
    socket2.on('connect', (data) => {
      console.log('connected');
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'USER_MGMT_LOAD_USER',
          userId: process.env.SOCKET_USER_ID,
          payload: {},
        }),
      );
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'LOAD_ACTIVITY_LOG',
          userId: process.env.SOCKET_USER_ID,
          payload: 1690502400000,
        }),
      );
    });

    socket2.on('data', (data: BufferSource | undefined) => {
      console.log('socket2');
      const resp = new TextDecoder('utf-8').decode(data);
      const responseJSON: IParsedResponse = JSON.parse(resp) as IParsedResponse;
      if (responseJSON.status === 'USER_MGMT_LOAD_USER') {
        const parsedResponse = responseJSON.payload as IUser[];
        setUsers(parsedResponse.sort((a, b) => a.Name.localeCompare(b.Name)));
      } else if (responseJSON.status === 'LOAD_ACTIVITY_LOG') {
        const parsedResponse = responseJSON.payload as IActivity[];
        setActivityList(parsedResponse);
      }
    });
  }, []);

  const fetchActivities = () => {
    console.log('fetching');
    socket2.on('connect', (data) => {
      console.log('connected');
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'USER_MGMT_LOAD_USER',
          userId: process.env.SOCKET_USER_ID,
          payload: {},
        }),
      );
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'LOAD_ACTIVITY_LOG',
          userId: process.env.SOCKET_USER_ID,
          payload: 1690502400000,
        }),
      );
    });

    socket2.on('data', (data: BufferSource | undefined) => {
      console.log('socket2');
      const resp = new TextDecoder('utf-8').decode(data);
      const responseJSON: IParsedResponse = JSON.parse(resp) as IParsedResponse;
      if (responseJSON.status === 'USER_MGMT_LOAD_USER') {
        const parsedResponse = responseJSON.payload as IUser[];
        setUsers(parsedResponse.sort((a, b) => a.Name.localeCompare(b.Name)));
      } else if (responseJSON.status === 'LOAD_ACTIVITY_LOG') {
        const parsedResponse = responseJSON.payload as IActivity[];
        console.log(parsedResponse);
        setActivityList(parsedResponse);
      }
    });
  };

  useEffect(() => {
    setFilteredActivities(activityList);
  }, [activityList]);

  useEffect(() => {
    setDisplayedActivities(
      filteredActivities.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    );
  }, [filteredActivities, page, rowsPerPage]);

  useEffect(() => {
    setUsersMap(users);
  }, [users]);

  useEffect(() => {
    if (!!activityList.length && !!filteredActivities.length && searchTerm) {
      const tempActivityList: IActivity[] = [];
      const displayedColumns = columnsList
        .filter((column) => column.enabled)
        .map((column) => column.keyValue);
      activityList.forEach((record) => {
        let addToList = false;
        const objectKeys = Object.keys(record).filter((key) =>
          displayedColumns.includes(key),
        );
        objectKeys.forEach((key) => {
          const recodValue = record[key as keyof IActivity];
          if (recodValue?.toString().toLowerCase().includes(searchTerm)) {
            addToList = true;
          }
        });
        if (addToList) {
          tempActivityList.push(record);
        }
      });
      setFilteredActivities(tempActivityList);
    } else {
      if (searchTerm === '') {
        setFilteredActivities(activityList);
      }
    }
  }, [searchTerm]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number,
  ) => {
    setPage(Number(page));
  };

  const handleRowsPerPageChange = (event: ChangeEvent) => {
    setRowsPerPage(Number(event.target.value));
  };

  const handleOpenSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenSearch(!openSearch);
    setSearchAnchor(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const currentSearchTerm = event.target.value;
    setSearchTerm(currentSearchTerm.toLowerCase());
  };

  useEffect(() => {
    if (!openSearch) {
      setSearchAnchor(null);
    }
  }, [openSearch]);

  const handlePrint = () => {
    const table = document.getElementById('userTable')?.innerText;
    if (table) {
      window.print();
    }
  };

  const handleDownload = () => {
    /* if (filteredCrp.length) {
      const keys = columnsList
        .filter((column) => column.enabled)
        .map((column) => column.keyValue as keyof ILoadCRP);
      const tempCrp: ILoadCRP[] = [];
      filteredCrp.forEach((record) => {
        const filteredRecord = Picker(record, keys);
        tempCrp.push(filteredRecord);
      });
      const worksheet = utils.json_to_sheet(tempCrp);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'table Download');
      writeFile(workbook, 'TableDownload.xlsx');
    } */
  };

  const getUserMail = (activity: IActivity) => {
    if (usersMap.length) {
      console.log(usersMap);
      const tempUser = usersMap.filter((user) => user.UserId === activity.UserId)[0];
      console.log(tempUser);
      return tempUser ? tempUser.Email : activity.UserId;
    }
    return activity.UserId;
  }

  return (
    <div>
      <Paper>
        <div>
          <AppBar position="sticky">
            <Toolbar
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
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
                  Activity Log
                </Typography>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleOpenSearch}
                  edge="start"
                  style={{ marginRight: '20px' }}
                >
                  <SearchIcon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={searchAnchor}
                  open={openSearch}
                  onClose={handleCloseSearch}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 1, width: '30ch' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </Box>
                </Menu>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDownload}
                  edge="start"
                  style={{ marginRight: '20px' }}
                >
                  <CloudDownloadIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handlePrint}
                  edge="start"
                  style={{ marginRight: '20px' }}
                >
                  <PrintIcon />
                </IconButton>
                {/* <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleOpenColumns}
                  edge="start"
                  style={{ marginRight: '20px' }}
                >
                  <ViewColumnIcon />
                </IconButton>
                {!!columnsList.length && (
                  <Menu
                    id="basic-menu"
                    anchorEl={columnsAnchor}
                    open={openColumns}
                    onClose={handleCloseColumns}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    sx={{ transform: 'translateY(5%)' }}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    {columnsList &&
                      columnsList.map((column, index) => {
                        return (
                          <MenuItem key={index}>
                            <Switch
                              onChange={() => {
                                handleColumnChange(column);
                              }}
                              checked={column.enabled}
                            />
                            {column.name}
                          </MenuItem>
                        );
                      })}
                  </Menu>
                )} */}
                {/* <FieldQuery
                  handleSearchQuery={handleSearchQuery}
                  fields={columnsQuery}
                /> */}
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={fetchActivities}
                  edge="start"
                  style={{ marginRight: '20px' }}
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <Sidebar open={openDrawer} handleDrawerChange={handleDrawerChange} />
        <TableContainer component={Paper} id="userTable">
          <Table sx={{ minWidth: 650 }} aria-label="CRP Table">
            <TableHead>
              <TableRow>
                {columnsList &&
                  columnsList
                    .filter((column) => column.enabled)
                    .map((column, index) => {
                      return <TableCell key={index}>{column.name}</TableCell>;
                    })}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedActivities &&
                displayedActivities.map((activity, index) => {
                  return (
                    <TableRow
                      key={index}
                      style={{
                        marginBottom: '20px',
                      }}
                    >
                      {columnsList[0].enabled && (
                        <TableCell>{activity.Time}</TableCell>
                      )}
                      {columnsList[1].enabled && (
                        <TableCell>{activity.ActionType}</TableCell>
                      )}
                      {columnsList[2].enabled && !!usersMap.length ? (
                        <TableCell>{getUserMail(activity)}</TableCell>
                      ):
                      <TableCell>{activity.UserId}</TableCell>}
                      {columnsList[3].enabled && (
                        <TableCell>{activity.IPAddress}</TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredActivities ? filteredActivities.length : rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </div>
  );
};

export default ActivityLog;
