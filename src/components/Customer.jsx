import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import '../App.css';

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch('http://traineeapp.azurewebsites.net/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data.content))
      .catch(error => console.error(error));
  };

  const columns = [
    { headerName: 'First Name', field: 'firstname', sortable: true },
    { headerName: 'Last Name', field: 'lastname', sortable: true },
    { headerName: 'Street Address', field: 'streetaddress', sortable: true },
    { headerName: 'Postcode', field: 'postcode', sortable: true },
    { headerName: 'City', field: 'city', sortable: true },
    { headerName: 'Email', field: 'email', sortable: true },
    { headerName: 'Phone', field: 'phone', sortable: true },
  ];

  return (
    <div>
      <div style={{ paddingLeft: '18vw' }}>
        <h2>Customer List</h2>
      </div>
      <div
        className="ag-theme-material"
        style={{ height: '700px', width: '70%', margin: 'auto' }}
      >
        <AgGridReact columnDefs={columns} rowData={customers} />
      </div>
    </div>
  );
};

export default Customer;