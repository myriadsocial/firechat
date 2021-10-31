import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Add } from '@mui/icons-material';
import { Grid, TextField, IconButton } from '@mui/material';
import { common } from "../firegun";

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

export default function GroupChat(
  props: {
    common : typeof common,
    newGroup : (name:string,desc:string,image:string) => void,
  }
) {
  const [open, setOpen] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState("");
  const [newGroupDescription, setNewGroupDescription] = React.useState("");
  const [newImage, setNewImage] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNewGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.common.fileTobase64(event.target)
    .then((s:any)=>{
      setNewImage(s.content);
    })
  }

  const selectLogo = () => {
    if (document != null) {
      let b = document.getElementById("newGroupImage");
      if (b != null) {
        b.click();
      }
    }
  }

  const saveNewGroup = () => {
    props.newGroup(newGroupName,newGroupDescription,newImage);
  }

  return (
    <Grid mb={2}>
      <Button startIcon={<Add />} variant="contained" color="success" onClick={handleOpen}>New Group</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Group
          </Typography>
          <Grid id="modal-modal-description" sx={{ mt: 2 }} container>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} textAlign="center" container direction="column" overflow="clip">
                    <Grid item sx={{ maxWidth : "100% !important"}}>
                        {
                        newImage ? 
                          <img onClick={selectLogo} style={{maxWidth : "100%"}} src={newImage} alt="new group" />
                        : 
                          <IconButton aria-label="" onClick={selectLogo}>
                            <Add />
                          </IconButton>
                        }
                    </Grid>
                    <Grid item sx={{ display : "none"}}>
                      <input type="file" id="newGroupImage" onChange={handleNewGroupName} />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={8} container direction="column" spacing={2}>
                    <Grid item>
                        <TextField
                          fullWidth
                          variant="standard"
                          size="small"
                          id="newGroupName"
                          label="Group Name"
                          value={newGroupName}
                          onChange={(e)=>{setNewGroupName(e.target.value)}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                          fullWidth
                          variant="standard"
                          size="small"
                          id="newGroupDescription"
                          label="Group Description"
                          value={newGroupDescription}
                          onChange={(e)=>{setNewGroupDescription(e.target.value)}}
                        />
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="success" onClick={saveNewGroup}>Save</Button>
                    </Grid>
                </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Grid>
  );
}

