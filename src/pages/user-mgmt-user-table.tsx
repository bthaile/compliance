import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { IColumnItem, IUser, IManager } from 'shared/types/user';

interface UserTableProps {
  columnsList: IColumnItem[];
  displayedUsers: IUser[];
  managers: IManager[];
  page: number;
  rowsPerPage: number;
  totalUsers: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (user: IUser) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  columnsList = [],
  displayedUsers = [],
  managers,
  page,
  rowsPerPage,
  totalUsers,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}) => {
  const getManagerName = (user: IUser) => {
    if (user.ManagerName) {
      return user.ManagerName;
    }
    const manager = managers.find((manager) => manager.UserId === user.ManagerUserId);
    return manager ? manager.Name : '';
  };

  return (
    <Paper>
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
                {columnsList[1].enabled && <TableCell>{user.Title}</TableCell>}
                {columnsList[2].enabled && <TableCell>{user.MlsAreas && user.MlsAreas.join(', ')}</TableCell>}
                {columnsList[3].enabled && <TableCell>{getManagerName(user)}</TableCell>}
                {columnsList[4].enabled && <TableCell>{user.Email}</TableCell>}
                {columnsList[5].enabled && <TableCell>{user.AccountEnabled ? 'Yes' : 'No'}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalUsers}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default UserTable;