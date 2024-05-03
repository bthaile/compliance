import 'firebase/auth';
import { Key, Mail, Person } from '@mui/icons-material';
import {
  Box,
  Button,
  FormGroup,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { fontSize } from '@mui/system';
import { AuthActions } from 'contexts/auth/types';
import useAuth from 'contexts/auth/useAuth';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import backgroundImage from '../assets/img/blueredhoneycomb.jpg';
import scalogo from '../assets/img/scalogo.jpg';
import TerravalueLogo from '../assets/img/TerravalueLogoWhite.png';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import firebase from 'contexts/auth/Firebase';

const Login: NextPage = () => {
  const [signup, setSignup] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useAuth();
  const auth = getAuth(firebase);

  const handleLogin = async (email: string, password: string): Promise<void> => {
    console.log(' calling loging handler')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('adding authuser', result.user)
      dispatch({ type: AuthActions.LOGIN, payload: { user: { ...result.user } } });
    } catch (error) {
      console.error(error);
      // Optionally handle error state
    }
  };

  return (
    <div>
      {signup === 'signup' && (
        <>
          <Image
            src={backgroundImage}
            alt="bg Image"
            style={{ zIndex: -1 }}
            layout="fill"
          />
          <div
            style={{
              display: 'flex',
              color: 'white',
              margin: '5px',
              marginLeft: '20px',
              alignContent: 'space-between',
              width: '100%',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ flexGrow: 2 }}>
              <Image src={TerravalueLogo} alt="Cadence Logo" width={200} height={68} />
            </div>
            <Box display={'flex'} marginRight={5}>
              <Typography marginTop={1} marginRight={1}>
                Already have an account?
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: 'black',
                  backgroundColor: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#4c4c4d',
                    backgroundColor: '#e3e3e3',
                    borderColor: 'none',
                    boxShadow: 'none',
                  },
                }}
                onClick={() => {
                  setSignup('login');
                }}
              >
                Sign In
              </Button>
            </Box>
          </div>
          <Box
            sx={{
              marginTop: '50px',
              minWidth: '500px',
              maxWidth: '736px',
              minHeight: '415px',
              maxHeight: '450px',
              marginX: '30%',
            }}
          >
            <Paper
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '10px',
              }}
            >
              <h2 className="font-bold">Get started with Terravalue</h2>

              <TextField
                sx={{ width: '80%' }}
                label="Name"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                style={{ margin: '10px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                sx={{ width: '80%' }}
                label="Email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                style={{ margin: '10px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Mail />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                sx={{ width: '80%' }}
                type="password"
                label="Password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                style={{ margin: '10px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Key />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                sx={{
                  width: '80%',
                  textTransform: 'none',
                  marginBottom: '5px',
                }}
                variant="contained"
                onClick={() => handleLogin(email, password)}
                size="large"
              >
                Sign Up
              </Button>

              <Typography
                sx={{
                  color: '#A5A7B2',
                  fontSize: '0.875rem',
                  marginTop: '5px',
                }}
              >
                By signing in you agree to Terravalue
              </Typography>
              <Button
                sx={{
                  textDecoration: 'underline',
                  textTransform: 'none',
                  background: 'none',
                  color: '#A5A7B2',
                  border: 'none',
                  margin: 0,
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                Terms of Service
              </Button>
            </Paper>
          </Box>
        </>
      )
      }
      {
        signup === 'forgot' && (
          <>
            <Image
              src={backgroundImage}
              alt="bg Image"
              style={{ zIndex: -1 }}
              layout="fill"
            />
            <div
              style={{
                display: 'flex',
                color: 'white',
                margin: '5px',
                marginLeft: '20px',
                alignContent: 'space-between',
                width: '100%',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <div style={{ flexGrow: 2 }}>
                <Image src={TerravalueLogo} alt="Cadence Logo" width={200} height={68} />
              </div>
              <Box display={'flex'} marginRight={5}>
                <Typography marginTop={1} marginRight={1}>
                  Create New account?
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'black',
                    backgroundColor: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      color: '#4c4c4d',
                      backgroundColor: '#e3e3e3',
                      borderColor: 'none',
                      boxShadow: 'none',
                    },
                  }}
                  onClick={() => {
                    setSignup('signup');
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </div>
            <Box
              sx={{
                marginTop: '50px',
                minWidth: '500px',
                maxWidth: '736px',
                minHeight: '415px',
                maxHeight: '450px',
                marginX: '30%',
              }}
            >
              <Paper
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  padding: '10px',
                }}
              >
                <h2 className="font-bold">Welcome to Terravalue</h2>
                <Typography sx={{ color: '#A5A7B2', fontSize: '0.875rem' }}>
                  The ultimate map tool
                </Typography>

                <TextField
                  sx={{ width: '80%' }}
                  label="Email"
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  style={{ margin: '10px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  sx={{
                    width: '80%',
                    textTransform: 'none',
                    marginBottom: '5px',
                  }}
                  variant="contained"
                  onClick={() => {
                    dispatch({
                      type: AuthActions.FORGOT,
                      payload: { email: email },
                    });
                  }}
                  size="large"
                >
                  Reset My Password
                </Button>

                <Typography
                  sx={{
                    color: '#A5A7B2',
                    fontSize: '0.875rem',
                    marginTop: '5px',
                  }}
                >
                  By signing in you agree to Terravalue
                </Typography>
                <Button
                  sx={{
                    textDecoration: 'underline',
                    textTransform: 'none',
                    background: 'none',
                    color: '#A5A7B2',
                    border: 'none',
                    margin: 0,
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  Terms of Service
                </Button>
              </Paper>
            </Box>
          </>
        )
      }
      {
        signup === 'login' && (
          <>
            <Image
              src={backgroundImage}
              alt="bg Image"
              style={{ zIndex: -1 }}
              layout="fill"
            />
            <div
              style={{
                display: 'flex',
                color: 'white',
                margin: '5px',
                marginLeft: '20px',
                alignContent: 'space-between',
                width: '100%',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <div style={{ flexGrow: 2 }}>
                <Image src={TerravalueLogo} alt="Cadence Logo" width={200} height={68} />
              </div>
              <Box display={'flex'} marginRight={5}>
                <Typography marginTop={1} marginRight={1}>
                  Create New account?
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'black',
                    backgroundColor: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      color: '#4c4c4d',
                      backgroundColor: '#e3e3e3',
                      borderColor: 'none',
                      boxShadow: 'none',
                    },
                  }}
                  onClick={() => {
                    setSignup('signup');
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </div>
            <Box
              sx={{
                marginTop: '50px',
                minWidth: '500px',
                maxWidth: '736px',
                minHeight: '415px',
                maxHeight: '450px',
                marginX: '30%',
              }}
            >
              <Paper
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  padding: '10px',
                }}
              >
                <h2 className="font-bold">Welcome to Terravalue</h2>
                <Typography sx={{ color: '#A5A7B2', fontSize: '0.875rem' }}>
                  The ultimate map tool
                </Typography>

                <TextField
                  sx={{ width: '80%' }}
                  label="Email"
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  style={{ margin: '10px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  sx={{ width: '80%' }}
                  type="password"
                  label="Password"
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  style={{ margin: '10px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Key />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  sx={{
                    width: '80%',
                    textTransform: 'none',
                    marginBottom: '5px',
                  }}
                  variant="contained"
                  onClick={() => handleLogin(email, password)}
                  size="large"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setSignup('forgot')}
                  sx={{
                    textDecoration: 'underline',
                    textTransform: 'none',
                    background: 'none',
                    color: 'red',
                    border: 'none',
                    margin: 0,
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  Forgot Password
                </Button>

                <Typography
                  sx={{
                    color: '#A5A7B2',
                    fontSize: '0.875rem',
                    marginTop: '5px',
                  }}
                >
                  By signing in you agree to Terravalue
                </Typography>
                <Button
                  sx={{
                    textDecoration: 'underline',
                    textTransform: 'none',
                    background: 'none',
                    color: '#A5A7B2',
                    border: 'none',
                    margin: 0,
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  Terms of Service
                </Button>
              </Paper>
            </Box>
          </>
        )
      }
    </div >
  );
};

export default Login;
