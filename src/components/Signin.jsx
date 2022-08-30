import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import {useNavigate, useLocation} from "react-router-dom"
import axios from 'axios';
import { useEffect } from 'react';
import ExpenseContext from '../context/ExpenseContext';
import { Card } from '@mui/material';
function Copyright(props) {
  
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();


export default function SignIn() {
  const {islogin, setIslogin} = React.useContext(ExpenseContext)
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  let navigate = useNavigate()
  
  useEffect(()=>{
    console.log('------token', token, username)
    if (!username) {
      getusername()
    }
    if(token !== null && username !== undefined) {
      // navigate('/home')
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
        // Cookies.set("token", response.data.access_token);
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
    const data_app = {
      username: data.get('username'),
      password: data.get('password'),
    }
    // login({
    //   username: data.get('username'),
    //   password: data.get('password'),
    // })
    // navigate('/home')
    const loginapi = async () => {
      let res = await axios
        .post("/api/token", data)
        .then((response) => {
          console.log("response",response);
          // Cookies.set("token", response.data.access_token);
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
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        </Card>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}