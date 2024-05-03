import type { NextPage } from 'next';
import useSocket from 'contexts/socket/useSocket';
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ILoadCRP } from 'services/types';
import {
  AppBar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
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
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Sidebar from 'components/toolbar/Sidebar';

import MenuIcon from '@mui/icons-material/Menu';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

import currencyFormatter from 'shared/utils/formatters';
import Socket from 'simple-websocket';
import { IParsedResponse } from 'components/GoogleMap/MarkerBlock';
import { v4 } from 'uuid';
import { useRouter } from 'next/router';
import moment from 'moment';
import { IUser } from 'shared/types/user';
import { utils, writeFile } from 'xlsx';
import Picker from 'shared/utils/Picker';
import FieldQuery from 'components/toolbar/FieldQuery';
import { Field } from 'shared/types/filters';

interface IColumnItem {
  name: string;
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

const crpStatusList = [
  {
    name: 'NEW',
    value: 'NEW',
  },
  {
    name: 'REJECT',
    value: 'REJECT',
  },
  {
    name: 'IN PROCESS',
    value: 'IN PROCESS',
  },
  {
    name: 'SUCCESS',
    value: 'SUCCESS',
  },
  {
    name: '3_DAYS_OLD',
    value: '3_DAYS_OLD',
  },
  {
    name: '6_DAYS_OLD',
    value: '6_DAYS_OLD',
  },
];

const CrpTable: NextPage = () => {
  const [crp, setCrp] = useState<ILoadCRP[]>([]);
  const [filteredCrp, setFilteredCrp] = useState<ILoadCRP[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [displayData, setDisplayData] = useState<ILoadCRP[]>();
  const [userList, setUserList] = useState<IUser[]>([]);
  const [enableListDate, setEnableListDate] = useState<boolean>(true);
  const [enableAssigned, setEnableAssigned] = useState<boolean>(true);
  const [enableCrp, setEnableCrp] = useState<boolean>(true);
  const [enableMLS, setEnableMLS] = useState<boolean>(true);
  const [enableCity, setEnableCity] = useState<boolean>(true);
  const [enableListPrice, setEnableListPrice] = useState<boolean>(true);
  const [enableLMI, setEnableLMI] = useState<boolean>(true);
  const [enableNotes, setEnableNotes] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openDownload, setOpenDownload] = useState<boolean>(false);
  const [openPrint, setOpenPrint] = useState<boolean>(false);
  //const [];
  const [openColumns, setOpenColumns] = useState<boolean>(false);
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null);
  const [columnsAnchor, setColumnsAnchor] = useState<null | HTMLElement>(null);

  const [crpSearch, setCrpSearch] = useState<string | undefined>();
  const [mlsSearch, setMLSSearch] = useState<string | undefined>();
  const [citySearch, setCitySearch] = useState<string | undefined>();
  const [notesSearch, setNotesSearch] = useState<string | undefined>();

  const columnsList = [
    {
      name: 'List Date',
      enabled: enableListDate,
      setEnabled: setEnableListDate,
      keyValue: 'ListDate',
    },
    {
      name: 'Assigned to',
      enabled: enableAssigned,
      setEnabled: setEnableAssigned,
      keyValue: 'Assignee',
    },
    {
      name: 'CRP Status',
      enabled: enableCrp,
      setEnabled: setEnableCrp,
      keyValue: 'CRPStatus',
    },
    {
      name: 'MLS Listed Address',
      enabled: enableMLS,
      setEnabled: setEnableMLS,
      keyValue: 'MLSAddress',
    },
    {
      name: 'City',
      enabled: enableCity,
      setEnabled: setEnableCity,
      keyValue: 'City',
    },
    {
      name: 'List Price',
      enabled: enableListPrice,
      setEnabled: setEnableListPrice,
      keyValue: 'ListPrice',
    },
    {
      name: 'LMI Categories',
      enabled: enableLMI,
      setEnabled: setEnableLMI,
      keyValue: 'LMI',
    },
    {
      name: 'Notes',
      enabled: enableNotes,
      setEnabled: setEnableNotes,
      keyValue: 'Notes',
    },
  ];

  const columnsQuery: Field[] = [
    /*  {
      name: 'List Date',
      enabled: enableListDate,
      setEnabled: setEnableListDate,
      keyValue: 'ListDate',
    }, */
    /* {
      name: 'Assigned to',
      enabled: enableAssigned,
      setEnabled: setEnableAssigned,
      keyValue: 'Assignee',
    }, */
    {
      name: 'CRP Status',
      active: enableCrp,
      setValue: setCrpSearch,
      value: crpSearch,
    },
    {
      name: 'MLS Listed Address',
      active: enableMLS,
      setValue: setMLSSearch,
      value: mlsSearch,
    },
    {
      name: 'City',
      active: enableCity,
      setValue: setCitySearch,
      value: citySearch,
    },
    /* {
      name: 'List Price',
      enabled: enableListPrice,
      setEnabled: setEnableListPrice,
      keyValue: 'ListPrice',
    }, */
    /* {
      name: 'LMI Categories',
      enabled: enableLMI,
      setEnabled: setEnableLMI,
      keyValue: 'LMI',
    }, */
    {
      name: 'Notes',
      active: enableNotes,
      setValue: setNotesSearch,
      value: notesSearch,
    },
  ];

  const [columns, setColumns] = useState<IColumnItem[]>(columnsList);

  const router = useRouter();
  const socketData = [];
  const ref = useRef(null);

  const refreshCrp = (dateToLoad: number) => {
    setLoading(true);
    const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
      'wss://wss.terravalue.net:8089');
    console.log('REQUEST CRP');

    socket2.on('connect', (data) => {
      console.log('connected 2');
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'LOAD_CRP',
          userId: 'iltbXdwI5fZZPji5IiYW8O2MZOG2',
          payload: dateToLoad || Date.now(),
        }),
      );
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'USER_MGMT_LOAD_USER',
          userId: process.env.SOCKET_USER_ID,
          payload: {},
        }),
      );
    });

    socket2.on('data', (data: BufferSource | undefined) => {
      console.log('socket2');
      const resp = new TextDecoder('utf-8').decode(data);
      const responseJSON: IParsedResponse = JSON.parse(resp) as IParsedResponse;
      if (responseJSON.status === 'LOAD_CRP') {
        const parsedResponse = responseJSON.payload as ILoadCRP[];
        setCrp(parsedResponse);
        setLoading(false);
      } else if (responseJSON.status === 'USER_MGMT_LOAD_USER') {
        const parsedResponse = responseJSON.payload as IUser[];
        setUserList(
          parsedResponse.sort((a, b) => a.Name.localeCompare(b.Name)),
        );
      }
    });
  };

  useEffect(() => {
    if (crp) {
      setFilteredCrp(crp);
    }
  }, [crp]);

  useEffect(() => {
    if (router.query.dateToLoad) {
      const currentDate = moment(Number(router.query.dateToLoad))
        .subtract(1, 'day')
        .valueOf();
      refreshCrp(currentDate);
    } else {
      refreshCrp(Date.now());
    }
  }, [router]);

  useEffect(() => {
    if (filteredCrp) {
      setDisplayData(
        filteredCrp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
      );
    }
  }, [filteredCrp]);

  useEffect(() => {
    if (!displayData?.length) {
      setLoading(false);
    }
  }, [displayData]);

  useEffect(() => {
    setDisplayData(
      filteredCrp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    );
  }, [filteredCrp, page, rowsPerPage]);

  useEffect(() => {
    if (!!crp.length && !!filteredCrp.length && searchTerm) {
      const tempCrpList: ILoadCRP[] = [];
      const displayedColumns = columnsList
        .filter((column) => column.enabled)
        .map((column) => column.keyValue);
      crp.forEach((record) => {
        let addToList = false;
        const objectKeys = Object.keys(record).filter((key) =>
          displayedColumns.includes(key),
        );
        objectKeys.forEach((key) => {
          const recodValue = record[key as keyof ILoadCRP];
          if (recodValue?.toString().toLowerCase().includes(searchTerm)) {
            addToList = true;
          }
        });
        if (addToList) {
          tempCrpList.push(record);
        }
      });
      setFilteredCrp(tempCrpList);
    } else {
      if (searchTerm === '') {
        setFilteredCrp(crp);
      }
    }
  }, [searchTerm]);

  const handleSearchQuery = () => {
    const tempCrpList: ILoadCRP[] = [];
    const queries = columnsQuery.filter(
      (column) => column.active && column.value,
    );

    console.log(queries);
    crp.forEach((record) => {
      let addToList = true;
      queries.forEach((query) => {
        const key = columnsList.filter(
          (column) => column.name === query.name,
        )[0].keyValue;
        if (
          !record[key as keyof ILoadCRP]
            ?.toString()
            .toLowerCase()
            .includes(query.value?.toLowerCase())
        ) {
          addToList = false;
        }
      });
      if (addToList) {
        tempCrpList.push(record);
      }
    });
    setFilteredCrp(tempCrpList);
  };

  const formatCrpStatus = (status: string) => {
    let bgColor = '';
    switch (status) {
      case 'NEW':
        bgColor = '#F4BC1C';
        break;
      case 'REJECT':
        bgColor = '#E53935';
        break;
      case 'IN PROCESS':
        bgColor = '#66BB6A';
        break;
      case 'SUCCESS':
        bgColor = '#CDDC39';
        break;
      case 'SOLD':
        bgColor = '#475569';
        break;
      case '3_DAYS_OLD':
        bgColor = '#E53935';
        break;
      case '6_DAYS_OLD':
        bgColor = '#E53935';
        break;
    }

    return (
      <Chip
        sx={{
          bgcolor: bgColor,
          color: 'white',
          fontWeight: 'bold',
          maxHeight: '20px',
          width: '100px',
        }}
        label={status.replace('_', ' ')}
      />
    );
  };

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open);
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

  const updateCrpRecord = (payload) => {
    const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
      'wss://wss.terravalue.net:8089');
    socket2.on('connect', (data) => {
      console.log('connected 2');
      socket2.send(
        JSON.stringify({
          id: v4().replace(/-/g, ''),
          status: 'UPDATE_CRP',
          userId: 'iltbXdwI5fZZPji5IiYW8O2MZOG2',
          payload: payload,
        }),
      );
    });

    socket2.on('data', (data: BufferSource | undefined) => {
      console.log('socket2');
      const resp = new TextDecoder('utf-8').decode(data);
      const responseJSON: IParsedResponse = JSON.parse(resp) as IParsedResponse;
      const parsedResponse = responseJSON.payload as ILoadCRP;
      const updatedCrp: ILoadCRP[] = [];
      crp.forEach((record) => {
        if (record.DocumentId === parsedResponse.DocumentId) {
          record.CRPStatus = parsedResponse.CRPStatus;
        }
        updatedCrp.push(record);
      });
      setCrp(updatedCrp);
      refreshCrp(Date.now());
    });
  };

  const handleCrpStatusChange = (
    record: ILoadCRP,
    event: SelectChangeEvent,
  ) => {
    const payload = {
      DocumentId: record.DocumentId,
      CRPStatus: event.target.value,
    };
    updateCrpRecord(payload);
  };

  const handleAssigneeChange = (record: ILoadCRP, event: SelectChangeEvent) => {
    const assigneeId = event.target.value;
    const user = userList.filter((user) => user.UserId === assigneeId)[0];
    const payload = {
      DocumentId: record.DocumentId,
      Assignee: user.Name,
      AssigneeUID: user.UserId,
    };
    updateCrpRecord(payload);
  };

  const handleNoteChange = (record: ILoadCRP, event: React.ChangeEvent) => {
    record.editing = true;
    const updatedCrpList: ILoadCRP[] = [];
    filteredCrp.forEach((oldRecord) => {
      if (oldRecord.DocumentId === record.DocumentId) {
        oldRecord.editing = true;
        oldRecord.updatedNote = event.target.value;
      }
      updatedCrpList.push(oldRecord);
    });
    setFilteredCrp(updatedCrpList);
  };

  const handleConfirmNoteChange = (record: ILoadCRP) => {
    record.editing = false;
    const payload = {
      DocumentId: record.DocumentId,
      Notes: record.updatedNote,
    };
    updateCrpRecord(payload);
  };

  const handleCancelNoteChange = (record: ILoadCRP) => {
    record.editing = false;
    const updatedCrpList: ILoadCRP[] = [];
    filteredCrp.forEach((oldRecord) => {
      if (oldRecord.DocumentId === record.DocumentId) {
        oldRecord.editing = false;
        oldRecord.updatedNote = oldRecord.Notes;
      }
      updatedCrpList.push(oldRecord);
    });
    setFilteredCrp(updatedCrpList);
  };

  const handleRefresh = () => {
    refreshCrp(Date.now());
  };

  const handlePrint = () => {
    const table = document.getElementById('crpTable')?.innerText;
    if (table) {
      window.print();
    }
  };

  const handleDownload = () => {
    if (filteredCrp.length) {
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
    }
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

  const updateColumnList = (field: string) => {
    setColumns(
      columns.map((column: IColumnItem) => {
        if (column.name === field.trim()) {
          column.enabled = !column.enabled;
        }
        return column;
      }),
    );
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
                  CRP Table
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
        <div
          style={{
            height: '93vh',
            width: '100%',
            filter: `brightness(${loading ? 0.5 : 1})`,
          }}
          id="crpTable"
        >
          <TableContainer component={Paper} sx={{ maxHeight: '94%' }}>
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
                {displayData &&
                  displayData.map((record: ILoadCRP, index) => {
                    return (
                      <TableRow
                        key={index}
                        style={{
                          marginBottom: '20px',
                        }}
                      >
                        {columnsList[0].enabled && (
                          <TableCell>
                            {
                              new Date(record.ListDate)
                                .toISOString()
                                .split('T')[0]
                            }
                          </TableCell>
                        )}
                        {columnsList[1].enabled && (
                          <TableCell>
                            <Select
                              defaultValue={''}
                              value={
                                record.AssigneeUID ? record.AssigneeUID : ''
                              }
                              label="User"
                              variant="standard"
                              onChange={(event) =>
                                handleAssigneeChange(record, event)
                              }
                            >
                              {userList &&
                                userList.map((user, index) => {
                                  return (
                                    <MenuItem key={index} value={user.UserId}>
                                      {process.env.NODE_ENV === 'development' ? user.Name.substring(0,4).padEnd(user.Name.length-4, "*") : user.Name}
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
                              labelId="demo-simple-select-label"
                              value={record.CRPStatus ? record.CRPStatus : ''}
                              label="Status"
                              variant="standard"
                              onChange={(event) =>
                                handleCrpStatusChange(record, event)
                              }
                            >
                              {crpStatusList &&
                                crpStatusList.map((status, index) => {
                                  return (
                                    <MenuItem key={index} value={status.value}>
                                      {formatCrpStatus(status.name)}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </TableCell>
                        )}
                        {columnsList[3].enabled && (
                          <TableCell>{record.ClientAddress}</TableCell>
                        )}
                        {columnsList[4].enabled && (
                          <TableCell>{record.City}</TableCell>
                        )}
                        {columnsList[5].enabled && (
                          <TableCell>
                            {currencyFormatter.format(Number(record.ListPrice))}
                          </TableCell>
                        )}
                        {columnsList[6].enabled && (
                          <TableCell>{record.LMI}</TableCell>
                        )}
                        {columnsList[7].enabled && (
                          <TableCell>
                            <TextField
                              label="Notes"
                              variant="outlined"
                              value={
                                record.editing
                                  ? record.updatedNote
                                  : record.Notes
                              }
                              onChange={(event) =>
                                handleNoteChange(record, event)
                              }
                            />
                            {record.editing && (
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  marginLeft: '20px',
                                  marginRight: '20px',
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    handleConfirmNoteChange(record)
                                  }
                                >
                                  <CheckIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleCancelNoteChange(record)}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </div>
                            )}
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
            count={filteredCrp ? filteredCrp.length : rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </Paper>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            display: 'block',
            left: '50%',
            top: '50%',
            width: '100%',
            height: '90%',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default CrpTable;
