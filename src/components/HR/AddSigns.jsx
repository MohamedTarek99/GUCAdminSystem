import React, { useState ,useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles"; 
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Dropdown from "react-bootstrap/Dropdown";
import Chip from '@material-ui/core/Chip';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { message } from "antd";
import "antd/dist/antd.css";


const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  {
    id: 'signInDate',
    label: 'SignInDate',
    minWidth: 150,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'signOutDate',
    label: 'SignOutDate',
    minWidth: 150,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  }
 
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows,setRows]=useState([]);
  const [id,setid]=useState("");
  const [addSignIn,setSignInForm]=useState(false)
  const [signInTime,setSignInTime]=useState("2021-01-24T10:30")
  const [signOutTime,setSignOutTime]=useState("2021-01-24T10:30")
  const [error,seterror]=useState("")
  const [attendanceid,setattendanceid]=useState({})
  const [addSignOut,setSignOutForm]=useState(false)


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function handleIdChange(event){
      setid(event.target.value);

  }
  function handleSignInClose(){
      setSignInForm(false);
  }
  
  function handleSignInOpen(event){
      setattendanceid(event.currentTarget.value)
      console.log(event.currentTarget.value)
      setSignInForm(true);
  }
  function handleSignOutClose(){
    setSignOutForm(false);
}

function handleSignOutOpen(event){
    setattendanceid(event.currentTarget.value)
    console.log(event.currentTarget.value)
    setSignOutForm(true);
}
  async function getInfo(){
      try{
    const info=  await axios.post("http://localhost:3000/HR/viewMissingSigns",{id:id})
    console.log(info.data)
    if(Array.isArray(info.data)){
        setRows(info.data);
         return;
    }}
    catch{
        message.error("An error occured")
    }


  }

  async function populate(){
    try{
  const info=  await axios.post("http://localhost:3000/HR/viewMissingSigns",{id:id})
  console.log(info.data)
  if(Array.isArray(info.data)){
      setRows(info.data);
       return;
  }}
  catch{
      message.error("An error occured")
  }


}
  function changeSignInTime(event){
      setSignInTime(event.target.value);
  }
  function changeSignOutTime(event){
    setSignOutTime(event.target.value);
}
  async function addSignInConfirmation(event){
      const row=attendanceid
      console.log('a');
      console.log(row);
    const date=new Date(signInTime)
    const day=date.getDate()
    const hours=date.getHours()
    const minutes=date.getMinutes()
    const month=date.getMonth()+1
    const year=date.getFullYear()
      const response=await axios.put("http://localhost:3000/HR/addSignin",{_id:row,timeofsignin:hours,dayofsignin:day,monthofsignin:month,yearofsignin:year,minutesofsignin:minutes})
     if(response.data==="Sign in succesful"){
         handleSignInClose();
         populate()
         message.success("Sign in Added!")

     }else{
       message.error(response.data)
     }
  }
  async function addSignOutConfirmation(event){
    const row=attendanceid
    console.log('a');
    console.log(row);
  const date=new Date(signOutTime)
  const day=date.getDate()
  const hours=date.getHours()
  const minutes=date.getMinutes()
  const month=date.getMonth()+1
  const year=date.getFullYear()
    const response=await axios.put("http://localhost:3000/HR/addSignout",{_id:row,timeofsignout:hours,dayofsignout:day,monthofsignout:month,yearofsignout:year,minutesofsignin:minutes})
  
    if(response.data==="Sign out recorded succesfully"){
       handleSignOutClose();
       populate()
       message.success("Sign out Added!")

   }else{
     message.error(response.data)
   }
}

  return (
      <div>
    <Paper className={classes.root}>
        <div allign='left'> 
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="ID"
            type="text"
            onChange={handleIdChange}
           value={id}
           required
          />
        <Button  onClick={getInfo} variant="contained" > View</Button>
                  </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if(column.id==='signInDate'&&value===null){
                        return(
                        <TableCell key={column.id} align={column.align}>
                        <Button value={row["_id"]} onClick={handleSignInOpen} variant="contained" color="primary" > AddSignIn</Button>
                        </TableCell>
                  )
                        }
                  if(column.id==='signOutDate'&&value===null){
                    return(
                    <TableCell key={column.id} align={column.align}>
                    <Button value={row["_id"]}  variant="contained" color="secondary" onClick={handleSignOutOpen}> AddSignOut</Button>
                    </TableCell>
              )
                    }
                    
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
      <Dialog open={addSignIn} onClose={handleSignInClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add SignIn</DialogTitle>
      <DialogContent>
        <DialogContentText>
      { "Enter the Date of the Sign In"}
        </DialogContentText>
        <p style={{color: "red"}}>{error}</p>

     
          <TextField
        id="datetime-local"
        label="Next appointment"
        type="datetime-local"
        defaultValue="2017-05-24T10:30"
        className={classes.textField}
        onChange={changeSignInTime}
        value={signInTime}
        InputLabelProps={{
          shrink: true
        }}
      />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSignInClose} color="primary">
          Cancel
        </Button>
        <Button  onClick={addSignInConfirmation} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={addSignOut} onClose={handleSignOutClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add SignOut</DialogTitle>
      <DialogContent>
        <DialogContentText>
      { "Enter the Date of the Sign Out"}
        </DialogContentText>
        <p style={{color: "red"}}>{error}</p>

     
          <TextField
        id="datetime-local"
        label="Next appointment"
        type="datetime-local"
        defaultValue="2017-05-24T10:30"
        className={classes.textField}
        onChange={changeSignOutTime}
        value={signOutTime}
        InputLabelProps={{
          shrink: true
        }}
      />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSignOutClose} color="primary">
          Cancel
        </Button>
        <Button  onClick={addSignOutConfirmation} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
}
