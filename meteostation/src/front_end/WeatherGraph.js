import React, { useState, useEffect } from 'react';
import './css/WeatherGraph.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { random, times } from 'lodash';
import Slider from 'react-input-slider';

function CustomTooltip({ active, payload, label }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} :Temperature: ${payload[0].payload.uv}`}</p>
      </div>
    );
  }

  return null;
}


function generateData(size) {
  return times(size, (index) => ({
    name: index + 1, // day of the year
    uv: random(5, 32), // Temperature ranging between 5 and 32 degrees
  }));
}


function aggregateData(data, granularity, dt_zone) {
  let aggregatedData = [];
  if (dt_zone < data.length - 1){
    data = data.slice(data.length - dt_zone - 1)
  }
  for (let i = 0; i < data.length; i += granularity) {
    let subset = data.slice(i, i + granularity);

    let uvSum = subset.reduce((sum, point) => sum + point.uv, 0);
    let avgUv = uvSum / subset.length;

    aggregatedData.push({
      name: `Day ${subset[0].name} - Day ${subset[subset.length - 1].name}`, // Day range for these points
      uv: avgUv
    });
  }

  return aggregatedData;
}


function WeatherGraph({ meassure_data }) {
  const [data, setData] = useState(meassure_data.map((el) => {
    console.log(el)
    const date = new Date(el.time);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}`;
    console.log(formattedDate); // "28-05"

    return {
      name: formattedDate,
      uv: el.temp
    }
  })); // Initial data
  const [granularity, setGranularity] = useState(1); // Initial granularity
  const [aggregatedData, setAggregatedData] = useState([]);
  const [date_zone, setDate_zone] = useState(21)

  // When data or granularity changes, re-aggregate the data
  useEffect(() => {
    setAggregatedData(aggregateData(data, granularity, date_zone));
  }, [data, granularity,date_zone]);

  const changeGranularity = (value) => {
    setGranularity(value);
  }

  return (
    <section>
      <div className="mySlider">
        <Slider
          axis="x"
          xstep={1}
          xmin={1}
          xmax={10}
          x={granularity}
          onChange={({ x }) => changeGranularity(x)}
        />
      </div>
      <div className="mySlider">
        <Slider
          axis="x"
          xstep={1}
          xmin={1}
          xmax={21}
          x={date_zone}
          onChange={({ x }) => setDate_zone(x)}
        />
      </div>
      <LineChart width={800} height={300} data={aggregatedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="uv" stroke="#f6f0e4" />
        <CartesianGrid horizontal={null} vertical={null} />
        <XAxis dataKey="name" tick={{ fill: "#f6f0e4" }} tickLine={{ stroke: "#f6f0e4" }} stroke="#f6f0e4" />
        <YAxis tick={{ fill: "#f6f0e4" }} tickLine={{ stroke: "#f6f0e4" }} stroke="#f6f0e4" />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>

    </section>
  )
}

export default WeatherGraph