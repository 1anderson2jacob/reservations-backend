// my-dashboard-component.jsx
import { ApiClient } from 'admin-bro'
import { Box } from '@admin-bro/design-system'
import React, { useEffect, useState } from "react";
// import './styles/dashboard.css';

const api = new ApiClient()

const Dashboard = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    api.getDashboard().then((response) => {
      setData(response.data)
    })
  }, [])

  return (
    <Box variant="grey">
      <Box variant="white">
        {/* some: { data.some } */}
        <div 
        style={
          {
            width: '80%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center'
          }
        }>
          <img src='https://packwoodrv.com/images/site-map.jpg' alt='site-map' 
          style={
            { 
              border:'1px solid black',
              width: '100%',
              maxHeight: '100%'
            }
          }/>
        </div>
      </Box>
    </Box>
  )
}

export default Dashboard