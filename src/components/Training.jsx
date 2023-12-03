import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import moment from 'moment';
import 'moment/locale/fi';
import '../App.css';

const columns = [
  {flex: "1", field: "date", sortable: true, valueFormatter: params => moment(params.value).format('DD.MM.YYYY HH:mm') },
  {flex: "1",  field: "duration", sortable: true},
  {flex: "1",  field: "activity", sortable: true},
  {flex: "1",  field: "customer", sortable: true,  valueGetter: params => {
    const customer = params.data.customer;
    return `${customer.firstname} ${customer.lastname}`;
    }}
 
  
];

function Training() {

  const [training, setTraining] = useState([]);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://traineeapp.azurewebsites.net/gettrainings')
      .then(response => response.json())
      .then(data => setTraining(data))
      .catch(error => console.error(error));
  }

  

  return (
    <div>
       <div style={{ paddingLeft: '18vw' }}>
        <h2>Trainings Page</h2> 
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
export default Training;