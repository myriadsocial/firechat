import * as React from 'react';
import { Add, Edit } from '@mui/icons-material';
import { Grid, TextField, IconButton, TextareaAutosize } from '@mui/material';
import { Chat, common, Firegun } from "@yokowasis/firegun";
import BasicModal from './BasicModal';


export default function EditGroupChat(
  props: {
    groupowner : string,
    groupname : string,
    common : typeof common,
    chat : Chat,
    fg : Firegun,
  }
) {
  const [editGroupName, setEditGroupName] = React.useState("");
  const [editGroupDescription, setEditGroupDescription] = React.useState("");
  const [editImage, setEditImage] = React.useState("");
  const [isGroupAdmin, setIsGroupAdmin] = React.useState(false);

  const handleNewGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.common.fileTobase64(event.target)
    .then((s:any)=>{
      setEditImage(s.content);
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

  const getGroupInfo = async () => {
    let data = await props.chat.groupGetInfo(props.groupowner, props.groupname);
    if (typeof data === "object") {
      setEditGroupDescription(data.desc);
      setEditGroupName(data.name);
      setEditImage(data.image);
    }

    let admins = await props.chat.groupGetAdmin(props.groupowner, props.groupname);
    if (admins.some(e => e.pub === props.fg.user.pair.pub)) {
      setIsGroupAdmin(true);
    }

  }

  const saveEditGroup = async (cb:()=>void) => {
    await props.chat.groupSetInfo(props.groupowner,editGroupName,editGroupDescription,editImage)
    cb();
  }

  React.useEffect(()=>{
    if (props.groupname && props.groupowner)
      getGroupInfo();
  },[props.groupname])

  return (
    <>
      <BasicModal 
        title="Edit Group"
        handleSave={saveEditGroup}
        btnColor="primary" 
        btnText="Group" 
        btnIcon={<Edit />} 
        btnVariant="text">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} textAlign="center" container direction="column" overflow="clip">
              <Grid item sx={{ maxWidth : "100% !important"}}>
                  {
                  editImage ? 
                    <img onClick={selectLogo} style={{maxWidth : "100%"}} src={editImage} alt="new group" />
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
                  InputProps={{
                    readOnly : true
                  }}
                  variant="standard"
                  size="small"
                  label="Group Name"
                  value={editGroupName}
                  onChange={(e)=>{setEditGroupName(e.target.value)}}
                />
            </Grid>
            <Grid item>
                <TextareaAutosize
                  readOnly={props.fg.user.pair.pub !== props.groupowner && isGroupAdmin === false}
                  maxRows={6}
                  value={editGroupDescription}
                  style={{ width: "100%" }}
                  onChange={(e)=>{setEditGroupDescription(e.target.value)}}
                />              
            </Grid>
        </Grid>
        </Grid>

      </BasicModal>
    </>
  );
}

