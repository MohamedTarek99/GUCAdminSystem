import React, { useState ,useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";



const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  {
    id: 'hours',
    label: 'Hours',
    minWidth: 150,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'date',
    label: 'Date',
    minWidth: 150,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'signInDate',
    label: 'Sign in date',
    minWidth: 150,
    align: 'left',
    format: (value) => value.toFixed(2),
  }, {
    id: 'signOutDate',
    label: 'Sign out date',
    minWidth: 150,
    align: 'left',
    format: (value) => value.toFixed(2),
  }
];

function createData(id,hours,date,signInDate,signOutDate) {
  return {id,hours,date,signInDate,signOutDate };
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
  const [month,setMonth]=React.useState("")
  const [open] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [button, setButton] = useState("Choose month");

  async function handleClick(event) {
    const value = event.target.text;
    console.log(value)
    setButton(value);
    setMonth(value);
      if(value === "All"){
      console.log('hiii')
      const attendanceRecords =await axios.post("http://localhost:3000/viewAttendanceRecord")
      const attendanceRecordsArray=attendanceRecords.data
      console.log(attendanceRecordsArray)
      const result=[]
      attendanceRecordsArray.map((records)=>{
        result.push(createData(records.id,records.hours,records.date,records.signInDate,records.signOutDate))
       })
       
       setRows(result);
      }
      else{
        console.log('hello')
      const attendanceRecords =await axios.post("http://localhost:3000/viewAttendanceRecord",{month:value})
      const attendanceRecordsArray=attendanceRecords.data
      console.log(attendanceRecordsArray)
      const result=[]
      attendanceRecordsArray.map((records)=>{
        result.push(createData(records.id,records.hours,records.date,records.signInDate,records.signOutDate))
       })
       
       setRows(result);
  
      }
  
  
  }

// const ViewRecords = async () => {
//     console.log('hiii')
//     if(month == "All"){
//     const attendanceRecords =await axios.post("http://localhost:3000/viewAttendanceRecord")
//     const attendanceRecordsArray=attendanceRecords.data
//     console.log(attendanceRecordsArray)
//     const result=[]
//     attendanceRecordsArray.map((records)=>{
//       result.push(createData(records.id,records.hours,records.date,records.signInDate,records.signOutDate))
//      })
     
//      setRows(result);
//     }
//     else{
//     const attendanceRecords =await axios.post("http://localhost:3000/viewAttendanceRecord",{"month":month})
//     const attendanceRecordsArray=attendanceRecords.data
//     const result=[]
//     attendanceRecordsArray.map((records)=>{
//       result.push(createData(records.id,records.hours,records.date,records.signInDate,records.signOutDate))
//      })
     
//      setRows(result);

//     }

// }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

// useEffect(async () => {
//         const attendanceRecords =await axios.post("http://localhost:3000/viewAttendanceRecord",{"month":month})
//     const attendanceRecordsArray=attendanceRecords.data
//     const result=[]
//     attendanceRecordsArray.map((records)=>{
//       result.push(createData(records.id,records.hours,records.date,records.signInDate,records.signOutDate))
//      })
     
//      setRows(result);
//     }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
    
      return (
        <html>
        <div>
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Month : {button}
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleClick}>All</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>1</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>2</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>3</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>4</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>5</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>6</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>7</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>8</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>9</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>10</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>11</Dropdown.Item>
          <Dropdown.Item onClick={handleClick}>12</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </div>

          <div>
        <Paper className={classes.root}>
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
        </div>
         </html>
      );
    }