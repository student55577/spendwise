import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Divider, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
export default function ResponsiveDialog({ createTransaction}) {
    console.log('hi....')
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  


  const handleClickOpen = () => {
    setOpen(createTransaction());
    return 
  };

  const handleClose = () => {
    setOpen(false);
  };
  const SaveExpense = () => {
    setOpen(false);
    createTransaction(true)
  };
  return (
    <Grid container>
        <Divider/>
      <Button variant="outlined" onClick={handleClickOpen} fullWidth>
        CREATE
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Seems like impulsive buying ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is to notify you that it is an impulsive buying as per your configuration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Dont Proceed
          </Button>
          <Button onClick={SaveExpense} autoFocus>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
