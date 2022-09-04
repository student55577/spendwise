import React from 'react'
import { Grid, Card, CardHeader, CardContent, Button, FormControl, InputLabel, Select, MenuItem, TextField, Divider, Typography  } from '@mui/material'
import { v4 as uuidv4 } from 'uuid';
import ExpContext from '../../context/ExpContext';

import { useState, useEffect } from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Slider from '@mui/material/Slider';
import axios from 'axios';

import GoalList from './GoalList';

function GoalForm() {
    const {formatTheDate} = React.useContext(ExpContext)
    function valuetext(value) {
        return `${value}`;
      }
      const marks = [
        {
          value: 0,
          label: '0',
        },
        {
          value: 1,
          label: '1',
        },
        {
          value: 2,
          label: '2',
        },
        {
          value: 3,
          label: '3',
        },
        {
          value: 4,
          label: '4',
        },
        {
            value: 5,
            label: '5',
          },
          {
            value: 6,
            label: '6',
          },
          {
            value: 7,
            label: '7',
          },
          {
            value: 8,   
            label: '8',
          },{
            value: 9,
            label: '9',
          },{
            value: 10,
            label: '10',
          },
      ];

    const initialData = {
      goal: '',
      amount: '',
      duration: '3',
      inflation: 0,
      date: formatTheDate(new Date()),
    };
    const [formData, setFormData] = useState(initialData);
    const token = useState(localStorage.getItem("token"));
    const [transactionData, setTransactionData] = useState([]);
    const [totalgoals, setTotalGoals] = useState(0);
    const [bigGoal, setBigGoal] = useState('');
    const [smallGoal, setSmallGoal] = useState('');
    const [balance, setBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalSaving, setTotalSaving] = useState(0);
    const addGoal = async () => {
      if(token){
        console.log("data", formData)
      let res = await axios({
        method: 'post',
        url: '/api/addGoal',
        data: formData,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token")
        }
      })
        .then((response) => {
          console.log("--addgoal", response.data);
          setTransactionData(response.data.goals)
          setBalance(response.data.goalsInfo.currentBalance)
          setTotalIncome(response.data.goalsInfo.totalIncome)
          setTotalExpense(response.data.goalsInfo.totalExpense)
          setTotalSaving(response.data.goalsInfo.totalSaving)
          setBigGoal(response.data.goalsInfo.bigGoal)
          setSmallGoal(response.data.goalsInfo.smallGoal)
          return response;
        })
        .catch((error) => {
          console.log(error.message);
        });
      return res;
    }
    };
 
    
    const createGoal = () => {
      console.log(formData)
      if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;
      addGoal({ ...formData, amount: Number(formData.amount), goal: Number(formData.goal), duration: Number(formData.duration), 

        id: uuidv4() })
      
    };
  
  const getGoals = async () => {
    if(token){
    let res = await axios({
      method: 'get',
      url: '/api/goals',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then((response) => {
        if (response?.detail) {
          localStorage.removeItem("username")
          localStorage.removeItem("token")
          window.location.reload(true);
        }
        console.log("goalInfo", response.data.goals, response.data, response.data.goalsInfo);
        setTransactionData(response.data.goals)
        setBalance(response.data.goalsInfo.currentBalance)
        setTotalIncome(response.data.goalsInfo.totalIncome)
        setTotalExpense(response.data.goalsInfo.totalExpense)
        setTotalSaving(response.data.goalsInfo.totalSaving)
        setBigGoal(response.data.goalsInfo.bigGoal)
        setSmallGoal(response.data.goalsInfo.smallGoal)
        return response;
      })
      .catch((error) => {
        console.log(error.message);
      });
    return res;
  }
  };

  const totalGoals = Object.keys(transactionData).length


  useEffect(() => {
    getGoals()
  }, [])
  const deleteTheGoal = async (id) => {
    if(token){
    let res = await axios({
      method: 'post',
      url: '/api/deleteGoal',
      data: {id: id},
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then((response) => {
        console.log(response);
        setTransactionData(response.data.goals)
        setBalance(response.data.goalsInfo.currentBalance)
        setTotalIncome(response.data.goalsInfo.totalIncome)
        setTotalExpense(response.data.goalsInfo.totalExpense)
        setTotalSaving(response.data.goalsInfo.totalSaving)
        setBigGoal(response.data.goalsInfo.bigGoal)
        setSmallGoal(response.data.goalsInfo.smallGoal)
        return response;
      })
      .catch((error) => {
        console.log(error.message);
      });
    return res;
  }
  };
  const [open, setOpen] = useState(false)
  console.log(formData)
//   const selectedCategories = formData.type === 'Income' ? incomeCategoriesData : formData.type === 'Expense' ? expenseCategoriesData: savingCategoriesData;
    return (
      <Grid  container spacing={2} >
        <Grid  item xs={6}  md={6}>
          <Card key="goal">
            <CardHeader />
            <Typography variant="h5" align="center" bgcolor="#15b9eb"><b>GOAL TRACKER</b></Typography>
            <Typography variant="h15" align="center" color="#fa0707"><b> (Note:</b>Please do Savings for your goals under 'Saving' in 'Home' page)</Typography>
            <CardContent>
            {/* <Typography variant="h5"><b>Goal Tracker</b></Typography> */}
              {/* <Typography variant="h7">Total Goal: </Typography> */}
              <Grid sx={{flexGrow: 1, p: 3}}>
                <Grid>
                  <Typography  sx={{ fontSize: 15 }} gutterBottom color="text.secondary">Enter Your Goal</Typography>
                  <Divider/>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    {/* <InputLabel htmlFor="goal-label">Goal</InputLabel> */}
                    <TextField  label="Goal" variant="outlined"  value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })}/>
                    
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Target Amount</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      // value={values.amount}
                      // onChange={handleChange('amount')}
                      startAdornment={<InputAdornment position="start">£</InputAdornment>}
                      label="SavingAmount"
                      type="number"
                      value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel  htmlFor="duration-label">
                          Duration
                      </InputLabel>
                      <Select defaultValue="6" labelId="duration-label"
              id="duration-select"
              // value={age}
              label="Duration"
              // onChange={handleChange}
              value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              >
                          <MenuItem value="3">3 Months</MenuItem>
                          <MenuItem value="6">6 Months</MenuItem>
                          <MenuItem value="9">9 Months</MenuItem>
                          <MenuItem value="12">12 Months</MenuItem>
                      </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="slider-label">
                          Inflation
                      </InputLabel>
                      <Slider
                          aria-label="Inflation"
                          defaultValue={0}
                          getAriaValueText={valuetext}
                          valueLabelDisplay="auto"
                          step={1}
                          marks={marks}
                          min={0}
                          max={10}
                          // labelId="slider-label"
                          value={formData.inflation} onChange={(e) => setFormData({ ...formData, inflation: e.target.value })}
                          />
                  </FormControl>
                  <Button variant="outlined" color="primary" 
                  onClick={createGoal}
                  >Create</Button>
                </Grid>
                <Grid >
                  <GoalList transactionData={transactionData}  deleteTheGoal={deleteTheGoal} />
                </Grid>
              </Grid>
            </CardContent>
        </Card>
        </Grid>
        <Grid item xs={6}  md={6}>
          <Card>
          <CardContent>
          <Typography variant="h5" component="div">
          <center bgcolor="#15b9eb"><h5><b>OVERVIEW</b></h5></center><br/>
          <b>Total Income : </b>{totalIncome} <br/>
          <b>Total Expenses : </b>{totalExpense} <br/>
          <b>Total Savings : </b>{totalSaving} <br/>
          <b>Current Balance : </b>{balance} <br/>
          <b>Total Goals : </b>{totalGoals} <br/>
          <b>Biggest goal : </b>{bigGoal?.goal} <b>Target Amount : </b>£{bigGoal?.amount}<br/>
          <b>Smallest goal : </b>{smallGoal?.goal} <b>Target Amount : </b>£{smallGoal?.amount}
        </Typography>
          </CardContent>
          </Card>
        </Grid>
      </Grid>
  )
}

export default GoalForm