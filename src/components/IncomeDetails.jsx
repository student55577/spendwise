import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

import { useState, useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeDetails = ({ title }) => {
  const initialchartData = {
    datasets: [
      {"backgroundColor": [],
       "data": []}
    ],
    labels: []
  }
  const [incomeChartData, setIncomeChartData] = useState(initialchartData);
  const [totalData, setTotalData] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  
  const fetchIncomeChartData = async() => {
    if (token) {
      const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        
      }
      const response = await fetch("/api/ChartData?is_type=Income", config)
      const data = await response.json();
      setIncomeChartData(data["chartData"])
      // setTransactionsData(data["transactions"])
      setTotalData(data["total"])
    }
  }

  useEffect(() => {
    fetchIncomeChartData()
  }, [])

  return (
    <Card >
      <CardHeader  />
      <CardContent>
        <Typography variant="h5" bgcolor="#15b9eb"><b>INCOME REPORT</b></Typography>
        <Typography variant="h7">Total Income: £{totalData}</Typography>
        <Doughnut  data={incomeChartData}/>
      </CardContent>
    </Card>
  );
};

export default IncomeDetails;