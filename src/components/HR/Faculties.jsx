import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Selector from "./Selector";
import TxtField from "./TxtField";
import {message} from "antd";
import "antd/dist/antd.css";

const columns = [
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    { id: "department", label: "Department", minWidth: 100, align: "center" },
    { id: "delete", label: "Delete", minWidth: 100, align: "center" }
];

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: "100%"
    },
    button: {
        width: '25ch',
    }
});

export default function StickyHeadTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [name, setName] = React.useState("");
    const [department, setDepartment] = React.useState([]);
    const [departmentName, setDepartmentName] = React.useState("");
    const [departmentNames, setDepartmentNames] = React.useState([]);

    const loadFaculties = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3000/HR/viewFaculties");
            setRows(response.data);
            const departmentResponse = await axios.get("http://localhost:3000/HR/getDepartments");
            setDepartmentNames(departmentResponse.data);
            setDepartmentName(departmentResponse.data[0]);
        } catch (error) {   
            setRows([]);
        }
    });
    
    React.useEffect(() => {
    loadFaculties();}, []);


    function handleName(myName) {
        setName(myName);
    }

    function handleDepartment(mydepartment){
        setDepartment(mydepartment);
    }

    function handleDepartmentName(myDepartmentName){
        setDepartmentName(myDepartmentName);
    }


    async function handleAddFaculty(){
        try {
            let response = await axios.post("http://localhost:3000/HR/addFaculty", {
                name : name,
                department : department
                });
                if(response.data === "Please enter name"){
                    message.error(response.data);
                } 
                else if(response.data === "This faculty already exists"){
                    message.error(response.data);
                } 
                else {
                    loadFaculties()
                    message.success(response.data);
                }    
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleAddDepartmentUnderFaculty(){
        try {
            console.log(departmentName)
            let response = await axios.put("http://localhost:3000/HR/addDepartmentUnderFaculty",{name : departmentName, faculty: name});
            if(response.data === "Please enter name"){
                message.error(response.data);
            } 
            else if(response.data === "Please enter faculty"){
                message.error(response.data);
            } 
            else if(response.data === "This department does not exist"){
                message.error(response.data);
            } 
            else if(response.data === "This faculty does not exist"){
                message.error(response.data);
            } 
            else if(response.data === "This department is already in faculty"){
                message.error(response.data);
            } 
            else {
                loadFaculties();
                message.success(response.data);
            } 
          
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleDeleteDepartmentUnderFaculty(){
        try {
            console.log("test")
            console.log(departmentName)
            let response = await axios.put("http://localhost:3000/HR/deleteDepartmentUnderFaculty",{name : departmentName, faculty: name});
            if(response.data === "Please enter name"){
                message.error(response.data);
            } 
            else if(response.data === "Please enter faculty"){
                message.error(response.data);
            } 
            else if(response.data === "This department does not exist"){
                message.error(response.data);
            } 
            else if(response.data === "This department is not in the faculty"){
                message.error(response.data);
            } 
            else {
                loadFaculties();
                message.success(response.data);
            } 
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleDeleteFaculty(facultyName) {
        try {
            let response = await axios.post("http://localhost:3000/HR/deleteFaculty",{name : facultyName});
            if(response.data === "Please enter name"){
                message.error(response.data);
            } 
            else if(response.data === "This faculty does not exist"){
                message.error(response.data);
            } 
            else {
                loadFaculties();
                message.success(response.data);
            } 
            
        } catch (error) {
            // handle Error Page here
            console.log(error)
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell align={column.align}>
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, rowIndex) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                        {columns.map((column, columnIndex) => {
                                            return (
                                                <TableCell
                                                    key={rowIndex + "" + columnIndex}
                                                    align={column.align}
                                                >
                                                    {column.id === "delete" && (
                                                        <DeleteIcon
                                                            key={row.id}
                                                            onClick ={() =>{handleDeleteFaculty(row.name)}}
                                                        />
                                                    )}

                                                    {column.id === "name" && row.name}
                                                    {column.id === "department" && row.department}
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
                rowsPerPageOptions={[5,10, 25, 100]}
                component= "div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Faculty</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    {/* <Selector
                        key={"newTypeSelector"}
                        selects={['Office', 'Lab', 'Hall', 'Room']}
                        name="Type"
                        helperText="Select location type"
                        setSelector={handleDepartment}
                    /> */}
                    <TxtField
                        key="newFacultyNameSelector"
                        name="name"
                        helperText="Type Faculty Name"
                        setText={handleName}
                    />

                    {/* <TxtField
                        key="newFacultyNameSelector"
                        name="name"
                        helperText="Type departments "
                        setText={handleDepartment} 
                    />  */}
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleAddFaculty())}
                    >
                    Add</Button>

            </div>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Departments under Faculty</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    <Selector
                        key={"departmentNameSelector"}
                        selects={departmentNames}
                        name="Department name"
                        helperText="Select department name"
                        setSelectod={handleDepartmentName}
                    />
                    <TxtField
                        key="facultyNameSelector"
                        name="name"
                        helperText="Type Faculty Name"
                        setText={handleName}
                    />
{/* 
                    <TxtField
                        key="departmentNameSelector"
                        name="name"
                        helperText="Type departments "
                        setText={handleDepartment} 
                    />  */}
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleAddDepartmentUnderFaculty())}
                    >
                    Add</Button>

                    <p />
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleDeleteDepartmentUnderFaculty())}
                    >
                    Delete</Button>
            </div>
        </Paper>
    );
}
