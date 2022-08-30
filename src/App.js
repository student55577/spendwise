import './index.css';
import {ExpenseProvider} from './context/ExpenseContext';
import {BrowserRouter as Router, Route, Routes, Outlet} from 'react-router-dom'
// import AboutPage from './pages/AboutPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Applayout from './components/Applayout/Applayout';
import { Grid } from '@mui/material'
// import { Grid, Paper } from '@mui/material';
import Strategy from './components/Strategy/Strategy';
import Box from '@mui/material/Box';
import IncomeDetails from './components/IncomeDetails';
import ExpenseDetails from './components/ExpenseDetails';

import Main from './components/Main';
import GoalForm from './components/Goal/GoalForm';
import SignIn from './components/Signin';
import { useState} from 'react';
import { useLocation  } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import ArticlesForm from './components/ArticlesForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  // const location = useLocation();
  const theme = createTheme();
  // const main = useRef(null);
  // const token = localStorage.getItem("token");

  return (
  <ThemeProvider theme={theme}>
      <ExpenseProvider>
        <Router>
          {/* <Header /> */}
              <Routes>
                  <Route exact path='/' element={
                    // <MainApp />   
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
                          <ExpenseDetails title="Expense"/>
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