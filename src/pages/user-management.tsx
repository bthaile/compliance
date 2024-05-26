import {
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Switch,
  InputLabel,
  TablePagination,
  Menu,
  Box,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import Sidebar from 'components/toolbar/Sidebar';
import { NextPage } from 'next';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Socket from 'simple-websocket';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import RefreshIcon from '@mui/icons-material/Refresh';

import { IParsedResponse } from 'components/GoogleMap/MarkerBlock';
import { IManager, IUser } from 'shared/types/user';
import { SYSTEM_ROLES } from 'shared/constants/roleConstants';
import { v4 } from 'uuid';
import FieldQuery from 'components/toolbar/FieldQuery';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { CHART_TOPICS, makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import useAuth from 'contexts/auth/useAuth';
interface IColumnItem {
  name: string;
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

const UserManagement: NextPage = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [managers, setManagers] = useState<IManager[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [lenderList, setLenderList] = useState<string[]>([]);

  const [enableName, setEnableName] = useState<boolean>(true);
  const [enableTitle, setEnableTitle] = useState<boolean>(true);
  const [enableMLS, setEnableMLS] = useState<boolean>(true);
  const [enableManager, setEnableManager] = useState<boolean>(true);
  const [enableEmail, setEnableEmail] = useState<boolean>(true);
  const [enableEnabled, setEnableEnabled] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openColumns, setOpenColumns] = useState<boolean>(false);
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null);
  const [columnsAnchor, setColumnsAnchor] = useState<null | HTMLElement>(null);
  const [assignedLender, setAssignedLender] = useState<string | undefined>();

  const [nameSearch, setNameSearch] = useState<string | undefined>();
  const [titleSearch, setTitleSearch] = useState<string | undefined>();
  const [mlsSearch, setMLSSearch] = useState<string | undefined>();
  const [managerSearch, setManagerSearch] = useState<string | undefined>();
  const [emailSearch, setEmailSearch] = useState<string | undefined>();
  const { authUser } = useAuth();
  const pubSub = usePubSub();

  const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
    'wss://wss.terravalue.net:8089');

  const columnsList = [
    {
      name: 'Name',
      enabled: enableName,
      setEnabled: setEnableName,
      keyValue: 'Name',
    },
    {
      name: 'Title',
      enabled: enableTitle,
      setEnabled: setEnableTitle,
      keyValue: 'Title',
    },
    {
      name: 'MLS Areas',
      enabled: enableMLS,
      setEnabled: setEnableMLS,
      keyValue: 'MlsAreas',
    },
    /*   {
         name: 'Lender',
         enabled: assignedLender,
         setEnabled: setAssignedLender,
         keyValue: 'AssignedLender',
       },*/
    {
      name: 'Manager',
      enabled: enableManager,
      setEnabled: setEnableManager,
      keyValue: 'ManagerName',
    },
    {
      name: 'Email',
      enabled: enableEmail,
      setEnabled: setEnableEmail,
      keyValue: 'Email',
    },
    {
      name: 'Enabled',
      enabled: enableEnabled,
      setEnabled: setEnableEnabled,
      keyValue: 'AccountEnabled',
    },
  ];

  const columnsQuery = [
    {
      name: 'Name',
      active: enableName,
      setValue: setNameSearch,
      value: nameSearch,
    },
    {
      name: 'Title',
      active: enableTitle,
      setValue: setTitleSearch,
      value: titleSearch,
    },
    {
      name: 'MLS Areas',
      active: enableMLS,
      setValue: setMLSSearch,
      value: mlsSearch,
    },
    {
      name: 'Manager',
      active: enableManager,
      setValue: setManagerSearch,
      value: managerSearch,
    },
    {
      name: 'Email',
      active: enableEmail,
      setValue: setEmailSearch,
      value: emailSearch,
    },
    /* {
      name: 'Enabled',
      active: enableEnabled,
      setValue: setEnableEnabled,
      value: 'AccountEnabled',
    }, */
  ];

  console.log('lenders list', lenderList);
  useEffect(() => {
    pubSub?.subscribe(makeTopicResponse(CHART_TOPICS.LENDERS_DATA), (data) => setLenderList(data))
    if (authUser?.uid) {
      pubSub?.publish(makeTopicRequest(CHART_TOPICS.LENDERS_DATA), { topic: CHART_TOPICS.LENDERS_DATA, payload: { uid: authUser?.uid } });
    }

    return () => {
      pubSub?.unsubscribe(makeTopicResponse(CHART_TOPICS.LENDERS_DATA))
    }
  }, [authUser?.uid]);

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
          status: 'USER_MGMT_LOAD_MANAGERS',
          userId: process.env.SOCKET_USER_ID,
          payload: {},
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
      } else if (responseJSON.status === 'USER_MGMT_LOAD_MANAGERS') {
        const parsedResponse = responseJSON.payload as IManager[];
        setManagers(
          parsedResponse.sort((a, b) => a.Name.localeCompare(b.Name)),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (users.length) {
      setFilteredUsers(users);
    }
  }, [users]);

  useEffect(() => {
    if (!!users.length && !!filteredUsers.length && searchTerm) {
      const tempUserList: IUser[] = [];
      const displayedColumns = columnsList
        .filter((column) => column.enabled)
        .map((column) => column.keyValue);
      users.forEach((record) => {
        let addToList = false;
        const objectKeys = Object.keys(record).filter((key) =>
          displayedColumns.includes(key),
        );
        objectKeys.forEach((key) => {
          const recodValue = record[key as keyof IUser];
          if (recodValue?.toString().toLowerCase().includes(searchTerm)) {
            addToList = true;
          }
        });
        if (addToList) {
          tempUserList.push(record);
        }
      });
      setFilteredUsers(tempUserList);
    } else {
      if (searchTerm === '') {
        setFilteredUsers(users);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    if (filteredUsers.length) {
      const tempUsers: IUser[] = [];
      filteredUsers.forEach((user) => {
        if (
          Object.keys(SYSTEM_ROLES).filter((role) => role === user.Title).length
        ) {
          tempUsers.push(user);
        } else {
          const newUser = user;
          newUser.Title = '';
          tempUsers.push(newUser);
        }
      });
      console.log(tempUsers);
      setDisplayedUsers(
        filteredUsers.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      );
    }
  }, [filteredUsers, page, rowsPerPage]);

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open);
  };

  const refreshUsers = () => {
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
          status: 'USER_MGMT_LOAD_MANAGERS',
          userId: process.env.SOCKET_USER_ID,
          payload: {},
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
      } else if (responseJSON.status === 'USER_MGMT_LOAD_MANAGERS') {
        const parsedResponse = responseJSON.payload as IManager[];
        setManagers(
          parsedResponse.sort((a, b) => a.Name.localeCompare(b.Name)),
        );
      }
    });
  };

  const updateUserRecord = (payload) => {
    const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
      'wss://wss.terravalue.net:8089');
    socket2.on('connect', (data) => {
      console.log('connected 2');
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'USER_MGMT_UPDATE_USER',
          userId: 'iltbXdwI5fZZPji5IiYW8O2MZOG2',
          payload: payload,
        }),
      );
    });

    socket2.on('data', (data: BufferSource | undefined) => {
      console.log('socket2');
      const resp = new TextDecoder('utf-8').decode(data);
      const responseJSON: IParsedResponse = JSON.parse(resp) as IParsedResponse;
      refreshUsers();
    });
  };

  const handleTitleChange = (userRecord: IUser, event: SelectChangeEvent) => {
    const title = event.target.value;
    const payload = {
      UserId: userRecord.UserId,
      Title: title,
    };
    console.log(payload);
    updateUserRecord(payload);
  };

  const handleManagerChange = (userRecord: IUser, event: SelectChangeEvent) => {
    const managerId = event.target.value;
    const manager = managers.filter(
      (manager) => manager.UserId === managerId,
    )[0];
    const payload = {
      UserId: userRecord.UserId,
      ManagerUserId: manager.UserId,
      ManagerName: manager.Name,
    };
    console.log(payload);
    updateUserRecord(payload);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number,
  ) => {
    setPage(Number(page));
  };

  const handleRowsPerPageChange = (event: ChangeEvent) => {
    setRowsPerPage(Number(event.target.value));
  };

  const handleRefresh = () => {
    refreshUsers();
  };

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

  const handleSearchQuery = () => {
    const tempUserList: IUser[] = [];
    const queries = columnsQuery.filter(
      (column) => column.active && column.value,
    );

    users.forEach((record) => {
      let addToList = true;
      queries.forEach((query) => {
        const key = columnsList.filter(
          (column) => column.name === query.name,
        )[0].keyValue;
        if (
          !record[key as keyof IUser]
            ?.toString()
            .toLowerCase()
            .includes(query.value?.toLowerCase())
        ) {
          addToList = false;
        }
      });
      if (addToList) {
        tempUserList.push(record);
      }
    });
    setFilteredUsers(tempUserList);
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

  const handleOpenColumns = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenColumns(!openColumns);
    setColumnsAnchor(event.currentTarget);
  };

  const handleCloseColumns = () => {
    setOpenColumns(false);
  };

  const handleColumnChange = (column: IColumnItem) => {
    column.setEnabled(!column.enabled);
  };

  return (
    <div>
      <Paper>
        <div className="flex">
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
                  User Management
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
                <IconButton
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
                )}
                <FieldQuery
                  handleSearchQuery={handleSearchQuery}
                  fields={columnsQuery}
                />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => handleRefresh()}
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
              {displayedUsers &&
                displayedUsers.map((user: IUser, index) => {
                  return (
                    <TableRow
                      key={index}
                      style={{
                        marginBottom: '20px',
                      }}
                    >
                      {columnsList[0].enabled && (
                        <TableCell>{user.Name}</TableCell>
                      )}
                      {columnsList[1].enabled && (
                        <TableCell>
                          <Select
                            defaultValue={''}
                            value={user.Title ? user.Title : ''}
                            label="Title"
                            variant="standard"
                            onChange={(event) => handleTitleChange(user, event)}
                          >
                            {SYSTEM_ROLES &&
                              Object.keys(SYSTEM_ROLES).map((role, index) => {
                                return (
                                  <MenuItem key={index} value={role}>
                                    {
                                      SYSTEM_ROLES[
                                      role as keyof typeof SYSTEM_ROLES
                                      ]
                                    }
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </TableCell>
                      )}
                      {columnsList[2].enabled && (
                        <TableCell>
                          <Select
                            defaultValue={''}
                            value={''}
                            label="Title"
                            variant="standard"
                            onChange={
                              (
                                event,
                              ) => { } /* handleTitleChange(record, event) */
                            }
                          >
                            {user.MlsAreas &&
                              user.MlsAreas.map((mls, index) => {
                                return (
                                  <MenuItem key={index} value={mls}>
                                    {mls}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </TableCell>
                      )}
                      {columnsList[3].enabled && (
                        <TableCell>
                          <Select
                            defaultValue={''}
                            value={user.ManagerUserId ? user.ManagerUserId : ''}
                            label="Manager"
                            variant="standard"
                            onChange={(event) =>
                              handleManagerChange(user, event)
                            }
                          >
                            {managers &&
                              managers.map((manager, index) => {
                                return (
                                  <MenuItem key={index} value={manager.UserId}>
                                    {manager.Name}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </TableCell>
                      )}
                      {columnsList[4].enabled && (
                        <TableCell>{user.Email}</TableCell>
                      )}
                      {columnsList[5].enabled && (
                        <TableCell>
                          <InputLabel>
                            {user.AccountEnabled ? 'Yes' : 'No'}
                          </InputLabel>
                          <Switch checked={user.AccountEnabled} />
                        </TableCell>
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
          count={filteredUsers ? filteredUsers.length : rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </div>
  );
};

export default UserManagement;
