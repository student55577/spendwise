import './index.css';
import {ExpenseProvider} from './context/ExpContext';
import {BrowserRouter as Router, Route, Routes, Outlet} from 'react-router-dom'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Applayout from './components/Applayout/Applayout';
import { Grid } from '@mui/material'
import Strategy from './components/Strategy/Strategy';
import Box from '@mui/material/Box';
import IncomeDetails from './components/IncomeDetails';
import ExpDetails from './components/ExpDetails';

import Main from './components/Main';
import GoalForm from './components/Goal/GoalForm';
import SignIn from './components/Signin';
import { useState} from 'react';
import AuthLayout from './components/AuthLayout';
import ArticlesForm from './components/ArticlesForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const theme = createTheme();
  return (
  <ThemeProvider theme={theme}>
      <ExpenseProvider>
        <Router>
              <Routes>
                  <Route exact path='/' element={
                    <Grid container>
                      <Applayout /> <Outlet/>
                    </Grid> } > 
                    <Route path='/login' element={   
                      <Grid  container  sx={{marginLeft:"100px", padding:"100px"}}>
                      <Grid item xs={12} sm={12} >
                      <SignIn />  
                      </Grid>
                      </Grid>
                    }/>
                    <Route element={<AuthLayout />}>
                      <Route path='/home' element = {
                        <Box component="main" sx={{ flexGrow: 1, p: 8, paddingTop: 10}}>
                          <Main/>
                        </Box>
                      }/>             
                      <Route path='/income' element={
                        <Box component="main" sx={{ flexGrow: 1, p: 8, paddingTop: 10}}>
                          <Grid  container  >
                          <Grid item xs={12} sm={4} >
                            <IncomeDetails title="Income" />
                          </Grid>
                          </Grid>
                         </Box>
                      }/>
                      <Route path='/expense' element={
                        <Box component="main" sx={{ flexGrow: 1, p: 8, paddingTop: 10}}>
                          <Grid  container  >
                          <Grid item xs={12} sm={4} >
                          <ExpDetails title="Expense"/>
                          </Grid>
                          </Grid>
                        </Box> 
                      }/>
                      <Route path='/strategy' element={  
                        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: 10}}>
                          <Grid  container  >
                          <Grid item xs={12} sm={12} >
                          <Strategy/>  
                          </Grid>
                          </Grid>
                        </Box> 
                      }/>
                      <Route path='/goal' element={ 
                        <Box component="main" sx={{ flexGrow: 1, p: 8, paddingTop: 10}}>
                          {/* <Grid  container >
                          <Grid item xs={12} sm={12} > */}
                            <GoalForm/>  
                          {/* </Grid>
                          </Grid> */}
                        </Box>
                      }/>
                      <Route path='/article' element={   
                        <Grid  container  sx={{flexGrow: 1, p: 10, paddingTop: 10}}>
                        <Grid item xs={12} sm={12} >
                        <ArticlesForm/>  
                        </Grid>
                        </Grid>
                      }/>
                    </Route>
                </Route>
                {/* <Route path='/about' element={<AboutPage />} />
                <Route path='/model' element={< MainApp/>} />
                   */}
              </Routes>
        </Router>
      </ExpenseProvider>
    </ThemeProvider>
  );
}


export default App;