import React, { useEffect, useState } from 'react';
import c3 from "c3";
import dayjs from 'dayjs'
import 'c3/c3.css';
import './App.css'

const timeNow = () => dayjs().format('YYYY-MM-DD HH:mm:ss');
const timeTail = () => dayjs().subtract(1, 'm').format('YYYY-MM-DD HH:mm:ss');

export default function App() {

  useEffect(() => {
    const chartAxis = {
      x: {
        type: 'timeseries',
        min: timeTail(),
        max: timeNow(),
        tick: {
          fit: false,
          rotate: -50,
          format: '%H:%M:%S',
        }
      }
    }

    const chartData = {
      x: 'x',
      xFormat: '%Y-%m-%d %H:%M:%S',
      columns: [
        ['x',],
        ['Sales',]
      ],
      type: "line"
    }

    let chart = c3.generate({
      bindto: '#line-chart',
      data: chartData,
      axis: chartAxis,
    });

    var item1 = [], item2 = [];
    const sse = new EventSource('http://localhost:8080/sse');
    sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
    function getRealtimeData(data) {
      item1.push(data[1]);
      item2.push(data[0]);
    }

    setInterval(() => {
      chart.axis.min({ x: timeTail() });
      chart.axis.max({ x: timeNow() });

      if (item1.length > 0 && item2.length > 0) {
        chartData.columns[0].push(...item1);
        chartData.columns[1].push(...item2);
        chart.load({ columns: chartData.columns });
      }
    }, 2000)
  }, [])

  return (
    <div className='c3-chart'>
      <div className="chart-top">
        <p className="chart-title">Live Chart</p>
      </div>
      <div id="line-chart" style={{ padding: '5px', margin: '10px' }}></div>
    </div>
  )
}