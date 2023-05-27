import React from 'react';
import './css/WeatherGraph.css'
import { LineChart, Line, CartesianGrid, Label, XAxis, YAxis, Tooltip } from 'recharts';
const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 500, pv: 2500, amt: 2500 },
    { name: 'Page C', uv: 300, pv: 2600, amt: 2600 },
    { name: 'Page D', uv: 874, pv: 2500, amt: 2500 },
    { name: 'Page E', uv: 900, pv: 2600, amt: 2600 },
    { name: 'Page F', uv: 200, pv: 2500, amt: 2500 },
    { name: 'Page G', uv: 300, pv: 2600, amt: 2600 },
];

function CustomTooltip({ active, payload, label }) {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].payload.name}, ${payload[0].payload.uv}, ${payload[0].payload.pv}`}</p>
        </div>
      );
    }
  
    return null;
  }

function WeatherGraph() {
    return (
        <section>
            <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="uv" stroke="#f6f0e4" />
                <CartesianGrid horizontal={null} vertical={null} />
                <XAxis tick={{ fill: "#f6f0e4"  }} ticks={[0, 1, 3]} tickLine={{ stroke: "#f6f0e4" }} stroke="#f6f0e4"/>
                <YAxis tick={{ fill: "#f6f0e4"  }} tickLine={{ stroke: "#f6f0e4" }} stroke="#f6f0e4"/>
                <Tooltip content={<CustomTooltip />} />
            </LineChart>
        </section>
    )
}

export default WeatherGraph