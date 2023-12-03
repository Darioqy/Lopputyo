import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import '../App.css';

import { Button } from '@mui/material';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: '',
  });
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch('http://traineeapp.azurewebsites.net/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data.content))
      .catch(error => console.error(error));
  };

  const handleAddCustomer = () => {
    fetch('http://traineeapp.azurewebsites.net/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCustomer),
    })
      .then(response => response.json())
      .then(() => {
        fetchCustomers();
        setNewCustomer({
          firstname: '',
          lastname: '',
          streetaddress: '',
          postcode: '',
          city: '',
          email: '',
          phone: '',
        });
      })
      .catch(error => console.error(error));
  };

  const deleteCustomer = (params) => {
    const customerLink = params.data.links.find(link => link.rel === 'self').href;
    const customerId = customerLink.split('/').pop();

    fetch(`http://traineeapp.azurewebsites.net/api/customers/${customerId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          fetchCustomers();
        } else {
          console.error(`Failed to delete customer with ID ${customerId}`);
        }
      })
      .catch((error) => console.error(error));
  };

  const editCustomer = (params) => {
    const customerLink = params.data.links.find(link => link.rel === 'self').href;
    const customerId = customerLink.split('/').pop();

    fetch(`http://traineeapp.azurewebsites.net/api/customers/${customerId}`)
      .then(response => response.json())
      .then(data => {
        setEditingCustomer(data);
      })
      .catch(error => console.error(error));
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) {
      console.error("No customer data for update");
      return;
    }
  
    const customerLink = editingCustomer.links.find((link) => link.rel === 'self').href;
    const customerId = customerLink.split('/').pop();
  
    fetch(`http://traineeapp.azurewebsites.net/api/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingCustomer),
    })
      .then((response) => {
        if (response.ok) {
          fetchCustomers();
          setEditingCustomer(null);
        } else {
          console.error(`Failed to update customer with ID ${customerId}`);
        }
      })
      .catch((error) => console.error(error));
  };

  const columns = [
    { headerName: 'First Name', field: 'firstname', sortable: true, filter: true },
    { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true },
    { headerName: 'Street Address', field: 'streetaddress', sortable: true, filter: true },
    { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true },
    { headerName: 'City', field: 'city', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    {
      cellRenderer: params =>
        <Button size="small" onClick={() => deleteCustomer(params)}>
          Delete
        </Button>,
    },
    {
      cellRenderer: params =>
        <Button size="small" onClick={() => editCustomer(params)}>
          Edit
        </Button>,
    },
  ];

  return (
    <div>
      <div style={{ paddingLeft: '18vw' }}>
        <h2>Customer List</h2>
      </div>
      
      <div
        className="ag-theme-material"
        style={{  width: '70%', margin: 'auto' }}
      >
        <AgGridReact columnDefs={columns} rowData={customers} domLayout='autoHeight'/>
      </div>
      <div className='addNew'> 
        <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={editingCustomer ? editingCustomer.firstname : newCustomer.firstname}
            onChange={(e) => {
              if (editingCustomer) {
                setEditingCustomer({ ...editingCustomer, firstname: e.target.value });
              } else {
                setNewCustomer({ ...newCustomer, firstname: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={editingCustomer ? editingCustomer.lastname : newCustomer.lastname}
            onChange={(e) => {
              if (editingCustomer) {
                setEditingCustomer({ ...editingCustomer, lastname: e.target.value });
              } else {
                setNewCustomer({ ...newCustomer, lastname: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <label>Street Address:</label>
          <input
            type="text"
            value={editingCustomer ? editingCustomer.streetaddress : newCustomer.streetaddress}
            onChange={(e) => {
              if (editingCustomer) {
                setEditingCustomer({ ...editingCustomer, streetaddress: e.target.value });
              } else {
                setNewCustomer({ ...newCustomer, streetaddress: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <label>Postcode:</label>
          <input
            type="text"
            value={editingCustomer ? editingCustomer.postcode : newCustomer.postcode}
            onChange={(e) => {
              if (editingCustomer) {
                setEditingCustomer({ ...editingCustomer, postcode: e.target.value });
              } else {
                setNewCustomer({ ...newCustomer, postcode: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={editingCustomer ? editingCustomer.city : newCustomer.city}
            onChange={(e) => {
              if (editingCustomer) {
                setEditingCustomer({ ...editingCustomer, city: e.target.value });
              } else {
                setNewCustomer({ ...newCustomer, city: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={editingCustomer ? editingCustomer.email : newCustomer.email}
            onChange={(e) => {
              if (editingCustomer) {
                setEditingCustomer({ ...editingCustomer, email: e.target.value });
              } else {
                setNewCustomer({ ...newCustomer, email: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={editingCustomer ? editingCustomer.phone : newCustomer.phone}
            onChange={(e) => {
              if (editingCustomer) {
                setEditingCustomer({ ...editingCustomer, phone: e.target.value });
              } else {
                setNewCustomer({ ...newCustomer, phone: e.target.value });
              }
            }}
          />
        </div>
        <button onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}>
          {editingCustomer ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>
    </div>
  );
};

export default Customer;