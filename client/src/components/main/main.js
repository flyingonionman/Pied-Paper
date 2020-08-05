import React , { } from 'react'
import Dashboard from "../dashboard/dashboard"
import Content from "../content/content"
import Extra from "../nav/extra"
import { createMuiTheme } from '@material-ui/core/styles';
import './main.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
});


function Main() {
    return (
        <>
          <div className='main_container'> 
      
            <div className='main_left'>
              <Dashboard theme={theme}/>
            </div>

    
            <div className='main_right'>
              <Content theme={theme}/>
              {/* <Analysis theme={theme}/> */}
              {/* <Review theme={theme}/> */}

            </div>


          </div>
          {/* <Footer theme={theme}/>*/}
          <Extra theme={theme}/> 

        </>
    )
}

export default Main
