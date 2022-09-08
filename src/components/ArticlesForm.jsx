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
                src="https://www.youtube.com/embed/k0JVAgczgWA"  // (www.youtube.com, n.d.) Reference: //www.youtube.com. (n.d.). Saving Smart with Warren Buffett. [online] Available at: https://www.youtube.com/watch?v=k0JVAgczgWA&ab_channel=Savvy [Accessed 4 Sep. 2022].
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
                title="video"
              />{" "}
            </div>
            <div>
                <h2>Failures are important</h2>
            </div>
            <div>
              <iframe width="100%" align="center" height="400px"
                src="https://www.youtube.com/embed/8l2egORXGA" // (www.youtube.com, n.d.) Reference: www.youtube.com. (n.d.). 10 things I learned after losing a lot of money | Dorothée Loorbach | TEDxMünster. [online] Available at: https://www.youtube.com/watch?v=_8l2egORXGA&ab_channel=TEDxTalks [Accessed 20 Jul. 2022].
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