import React, { useContext } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';
import { useEffect } from 'react';
import ExpContext from '../../context/ExpContext';
function Strategy() {
    const [startegyOneData, setStartegyOneData] = useState({})
    useEffect(()=>{
        fetchStartegyOne()
    }, [])
    const {token, islogin} = useContext(ExpContext)

    const fetchStartegyOne = async(transaction) => {
        console.log("------- islogin", transaction, islogin)
        if (localStorage.getItem("token")) {
        const config = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
          body: JSON.stringify(transaction)
        }
        const response = await fetch("/api/strategy_503020", config)
        const data = await response.json();
        if (data?.detail) {
            localStorage.removeItem("username")
            localStorage.removeItem("token")
            window.location.reload(true);
          }
        console.log(data)
        setStartegyOneData(data)
        }
      }

      class StrategyChart extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              barOptions: []
            }
        }
        highChartsRender = () => {
            this.setState({
              barOptions:{
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '<b><h2>Distribution Tracker</b></h2></br><b>Needs:</b>Bills, Loan, House, Clothes, Groceries, Transport</color></br><b>Wants:</b>OTT, Vacations, Dining Out, Entertainment, Shopping, Other',                        
                    },
                    xAxis: {
                        categories: [
                            '<b>Needs</b>',
                            '<b>Wants</b>',
                            '<b>Savings</b>'
                        ]
                    },
                    yAxis: [{
                        min: 0,
                        title: {
                            text: 'Limits'
                        }
                    }, ],
                    legend: {
                        shadow: false
                    },
                    tooltip: {
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    },
                    series : [ {
                        name: 'Actuals',
                        color: 'rgba(126,86,134,.9)',
                        data: startegyOneData["actuals"],
                        pointPadding: 0.4,
                        pointPlacement: -0.2
                    }, ]
                            }
            });
          }
    
        componentDidMount() {
            this.highChartsRender();
        }
    
           render() {
            const { barOptions } = this.state;
    
            return (
              <div>
                <HighchartsReact highcharts={Highcharts}
                    options={barOptions} isPureConfig={true} />
              </div>
            );
           }
    }
    
      return <StrategyChart/>
}

export default Strategy;
