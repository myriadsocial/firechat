import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type MyProps = {
  title:string,
  handleSave?:(cb:()=>void) => void,
  handleOpen?:(cb:()=>void) => void,
  handleClose?:(cb:()=>void) => void,
  btnText?:string,
  btnVariant?:"contained" | "outlined" | "text",
  btnColor?: "primary" | "secondary" | "inherit" | "success" | "error" | "info" | "warning" | undefined,
  btnIcon?: JSX.Element,
}

const BasicModal:React.FC<MyProps> = props => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {props.handleOpen ? props.handleOpen(()=>{setOpen(true)}) : setOpen(true)};
  const handleClose = () => {props.handleClose ? props.handleClose(()=>{setOpen(false)}) : setOpen(false)};
  const handleSave = () => {props.handleSave ? props.handleSave(()=>{setOpen(false)}) : setOpen(false)};

  return (
    <>
      <Button 
        variant={props.btnVariant ? props.btnVariant : "contained"}
        color={props.btnColor ? props.btnColor : "primary"}
        onClick={handleOpen}>
          {props.btnIcon ? props.btnIcon : <></>}
          {props.btnText ? props.btnText : "Open Modal"}
        </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" mb={1.5}>
            {props.title}
          </Typography>
          <div style={{marginBottom : "10px"}}>
            {props.children}
          </div>
          <Divider />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default BasicModal;