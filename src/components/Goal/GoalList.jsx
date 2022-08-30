import React, { useState } from 'react';
import { List as MUIList, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Slide } from '@mui/material';
import {Delete} from '@mui/icons-material'
// import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import axios from 'axios';
import { useEffect } from 'react';

function GoalList({transactionData, deleteTheGoal, balance}) {
  console.log("goallist", transactionData)
    const [goalTransaction, setGoalTransaction] = useState(transactionData)
    const token = useState(localStorage.getItem("token"))
    // const intialState = {id: null}
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
          console.log(response);
          setGoalTransaction(response.data.goals)
          return response;
        })
        .catch((error) => {
          console.log(error.message);
        });
      return res;
    }
    };
    useEffect(()=>{
      getGoals()
    },[transactionData])
    
    return (
    <MUIList dense = {false} sx={{overflow:'auto', maxHeight: '200px'}}>
      {goalTransaction.map((transaction) => (
        <Slide direction="down" in mountOnEnter unmountOnExit key={transaction.id}>
          <ListItem>
            <ListItemText 
            sx={{color:transaction.targetReached===true?'green':'blue'}} 
            primary={`Goal: ${transaction.goal} in ${transaction.duration} Months `} 
            secondary={`Target Amount: $${transaction.amount} Saved: $${transaction.savedTillNow} Target Date:${transaction.date}`}  />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTheGoal(transaction.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Slide>
        
            ))}
      
    </MUIList>
  
  )
}

export default GoalList
