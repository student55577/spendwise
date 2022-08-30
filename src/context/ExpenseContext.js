import React, { useEffect, useState } from 'react'
import { createContext } from "react";


const ExpenseContext = createContext()

export const ExpenseProvider = (props) => {
  
  const [transactionsData, setTransactionsData] = useState([])

  console.log("transactionsData", transactionsData)
  const initialchartData = {
    datasets: [
      {"backgroundColor": [],
       "data": []}
    ],
    labels: []
  }
  const [incomeChartData, setIncomeChartData] = useState(initialchartData);
  const [expenseChartData, setExpenseChartData] = useState(initialchartData);
  const [totalData, setTotalData] = useState(0);
  const [totalExpenseData, setTotalExpenseData] = useState(0)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [islogin, setIslogin] = useState(false)

  useEffect(() => {
    console.log("update rec", transactionsData);
    setTransactionsData(transactionsData)
    setIncomeChartData(incomeChartData)
    setExpenseChartData(expenseChartData)
  }, [transactionsData, incomeChartData, expenseChartData, token]);


  const deleteTransaction = (id) => {
    fetchdeleteTransaction(id)
    fetchIncomeChartData()
    fetchExpenseChartData()

  };
  
  const addTransaction = (transaction) => {
      console.log("add transaction")
      console.log(transaction)
    fetchaddTransaction(transaction)
    fetchIncomeChartData()
    fetchExpenseChartData()
    console.log("returns")
  };
  const balance = transactionsData.reduce((acc, currVal) => (currVal.type === 'Expense' | currVal.type === 'Saving' ? acc - currVal.amount : acc + currVal.amount), 0);

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
      fetchIncomeChartData()
      fetchExpenseChartData()
    }
  }
  useEffect(()=>{
    fetchTransactions()
  },[])
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
      setTransactionsData(data["transactions"])
      setTotalData(data["total"])
    }
  }
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
      setTransactionsData(data["transactions"])
      setTotalExpenseData(data["total"])
      }
    }

  const fetchaddTransaction = async(transaction) => {
    console.log("-------", transaction)
    if(token) {
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
    console.log(data)
    setTransactionsData(data)
    }
  }

  const fetchdeleteTransaction = async(id) => {
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
    setTransactionsData(data)
  }
  }

  

  console.log(islogin)  
  return <ExpenseContext.Provider value={{
    balance,
    deleteTransaction,
    addTransaction,
    transactionsData,
    incomeChartData,
    totalData,
    totalExpenseData,
    expenseChartData,
    islogin,
    setIslogin,
    // call_all_apis,
    fetchTransactions

  }}>
      {props.children}
  </ExpenseContext.Provider>
    }

export default ExpenseContext