import React, { useContext } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';
import { useEffect } from 'react';
import ExpenseContext from '../../context/ExpenseContext';
function Strategy() {
    const [startegyOneData, setStartegyOneData] = useState({})
    useEffect(()=>{
        fetchStartegyOne()
    }, [])
    const {token, islogin} = useContext(ExpenseContext)

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
                        text: 'YOUR RESULTS VS 50-30-20 Rule'
                    },
                    xAxis: {
                        categories: [
                            'Needs(Max : 50%)',
                            'Wants(Max : 30%)',
                            'Savings(Min : 20%)'
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
                    series: [{
                        name: 'Limits',
                        color: 'rgba(165,170,217,1)',
                        data: startegyOneData["limits"],
                        pointPadding: 0.3,
                        pointPlacement: -0.2
                    }, {
                        name: 'Actuals',
                        color: 'rgba(126,86,134,.9)',
                        data: startegyOneData["actuals"],
                        pointPadding: 0.4,
                        pointPlacement: -0.2
                    },]
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
