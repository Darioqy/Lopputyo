import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import moment from 'moment';
import 'moment/locale/fi';
import '../App.css';
import { Button } from '@mui/material';

function Training() {
  const [training, setTraining] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newTraining, setNewTraining] = useState({
    date: '',
    activity: '',
    duration: '',
    customer: '',
  });

  const columns = [
    { flex: '4', field: 'date', sortable: true, filter: true, valueFormatter: params => moment(params.value).format('DD.MM.YYYY HH:mm') },
    { flex: '4', field: 'duration', sortable: true, filter: true },
    { flex: '3', field: 'activity', sortable: true, filter: true },
    {
      flex: '3',
      field: 'customer',
      sortable: true,
      filter: true,
      valueGetter: params => {
        const customer = params.data.customer;
        return `${customer.firstname} ${customer.lastname}`;
      },
    },
    {
      flex: '2',
      cellRenderer: params => <Button size="small" onClick={() => deleteTraining(params)}>Delete</Button>,
    },
    
  ];

  useEffect(() => {
    fetchData();
    fetchCustomers();
  }, []);

  const fetchData = () => {
    fetch('http://traineeapp.azurewebsites.net/gettrainings')
      .then(response => response.json())
      .then(data => setTraining(data))
      .catch(error => console.error(error));
  };

  const fetchCustomers = () => {
    fetch('https://traineeapp.azurewebsites.net/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data.content))
      .catch(error => console.error(error));
  };

  const handleAddTraining = () => {
    const selectedCustomer = customers.find(c => `${c.firstname} ${c.lastname}` === newTraining.customer);

    if (selectedCustomer) {
      newTraining.customer = selectedCustomer.links.find(link => link.rel === 'self').href;
    }

    fetch('http://traineeapp.azurewebsites.net/api/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTraining),
    })
      .then(response => response.json())
      .then(() => {
        fetchData();
        setNewTraining({
          date: '',
          activity: '',
          duration: '',
          customer: '',
        });
      })
      .catch(error => console.error(error));
  };

  const deleteTraining = (params) => {
    const trainingId = params.data.id;

    console.log("Delete Commenced:", trainingId);

    fetch(`http://traineeapp.azurewebsites.net/api/trainings/${trainingId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          fetchData();
        } else {
          console.error('Failed to delete training ${trainingId}.');
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div style={{ paddingLeft: '18vw' }}>
        <h2>Trainings Page</h2>
      </div>
      
      <div
        className="ag-theme-material"
        style={{ width: '70%', margin: 'auto' }}
      >
        <AgGridReact columnDefs={columns} rowData={training} domLayout='autoHeight' />
      </div>
      <div className="addNew">
        <h2>Add New Training</h2>
        <div>
          <label>Date:</label>
          <input
            type="datetime-local"
            value={newTraining.date}
            onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
          />
        </div>
        <div>
          <label>Activity:</label>
          <input
            type="text"
            value={newTraining.activity}
            onChange={(e) => setNewTraining({ ...newTraining, activity: e.target.value })}
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            value={newTraining.duration}
            onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })}
          />
        </div>
        <div>
          <label>Customer:</label>
          <select
            value={newTraining.customer}
            onChange={(e) => setNewTraining({ ...newTraining, customer: e.target.value })}
          >
            <option value="" disabled>Select Customer</option>
            {customers.map(c => (
              <option key={c.links.find(link => link.rel === 'self').href}>
                {`${c.firstname} ${c.lastname}`}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAddTraining}>Add Training</button>
      </div>
    </div>
  );
}

export default Training;
