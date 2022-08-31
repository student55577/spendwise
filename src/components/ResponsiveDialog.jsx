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
  const [msg, setMsg] = React.useState(false);
  const [titlemsg, setTitlemsg] = React.useState(false);
  const [dialogType, setDialogType] = React.useState('dialog');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  


  const handleClickOpen = () => {
    let data = createTransaction()
    console.log("data----------------", data)
    setOpen(data["open_dialog"]);
    setTitlemsg(data["titlemsg"]);
    setMsg(data["msg"]);
    setDialogType(data["dialog_type"])
    return 
  };

  const handleClose = () => {
    setOpen(false);
  };
  const SaveExpense = () => {
    setOpen(false);
    createTransaction(true)
  };

  function HandledialogType({dialogType}) {
    console.log("dialogType", dialogType)
    if (dialogType === 'dialog') {

      return <>
        <Button autoFocus onClick={handleClose}>
          Dont Proceed
        </Button>
        <Button onClick={SaveExpense} autoFocus>
        Proceed
        </Button>
      </>
    }
    else {
      return <>
        <Button autoFocus onClick={handleClose}>
          Ok
        </Button>

      </>
    }
    
  }
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
          {titlemsg}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <HandledialogType dialogType={dialogType}/>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
