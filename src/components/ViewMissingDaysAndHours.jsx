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
import Chip from '@material-ui/core/Chip';
import { message } from "antd";
import "antd/dist/antd.css";

const columns = [
  {
    id: 'missingdays',
    label: 'Missing days',
    minWidth: 200,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  }
  
];
function CreateData(missinghours) {
  return {missinghours};
}

function createData(missingdays) {
    return {missingdays};
  }

  const useStyles = makeStyles((theme)=>({
    root: {
      width: '100%',
      display: 'flex',
     justifyContent: 'center',
     flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    },
    container: {
      maxHeight: 440,
    },
  }));
  



  
  export default function StickyHeadTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows,setRows]=useState([]);
    const [record,setRecord] = useState("")
  
    useEffect(async () => {
      const missinghours=await axios.get("http://localhost:3000/viewmissingOrExtraHours")
        const missinghoursArray=missinghours.data
        if(missinghours.data == "You have no missing or extra hours"){
            message.success("You have no missing or extra hours")
        }
        setRecord(missinghoursArray);
        const missingDays=await axios.get("http://localhost:3000/viewMissingDays")
        const missingDaysArray=missingDays.data.missingDays
        const result=[]
        missingDaysArray.map((days)=>{
          result.push(createData(days))
         })
         setRows(result);
  }, [])
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
      <div>
     <Chip label={record}/>
     <br/>   
    <Chip label={"The number of missing days:"+ rows.length} />  
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
                      console.log(row)
                      console.log(column.id)
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
  );
}
