import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { Paper, Menu, Box, MenuItem, Switch, ListItemIcon } from '@mui/material';
import { NextPage } from 'next';
import Sidebar from 'components/toolbar/Sidebar';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { CHART_TOPICS, makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import useAuth from 'contexts/auth/useAuth';
import { WebSocketService } from './user-mgmt-ws';
import { AppBarComponent } from './user-mgmt-table';
import { IUser, IManager, IColumnItem, SYSTEM_ROLES } from 'shared/types/user';
import UserEditModal from './user-mgmt-user-edit';
import UserTable from './user-mgmt-user-table';
import { v4 } from 'uuid';

const UserManagement: NextPage = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [managers, setManagers] = useState<IManager[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [openColumns, setOpenColumns] = useState<boolean>(false);
  const [columnsAnchor, setColumnsAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mlsAreas, setMlsAreas] = useState<string[]>(['Area 1', 'Area 2', 'Area 3']);
  const { authUser } = useAuth();
  const pubSub = usePubSub();

  const socketService = new WebSocketService(
    process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ?? 'wss://wss.terravalue.net:8089'
  );

  const initialColumnsList: IColumnItem[] = [
    { name: 'Name', enabled: true, setEnabled: (val) => { } },
    { name: 'Title', enabled: true, setEnabled: (val) => { } },
    { name: 'MLS Areas', enabled: true, setEnabled: (val) => { } },
    { name: 'Manager', enabled: true, setEnabled: (val) => { } },
    { name: 'Email', enabled: true, setEnabled: (val) => { } },
    { name: 'Enabled', enabled: true, setEnabled: (val) => { } },
  ];

  const [columnsList, setColumnsList] = useState<IColumnItem[]>(initialColumnsList);

  useEffect(() => {
    socketService.connect();

    socketService.onMessage((response) => {
      if (response.status === 'USER_MGMT_LOAD_USER') {
        const usersData = response.payload as IUser[];
        setUsers(usersData.sort((a, b) => a.Name.localeCompare(b.Name)));
      } else if (response.status === 'USER_MGMT_LOAD_MANAGERS') {
        const managersData = response.payload as IManager[];
        setManagers(managersData.sort((a, b) => a.Name.localeCompare(b.Name)));
      }
    });
  }, []);

  useEffect(() => {
    if (users.length) {
      setFilteredUsers(users);
    }
  }, [users]);

  useEffect(() => {
    if (filteredUsers.length) {
      const displayedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setDisplayedUsers(displayedUsers);
    }
  }, [filteredUsers, page, rowsPerPage]);

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open);
  };

  const refreshUsers = () => {
    socketService.connect();
  };

  const updateUserRecord = (userId: string, updatedFields: Partial<IUser>) => {
    socketService.send({
      id: v4().replace(/-/g, ''),
      status: 'USER_MGMT_UPDATE_USER',
      userId: process.env.SOCKET_USER_ID,
      payload: { UserId: userId, ...updatedFields },
    });

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.UserId === userId ? { ...user, ...updatedFields } : user
      )
    );
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenColumns = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnsAnchor(event.currentTarget);
    setOpenColumns(true);
  };

  const handleCloseColumns = () => {
    setOpenColumns(false);
  };

  const handleColumnChange = (column: IColumnItem) => {
    console.log('column', column)
    setColumnsList((prevColumns) =>
      prevColumns.map((col) =>
        col.name === column.name ? { ...col, enabled: !col.enabled } : col
      )
    );
  };

  const handleRowClick = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSave = (updatedUser: IUser) => {
    updateUserRecord(updatedUser.UserId, updatedUser);
  };

  return (
    <div>
      <Paper>
        <AppBarComponent
          openDrawer={openDrawer}
          handleDrawerChange={handleDrawerChange}
          handleOpenColumns={handleOpenColumns}
          handleRefresh={refreshUsers}
        />
        <Sidebar open={openDrawer} handleDrawerChange={handleDrawerChange} />
        <UserTable
          columnsList={columnsList}
          displayedUsers={displayedUsers}
          managers={managers}
          page={page}
          rowsPerPage={rowsPerPage}
          totalUsers={filteredUsers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={handleRowClick}
        />
      </Paper>
      <Menu
        id="basic-menu"
        anchorEl={columnsAnchor}
        open={openColumns}
        onClose={handleCloseColumns}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{ transform: 'translateY(5%)' }}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {columnsList.map((column, index) => (
          <MenuItem key={index} onClick={() => handleColumnChange(column)}>
            <ListItemIcon>
              <Switch edge="end" checked={column.enabled} />
            </ListItemIcon>
            {column.name}
          </MenuItem>
        ))}
      </Menu>
      <UserEditModal
        open={isModalOpen}
        user={selectedUser}
        managers={managers}
        mlsAreasList={mlsAreas}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default UserManagement;