import React, { useState } from 'react'


import './App.css'
import TabApp from './components/TabApp'
import { LocalizationProvider } from '@mui/x-date-pickers';

function App() {

  return (
    <>
    <LocalizationProvider>
      <div>
        <TabApp></TabApp>
        
        
      </div>
      </LocalizationProvider>
    </>
  )
}

export default App
