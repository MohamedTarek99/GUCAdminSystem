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
    { id: "id", label: "ID", minWidth: 100, align: "center" },
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    { id: "faculties", label: "Faculties", minWidth: 100, align: "center" },
    { id: "department", label: "Department", minWidth: 100, align: "center" },
    { id: "coordinator", label: "Coordinator", minWidth: 100, align: "center" },
    { id: "instructors", label: "Instructors", minWidth: 100, align: "center" },
    { id: "teachingAssistants", label: "Teaching Assistants", minWidth: 100, align: "center" },
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
    const [id, setID] = React.useState("");
    const [name, setName] = React.useState("");
    const [faculties, setFaculties] = React.useState([]);
    const [department, setDepartment] = React.useState("");
    const [coordinator, setCoordinator] = React.useState("");
    const [instructors, setInstructors] = React.useState([]);
    const [teachingAssistants, setTeachingAssistants] = React.useState([]);

    const loadCourses = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3000/HR/viewCourses");
            setRows(response.data);
            // const coursesResponse = await axios.get("http://localhost:3000/HR/getCourses");
            // setCoursesIDs(coursesResponse.data);
        } catch (error) {   
            setRows([]);
        }
    });
    
    React.useEffect(() => {
    loadCourses();}, []);


    function handleID(myID) {
        setID(myID);
    }

    function handleName(myName) {
        setName(myName);
    }

    function handleFaculties(myFaculties){
        setFaculties(myFaculties);
    }

    function handleDepartment(myDepartment){
        setDepartment(myDepartment);
    }

    function handleCoordinator(myCoordinator){
        setCoordinator(myCoordinator);
    }

    function handleInstructors(myInstructors){
        setInstructors(myInstructors);
    }

    function handleTeachingAssistants(myTeachingAssistants){
        setTeachingAssistants(myTeachingAssistants);
    }

    async function handleAddCourse(){
        try {
            let response = await axios.post("http://localhost:3000/HR/addCourse", {
                id : id,
                name : name,
                faculties : faculties,
                department : department,
                coordinator : coordinator,
                instructors : instructors,
                teachingAssistants : teachingAssistants
                });

                if(response.data === "Please enter ID"){
                    message.error(response.data);
                } 
                else if(response.data === "This course already exists"){
                    message.error(response.data);
                } 
                else {
                    message.success(response.data);
                } 
                loadCourses();

        } catch (error) {
            console.log ("Error")
        }
    }

    // async function handleAddCourseUnderDepartment(){
    //     try {
    //         await axios.put("http://localhost:3000/HR/addCourseUnderDepartment",{department : name, id: courseID});
    //         loadDepartments();
    //     } catch (error) {
    //         console.log ("Error")
    //     }
    // }

    // async function handleDeleteCourseUnderDepartment(){
    //     try {
    //         await axios.put("http://localhost:3000/HR/deleteCourseUnderDepartment",{department : name, id: courseID});
    //         loadDepartments();
    //     } catch (error) {
    //         console.log ("Error")
    //     }
    // }

    async function handleUpdateCourse(){
        try {
           let response =  await axios.put("http://localhost:3000/HR/updateCourse", { update :{
                name : name,

                 
            },
                id : id,
                });

            
                if(response.data === "Please enter ID"){
                    message.error(response.data);
                } 
                else if(response.data === "This course already exists"){
                    message.error(response.data);
                } 
                else {
                    loadCourses();
                    message.success(response.data);
                }
                     
                
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleDeleteCourse(courseID) {
        try {
            let response = await axios.post("http://localhost:3000/HR/deleteCourse",{id : courseID});
            if(response.data === "Please enter ID"){
                message.error(response.data);
            } 
            else if(response.data === "This course does not exist"){
                message.error(response.data);
            } 
            else { 
                loadCourses();
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
                                                            onClick ={() =>{handleDeleteCourse(row.id)}}
                                                        />
                                                    )}
                                                    
                                                    {column.id === "id" && row.id}
                                                    {column.id === "name" && row.name}
                                                    {column.id === "faculties" && row.faculties}
                                                    {column.id === "department" && row.department}
                                                    {column.id === "coordinator" && row.coordinator}
                                                    {column.id === "instructors" && row.instructors}
                                                    {column.id === "teachingAssistants" && row.teachingAssistants}
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
                <h1 className = "text-HeaderHR">Add Course</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    {/* <Selector
                        key={"newTypeSelector"}
                        selects={['Office', 'Lab', 'Hall', 'Room']}
                        name="Type"
                        helperText="Select location type"
                        setSelector={handleDepartment}
                    /> */}
                    <TxtField
                        key="newCourseIDSelector"
                        name="id"
                        helperText="Type Course ID"
                        setText={handleID}
                    />
                    <TxtField
                        key="newDepartmentNameSelector"
                        name="name"
                        helperText="Type Course Name"
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
                    onClick = {() => (handleAddCourse())}
                    >
                    Add</Button>

            </div>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Update Course</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    {/* <Selector
                        key={"courseNameSelector"}
                        selects={coursesIDs}
                        //name="Type"
                        helperText="Select course name"
                        setSelector={handleCourseID}
                    /> */}
                    <TxtField
                        key="newCourseIDSelector"
                        name="id"
                        helperText="Type Course ID"
                        setText={handleID}
                    />
                    <TxtField
                        key="newDepartmentNameSelector"
                        name="name"
                        helperText="Type Course Name"
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
                    onClick = {() => (handleUpdateCourse())}
                    >
                    Update</Button>

                    <p />
                    {/* <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleDeleteCourseUnderDepartment())}
                    >
                    Delete</Button> */}
            </div>
        </Paper>
    );    
}
