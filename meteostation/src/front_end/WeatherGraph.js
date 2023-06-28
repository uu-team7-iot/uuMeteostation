import React, { useState, useEffect } from 'react';
import './css/WeatherGraph.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faClock, faTemperatureLow } from '@fortawesome/free-solid-svg-icons'


function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const { time, temp, date } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div>
          <FontAwesomeIcon icon={faCalendarDays} />
          <span className='tooltip-temp'>{`Date: ${date}`}</span>
        </div>
        <div>
          <FontAwesomeIcon icon={faClock} />
          <span className='tooltip_time'>{`Time: ${time}`}</span>
        </div>
        <div>
          <FontAwesomeIcon icon={faTemperatureLow} />
          <span className='tooltip-temp'>{`Temperature: ${temp.toFixed(2)} °C`}</span>
        </div>
        

      </div>
    );
  }

  return null;
}



function formatDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


function WeatherGraph({ meteo_id }) {

  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [toDate, setToDate] = useState(new Date())

  const [reducedMeasurements, setReducedMeasurements] = useState([]); // Initial data
  const [granularity, setGranularity] = useState('6_hours'); // Initial granularity


  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = '/api/get-meassures';
        const dt = {
          meteo_id: meteo_id,
          granularity: granularity,
          from_date: fromDate.toJSON(),
          to_date: toDate.toJSON(),
        };

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dt),
        };

        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        if (!data.error) {
          setReducedMeasurements(data.reducedMeasurements);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [granularity, fromDate, toDate]);


  const changeGranularity = (event) => {
    console.log(event.target.value)
    setGranularity(event.target.value);
  }

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const td = new Date();
    switch (event.target.id) {
      case 'date_from_graph':
        if ((td > selectedDate) && (toDate > selectedDate)) {
          setFromDate(selectedDate)
        } else {
          console.log('Cant set view of date(from) in future or higher then to_date')
        }
        break;
      case 'date_to_graph':
        if ((td > selectedDate) && (fromDate < selectedDate)) {
          setToDate(selectedDate);
        } else {
          console.log('Cant set view of date(to) in future or less then from_date')
        }
        break;
      default:
        console.log('Setting date in graph went wrong.')
    }
  };

  // Format the dates as YYYY-MM-DD strings
  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = formatDate(toDate);

  console.log(formattedFromDate, formattedToDate)



  return (
    <section className='weather_graph_section'>

      <div className='dates_part'>
        <FontAwesomeIcon icon={faCalendarDays} />
        <label for="date_from_graph">Date from:</label>
        <input type="date" id="date_from_graph" name="date_from_graph" value={formattedFromDate} onChange={handleDateChange} />

        <label for="date_to_graph">Date to:</label>
        <input type="date" id="date_to_graph" name="date_to_graph" value={formattedToDate} onChange={handleDateChange}></input>
      </div>

      <div className='ganularity_part'>
        <FontAwesomeIcon icon={faClock} />
        <label for="granularity">Choose a granularity:</label>
        <select id="granularity" onChange={changeGranularity}>
          <option value="10_minutes">10 minutes</option>
          <option value="30_minutes">30 minutes</option>
          <option value="1_hour">1 hour</option>
          <option value="6_hours">6 hours</option>
          <option value="1_day">1 day</option>
        </select>
      </div>



      <LineChart width={800} height={300} data={reducedMeasurements}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="temp" name="temperature" stroke="#8884d8" />
      </LineChart>

    </section>
  )
}


export default WeatherGraph