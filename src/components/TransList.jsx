import React, { useState } from 'react';
import { List as MUIList, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Slide } from '@mui/material';

import { useEffect } from 'react';
import {Delete} from '@mui/icons-material'
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';

function MoneyAvatar({obj}) {
  if (obj.type === "Income") {
  return (
    <Avatar sx = {{backgroundColor:"green"}}>
      <CurrencyPoundIcon/>
    </Avatar>)
  }
  if (obj.type === "Expense") {
    return (
      <Avatar sx = {{backgroundColor:"red"}}>
        <CurrencyPoundIcon/>
      </Avatar>)
    }
  else {
    return (
    <Avatar sx = {{backgroundColor:"blue"}}>
      <CurrencyPoundIcon/>
    </Avatar>)
  }

}

function TransList({transactions, deleteTransaction}) {
    const [transactionsData, setTransactionsData] = useState(transactions)
    const [token, setToken] = useState(localStorage.getItem("token"))

  
    useEffect(() => {
      fetchTransactions()
    }, [])
    useEffect(() => {
      console.log("=========>", transactions)
      fetchTransactions()
    }, [transactions])
    
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
        setTransactionsData(data)
      }
    }
    console.log("TransList",transactions, transactionsData);
    return (
    <MUIList dense = {false} sx={{overflow:'auto', maxHeight: '150px'}}>
      {transactionsData.map((transaction) => (
      
        <Slide direction="down" in mountOnEnter unmountOnExit key={transaction.id}>
          <ListItem>
            <ListItemAvatar>
              <MoneyAvatar obj={transaction}>
              </MoneyAvatar>
            </ListItemAvatar>
            <ListItemText primary={transaction.category} secondary={`£${transaction.amount} - ${transaction.date}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTransaction(transaction.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Slide>
        
            ))}
      
    </MUIList>
  
  )
}

export default TransList
