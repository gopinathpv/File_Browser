import React from "react";

import Box from "@material-ui/core/Box";

import DataGrid from './DataGrid/DataGrid'
import "./App.css";

function App() {
  return (
      <Box 
        component="main" 
        className="App-main"
        p={2} //  padding
        mt={6} // margin-top
        mx="auto" //  margin-left and right
        maxWidth={1200}> 
        <DataGrid />
      </Box>
  );
}

App.whyDidYouRender = true
export default App;
