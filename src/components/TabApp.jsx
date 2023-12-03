import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import '../App.css';


import Training from './Training';
import Customer from './Customer';



function TabApp() {
    const [value, setValue] = useState('Training');

    const handleChange = (event, value) => {
        setValue(value);
      };

      return (
        <div>
          <Tabs value={value} onChange={handleChange}>
             <Tab value="Training" label="Training" />
             <Tab value="Customer" label="Customer" />
             
          </Tabs>
          {value === 'Training' && <Training></Training>}
          {value === 'Customer' && <Customer></Customer>}
          
          
       </div> );
}
export default TabApp;