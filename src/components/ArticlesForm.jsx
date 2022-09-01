import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
export default function SimpleContainer() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography bgcolor="#4293f5"><center><h1><b>Click Below to Learn More.....</b></h1></center></Typography>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', width:'100vh'}}>
          <div>
            <h2>
              Why Budgeting?
            </h2>
          </div>
          <div>
              <iframe width="100%" align="center" height="400px"
                src="https://www.youtube.com/embed/k0JVAgczgWA"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
                title="video"
              />{" "}
            </div>
            <div>
                <h2>Story of Cindy and Jimmy</h2>
            </div>
            <div>
              <iframe width="100%" align="center" height="400px"
                src="https://www.youtube.com/embed/dH-8yrzd8yc"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
                title="video"
              />{" "}
            </div>            
        </Box>
      </Container>      
    </React.Fragment>
  );
}