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
    { id: "faculties", label: "Faculties", minWidth: 100, align: "center" },
    { id: "courses", label: "Courses", minWidth: 100, align: "center" },
    { id: "HOD", label: "HOD", minWidth: 100, align: "center" },
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
    const [faculties, setFaculties] = React.useState([]);
    const [courses, setCourses] = React.useState([]);
    const [HOD, setHOD] = React.useState("");
    const [courseID, setCourseID] = React.useState("");
    const [coursesIDs, setCoursesIDs] = React.useState([]);

    const loadDepartments = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3000/HR/viewDepartments");
            setRows(response.data);
            const coursesResponse = await axios.get("http://localhost:3000/HR/getCourses");
            setCoursesIDs(coursesResponse.data);
            setCourseID(coursesResponse.data[0]);
        } catch (error) {   
            setRows([]);
        }
    });
    
    React.useEffect(() => {
    loadDepartments();}, []);


    function handleName(myName) {
        setName(myName);
    }

    function handleFaculties(myFaculties){
        setFaculties(myFaculties);
    }

    function handleCourses(myCourses){
        setCourses(myCourses);
    }

    function handleHOD(myHOD){
        setHOD(myHOD);
    }

    function handleCourseID(myCourseID){
        setCourseID(myCourseID);
    }


    async function handleAddDepartment(){
        try {
            let response = await axios.post("http://localhost:3000/HR/addDepartment", {
                name : name,
                faculties : faculties,
                courses : courses,
                HOD : HOD
                });
                if(response.data === "Please enter name"){
                    message.error(response.data);
                } 
                else if(response.data === "This department already exists"){
                    message.error(response.data);
                } 
                else {
                    loadDepartments();
                    message.success(response.data);
                }    
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleAddCourseUnderDepartment(){
        try {
            let response = await axios.put("http://localhost:3000/HR/addCourseUnderDepartment",{department : name, id: courseID});
            console.log(courseID)
            if(response.data === "Please enter ID"){
                message.error(response.data);
            } 
            else if(response.data === "Please enter department"){
                message.error(response.data);
            } 
            else if(response.data === "This department does not exist"){
                message.error(response.data);
            } 
            else if(response.data === "This course does not exist"){
                message.error(response.data);
            } 
            else if(response.data === "This course is already in department"){
                message.error(response.data);
            } 
            else {
                loadDepartments();
                message.success(response.data);
            } 
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleDeleteCourseUnderDepartment(){
        try {
            let response = await axios.put("http://localhost:3000/HR/deleteCourseUnderDepartment",{department : name, id: courseID});
            if(response.data === "Please enter ID"){
                message.error(response.data);
            } 
            else if(response.data === "Please enter deaprtment"){
                message.error(response.data);
            } 
            else if(response.data === "This course does not exist"){
                message.error(response.data);
            } 
            else if(response.data === "This course is not in the department"){
                message.error(response.data);
            } 
            else {
                loadDepartments();
                message.success(response.data);
            } 
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleAssignHODToDepartment(){
        try {
            let response = await axios.put("http://localhost:3000/HR/assignHODToDepartment", {
                name : name,
                HOD : HOD
                });
                if(response.data === "Please enter name"){
                    message.error(response.data);
                } 
                else if(response.data === "This department does not exist"){
                    message.error(response.data);
                } 
                else if(response.data === "This user does not exist"){
                    message.error(response.data);
                } 
                else if(response.data === "HR can not be assigned to department"){
                    message.error(response.data);
                } 
                else {
                    loadDepartments();
                    message.success(response.data);
                }    
        } catch (error) {
            console.log ("Error")
        }
    }
    async function handleDeleteDepartment(departmentName) {
        try {
           let response =  await axios.post("http://localhost:3000/HR/deleteDepartment",{name : departmentName});
           if(response.data === "Please enter name"){
            message.error(response.data);
        } 
        else if(response.data === "This department does not exist"){
            message.error(response.data);
        } 
        else {
            loadDepartments();
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
                                                            onClick ={() =>{handleDeleteDepartment(row.name)}}
                                                        />
                                                    )}

                                                    {column.id === "name" && row.name}
                                                    {column.id === "faculties" && row.faculties}
                                                    {column.id === "courses" && row.courses}
                                                    {column.id === "HOD" && row.HOD}
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
                <h1 className = "text-HeaderHR">Department</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    {/* <Selector
                        key={"newTypeSelector"}
                        selects={['Office', 'Lab', 'Hall', 'Room']}
                        name="Type"
                        helperText="Select location type"
                        setSelector={handleDepartment}
                    /> */}
                    <TxtField
                        key="newDepartmentNameSelector"
                        name="name"
                        helperText="Type Department Name"
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
                    onClick = {() => (handleAddDepartment())}
                    >
                    Add</Button>

            </div>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Assign HOD</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    {/* <Selector
                        key={"newTypeSelector"}
                        selects={['Office', 'Lab', 'Hall', 'Room']}
                        name="Type"
                        helperText="Select location type"
                        setSelector={handleDepartment}
                    /> */}
                    <TxtField
                        key="newDepartmentNameSelector"
                        name="name"
                        helperText="Type Department Name"
                        setText={handleName}
                    />

                    <TxtField
                        key="newHODSelector"
                        name="HOD"
                        helperText="Type HOD "
                        setText={handleHOD} 
                    /> 
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleAssignHODToDepartment())}
                    >
                    Assign</Button>

            </div>
 

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Courses under Department</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    <Selector
                        key={"courseNameSelector"}
                        selects={coursesIDs}
                        //name="Type"
                        helperText="Select course name"
                        setSelector={handleCourseID}
                    />
                    <TxtField
                        key="departmentNameSelector"
                        name="name"
                        helperText="Type Department Name"
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
                    onClick = {() => (handleAddCourseUnderDepartment())}
                    >
                    Add</Button>

                    <p />
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleDeleteCourseUnderDepartment())}
                    >
                    Delete</Button>
            </div>
        </Paper>
    );    
}
