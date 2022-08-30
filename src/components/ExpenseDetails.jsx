import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

// import ExpenseContext from '../context/ExpenseContext';
ChartJS.register(ArcElement, Tooltip, Legend);
const ExpenseDetails = ({ title }) => {

  const initialchartData = {
    datasets: [
      {"backgroundColor": [],
       "data": []}
    ],
    labels: []
  }
  const [expenseChartData, setExpenseChartData] = useState(initialchartData);
  const [totalExpenseData, setTotalExpenseData] = useState(0)
  const [token, setToken] = useState(localStorage.getItem("token"));
  const fetchExpenseChartData = async() => {
    if(token) {
      console.log("fetch Expense")
      const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        
      }
      const response = await fetch("/api/ChartData?is_type=Expense", config)
      const data = await response.json();
      console.log("========= fetchExpenseChartData", data);
      setExpenseChartData(data["chartData"])
      // setTransactionsData(data["transactions"])
      setTotalExpenseData(data["total"])
      }
    }
  useEffect(() => {
    fetchExpenseChartData()
    }, [])
  return (
    <Card key="expense">
      <CardHeader  />
      <CardContent>
      <Typography variant="h5" bgcolor="#15b9eb"><b>EXPENSE REPORT</b></Typography>
        <Typography variant="h7">Total expenses: £{totalExpenseData}</Typography>
        <Doughnut data={expenseChartData} />
      </CardContent>
    </Card>
  );
};

export default ExpenseDetails;