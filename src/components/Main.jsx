import React, { useEffect } from 'react'
import { Card, CardContent, Typography,  Divider } from '@mui/material'
import {Grid} from '@mui/material'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'

import { useState } from 'react'

function Main() {
  const [transactions, setTransactions] = useState([])
  const [token, setToken] = useState(localStorage.getItem("token"))
  const balance = transactions.reduce((acc, currVal) => (currVal.type === 'Expense' | currVal.type === 'Saving' ? acc - currVal.amount : acc + currVal.amount), 0);
  const fetchTransactions = async() => {
    console.log("fetch transactions", token)
    if (token) {
      const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      }
      const response = await fetch("/api/Transactions", config)
      const data = await response.json();
      setTransactions(data)
      
    }
  }
  const deleteTransaction = async(id) => {
    console.log("-------", id)
    if(token){
    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify({"id": id})
    }
    const response = await fetch("/api/deleteTransaction", config)
    const data = await response.json();
    setTransactions(data)
  }
  }
  const addTransaction = async(transaction) => {
    console.log("-------", transaction)
    if(token){
    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(transaction)
    }
    const response = await fetch("/api/addTransaction", config)
    const data = await response.json();
    setTransactions(data)
  }
  }
  
  useEffect(()=>{
    fetchTransactions()
  },[])
  return (
    <Card variant="outlined" bgcolor="#ab9f80">
      <CardContent>
      <Typography align="center" variant="h5" bgcolor="#15b9eb"><b>RECORD YOUR FINANCIAL ACTIVITY HERE</b></Typography>
        <Typography align="center" variant="h5">Total Balance £{balance} </Typography>
          {/* <Typography variant="subtitle1" style={{ lineHeight: '1.5em', marginTop: '20px' }}><InfoCard /></Typography> */}
        <Divider sx={{margin: '20px 0'}} />
        <ExpenseForm addTransaction= {addTransaction} balance={balance}/>
      </CardContent>
      <CardContent sx ={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ExpenseList transactions={transactions} deleteTransaction={deleteTransaction}/>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Main