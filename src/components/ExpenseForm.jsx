import React from 'react';
import { useState, useEffect} from 'react';
import { Grid,  FormControl, InputLabel, Select, MenuItem, TextField, Divider  } from '@mui/material'
import { v4 as uuidv4 } from 'uuid';
import formatDate from '../utils/formatDate';
import ResponsiveDialog from './ResponsiveDialog';
import { Typography } from '@mui/joy';
import { getValue } from '@testing-library/user-event/dist/utils';
function ExpenseForm({addTransaction, balance}) {

  const [incomeCategoriesData, setIncomeCategoriesData] = useState([]);
  const [expenseCategoriesData, setExpenseCategoriesData] = useState([]);
  const [savingCategoriesData, setSavingCategoriesData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(()=>{
    fetchIncomeCategories()
    fetchExpenseCategories()
    fetchSavingCategories()

  }, [])

  const fetchIncomeCategories = async() => {
    if(token) {
    const config = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
      
    }
    const response = await fetch("/api/categories/incomeCategories", config)
    const data = await response.json();
    console.log("data", data?.detail)
    if (data?.detail) {
      localStorage.removeItem("username")
      localStorage.removeItem("token")
      window.location.reload(true);
    }
    setIncomeCategoriesData(data)
    console.log(incomeCategoriesData);
  }
  };
  
  const fetchExpenseCategories = async() => {
    if (token) {
    console.log("fetchExpenseCategories")
    const config = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
      
    }
    const response = await fetch("/api/categories/expenseCategories", config)
    const data = await response.json();
    console.log(data);
    setExpenseCategoriesData(data)
  }
  };

  const fetchSavingCategories = async() => {
      if(token) {
        console.log("fetchSavingCategories")
        const config = {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
          
        }
        
        const response = await fetch("/api/categories/savingCategories", config)
        const data = await response.json();
        console.log(data);
        setSavingCategoriesData(data)
    }
    };

  const createTransaction = (ignoreExpenseValidation=false) => {
    console.log("ignoreExpenseValidation", ignoreExpenseValidation)
    let open_dialog = false;
    const impulseBuying = 120
    const keepCount = 1
    if ((formData.type === 'Expense' || formData.type === 'Saving') && formData.amount > balance) {
        open_dialog = true
        return {
          "open_dialog":open_dialog, "msg": "You cannot do this action due to Insufficient Funds",
          "titlemsg": "Sorry",
          "dialog_type": "alert",
        }
    }
    
    if (Number.isNaN(Number(formData.amount)) || formData.amount <= 0 ||  formData.category === "" || !formData.date.includes('-')) return false;
    if (ignoreExpenseValidation !== true) {
      if ( (formData.type === 'Expense' && formData.category === 'Clothes' || formData.category === 'Groceries' || formData.category === 'OTT Subscriptions' || formData.category === 'Dining Out' || formData.category === 'Entertainment' || formData.category === 'Shopping' || formData.category === 'Other' && formData.amount > impulseBuying)) {
        open_dialog = true 
        return {
          "open_dialog":open_dialog,
          "titlemsg": "Seems like impulsive buying ?", "dialog_type": "dialog", 
          "msg": "This is to notify you that it is an impulsive buying as per your configuration where your preferred impulsive limit is £120",
        }
      }
    }
    if (incomeCategoriesData.map((iC) => iC.type).includes(formData.category)) {
      setFormData({ ...formData, type: 'Income' });
    } else if (expenseCategoriesData.map((iC) => iC.type).includes(formData.category)) {
      setFormData({ ...formData, type: 'Expense' });
    }
    else if (savingCategoriesData.map((iC) => iC.type).includes(formData.category)) {
      setFormData({ ...formData, type: 'Saving' });
    }
    addTransaction({ ...formData, amount: Number(formData.amount), id: uuidv4() });
    setFormData(initialState);
    open_dialog = false
    return {
      "open_dialog":open_dialog, "msg": "",
      "titlemsg": ""
    }
  };

const initialState = {
  amount: '',
  category: '',
  subcategory: '',
  type: 'Income',
  date: formatDate(new Date()),
};
const [formData, setFormData] = useState(initialState);

useEffect(() => {
  setFormData(formData)
}, [formData])

const selectedCategories = formData.type === 'Income' ? incomeCategoriesData : formData.type === 'Expense' ? expenseCategoriesData: savingCategoriesData;
  return (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <FormControl fullWidth>
        <InputLabel variant='filled'>Type</InputLabel>
        <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
          <MenuItem value="Income">Income</MenuItem>
          <MenuItem  value="Expense">Expense</MenuItem>
          <MenuItem  value="Saving">Saving</MenuItem>
        </Select>
      </FormControl>
      <h5 style={{align : "left", color : "#fa0707"}}><b>(Please Note:</b>Your goal list is inclusive part of 'Saving')</h5>
    </Grid>
    <Grid item xs={6}>
      <FormControl fullWidth>
        <InputLabel variant='filled' htmlFor="category">Category</InputLabel>
        <Select id= "category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
          {selectedCategories.map((c) => <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={6}>
        <TextField type="number" label="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} fullWidth />
    </Grid>
     <Grid item xs={6}>
        <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })} />
    </Grid>
    <Divider/>
    {/* <Button  variant="outlined" color="primary"  fullWidth onClick={createTransaction} >Create</Button> */}
    <ResponsiveDialog createTransaction={createTransaction} />
  </Grid>
  )
}

export default ExpenseForm