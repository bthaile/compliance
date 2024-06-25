import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { IUser, IManager, SYSTEM_ROLES } from 'shared/types/user';

interface UserEditModalProps {
  open: boolean;
  user: IUser | null;
  managers: IManager[];
  mlsAreasList: string[];
  onClose: () => void;
  onSave: (updatedUser: IUser) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  open,
  user,
  managers,
  mlsAreasList,
  onClose,
  onSave,
}) => {
  const [updatedUser, setUpdatedUser] = useState<IUser>(user || ({} as IUser));

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name as string]: value });
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name as string]: typeof value === 'string' ? value.split(',') : value });
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: checked });
  };

  const handleSave = () => {
    onSave(updatedUser);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">Edit User</Typography>
        <TextField label="Name" name="Name" value={updatedUser.Name} onChange={handleInputChange} fullWidth margin="normal" />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Title</InputLabel>
          <Select label="Title" name="Title" value={updatedUser.Title || ''} onChange={handleSelectChange}>
            {Object.keys(SYSTEM_ROLES).map((role) => (
              <MenuItem key={role} value={role}>{SYSTEM_ROLES[role as keyof typeof SYSTEM_ROLES]}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Manager</InputLabel>
          <Select label="Manager" name="ManagerUserId" value={updatedUser.ManagerUserId || ''} onChange={handleSelectChange}>
            <MenuItem value="">None</MenuItem>
            {managers.map((manager) => (
              <MenuItem key={manager.UserId} value={manager.UserId}>{manager.Name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField label="Email" name="Email" value={updatedUser.Email} onChange={handleInputChange} fullWidth margin="normal" />

        <FormControl fullWidth margin="normal">
          <InputLabel>MLS Areas</InputLabel>
          <Select
            label="MLS Areas"
            name="MlsAreas"
            multiple
            value={updatedUser.MlsAreas || []}
            onChange={handleMultiSelectChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {mlsAreasList.map((area) => (
              <MenuItem key={area} value={area}>
                <Checkbox checked={updatedUser.MlsAreas?.indexOf(area) > -1} />
                {area}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={updatedUser.AccountEnabled || false}
              onChange={handleBooleanChange}
              name="AccountEnabled"
            />
          }
          label="Enabled"
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserEditModal;