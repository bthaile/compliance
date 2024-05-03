import {
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  TextField,
  InputLabel,
  Divider,
  Button,
} from '@mui/material';
import Sidebar from 'components/toolbar/Sidebar';
import { NextPage } from 'next';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import GenericPhoto from '../assets/img/generic.png';
import Image from 'next/image';

const UserProfile: NextPage = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open);
  };

  return (
    <div>
      <Paper style={{ height: '100vh' }}>
        <div className="flex">
          <AppBar position="sticky">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => handleDrawerChange(!openDrawer)}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">Personal Details</Typography>
              <List style={{ display: 'flex' }}>
                <ListItemButton key={'options'}></ListItemButton>
              </List>
            </Toolbar>
          </AppBar>
        </div>
        <Sidebar open={openDrawer} handleDrawerChange={handleDrawerChange} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '20px',
            alignItems: 'start',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '10px',
            }}
          >
            <label
              style={{
                minWidth: '100px',
                maxWidth: '100px',
                marginRight: '20px',
              }}
            >
              First Name
            </label>
            <TextField style={{ minWidth: '400px' }} variant="outlined" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '10px',
            }}
          >
            <label
              style={{
                minWidth: '100px',
                maxWidth: '100px',
                marginRight: '20px',
              }}
            >
              Last Name
            </label>
            <TextField style={{ minWidth: '400px' }} variant="outlined" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '10px',
            }}
          >
            <label
              style={{
                minWidth: '100px',
                maxWidth: '100px',
                marginRight: '20px',
              }}
            >
              Job Title
            </label>
            <TextField style={{ minWidth: '400px' }} variant="outlined" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '10px',
            }}
          >
            <label
              style={{
                minWidth: '100px',
                maxWidth: '100px',
                marginRight: '20px',
              }}
            >
              Email Address
            </label>
            <TextField style={{ minWidth: '400px' }} variant="outlined" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '10px',
            }}
          >
            <label
              style={{
                minWidth: '100px',
                maxWidth: '100px',
                marginRight: '20px',
              }}
            >
              NMLS Number
            </label>
            <TextField style={{ minWidth: '400px' }} variant="outlined" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '10px',
            }}
          >
            <label
              style={{
                minWidth: '100px',
                maxWidth: '100px',
                marginRight: '20px',
              }}
            >
              Phone No
            </label>
            <TextField style={{ minWidth: '400px' }} variant="outlined" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '10px',
            }}
          >
            <label
              style={{
                minWidth: '100px',
                maxWidth: '100px',
                marginRight: '20px',
              }}
            >
              Flyer Photo
            </label>
            <div>
              <Image
                src={GenericPhoto}
                alt="user image"
                width={100}
                height={100}
              />
              <Button>Edit Photo</Button>
            </div>
          </div>
        </div>
        <Divider />
        <Button style={{ margin: '50px' }} variant="contained">
          Update Profile
        </Button>
      </Paper>
    </div>
  );
};

export default UserProfile;
