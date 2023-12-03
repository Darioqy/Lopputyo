import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

const columns = [
  { field: "date", sortable: true },
  { field: "duration", sortable: true },
  { field: "activity", sortable: true },
  { field: "customer", sortable: true, valueGetter: params => {
    const customer = params.data.customer;
    if (customer && customer.firstname && customer.lastname) {
      return `${customer.firstname} ${customer.lastname}`;
    } else {
      return "Error! Delete Entry...";
    }}}
 
  
];

function Training() {

  const [training, setTraining] = useState([]);

  const [newTraining, setNewTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customer: {
      firstname: '',
      lastname: '',
    }
  });

  const addTraining = () => {
    const payload = {
      date: newTraining.date,
      duration: newTraining.duration,
      activity: newTraining.activity,
      customer: {
        firstname: newTraining.customer.firstname,
        lastname: newTraining.customer.lastname,
      },
    };

    fetch('http://traineeapp.azurewebsites.net/api/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        // After successfully adding a new training, fetch updated data
        fetchData();
        
        // Reset the form
        setNewTraining({
          date: '',
          duration: '',
          activity: '',
          customer: {
            firstname: '',
            lastname: '',
          },
        });
      })
      .catch(error => console.error(error));
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://traineeapp.azurewebsites.net/gettrainings')
      .then(response => response.json())
      .then(data => setTraining(data))
      .catch(error => console.error(error));
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customer.')) {
      const customerField = name.split('.')[1];
      setNewTraining({
        ...newTraining,
        customer: {
          ...newTraining.customer,
          [customerField]: value
        }
      });
    } else {
      
      setNewTraining({ ...newTraining, [name]: value });
    }
  };
  

  

  return (
    <div>
       <div style={{ paddingLeft: '18vw' }}>
        <h2>Lisää uusi treeni</h2> 





<input
          type="date"
          placeholder="Date"
          value={newTraining.date}
          name="date"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Duration"
          value={newTraining.duration}
          name="duration"
          onChange={handleInputChange}
        /> 
        <input
        type="text"
        placeholder="Activity"
        value={newTraining.activity}
        name="activity"
        onChange={handleInputChange}
      />
      <input
          type="text"
          placeholder="Customer First Name"
          value={newTraining.customer.firstname}
          name="customer.firstname"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Customer Last Name"
          value={newTraining.customer.lastname}
          name="customer.lastname"
          onChange={handleInputChange}
        />

        <button onClick={addTraining}>Lisää treeni</button>
      </div>
    <div className="ag-theme-material"
      style={{ height: '700px', width: '70%', margin: 'auto' }}>
        
      <AgGridReact
        columnDefs={columns}
        rowData={training}>
        
      </AgGridReact>
    </div>
   

    </div>
  )
}
