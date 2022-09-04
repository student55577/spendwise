import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import {useNavigate} from "react-router-dom"
import axios from 'axios';
import { useEffect } from 'react';
import ExpContext from '../context/ExpContext';
import { Card } from '@mui/material';
// referencelink https://github.com/mui/material-ui/tree/v5.10.3/docs/data/material/getting-started/templates/sign-in

const theme = createTheme();


export default function SignIn() {
  const {islogin, setIslogin} = React.useContext(ExpContext)
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  let navigate = useNavigate()
  
  useEffect(()=>{
    console.log('------token', token, username)
    if (!username) {
      getusername()
    }
    if(token !== null && username !== undefined) {
      navigate('/home')
      setIslogin(true)
    }
    if(islogin) {
      window.location.reload()
    }
  }, [token, username, islogin])
  const getusername = async () => {
    console.log('get', localStorage.getItem("token"))
    if(token){
    let res = await axios
      .get("/api/users/me/", {headers:{'Authorization': 'Bearer ' + localStorage.getItem("token")}})
      .then((response) => {
        console.log(response);
         localStorage.setItem("username", response.data.username)
        setUsername(response.data.username)
        return response;
      })
      .catch((error) => {
        console.log(error.message);
      });
    return res;
  }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });

    const loginapi = async () => {
      let res = await axios
        .post("/api/token", data)
        .then((response) => {
          console.log("response",response);
          localStorage.setItem("token", response.data.access_token)
          setToken(response.data.access_token)
          return response;
        })
        .catch((error) => {
          console.log(error.message, error.response.data);
          alert(error.response.data.detail)
        });
      return res;
    };
    loginapi();
    getusername();
    
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
}