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
    { id: "email", label: "Email", minWidth: 100, align: "center" },
    { id: "role", label: "Role", minWidth: 100, align: "center" },
    { id: "gender", label: "Gender", minWidth: 100, align: "center" },
    { id: "salary", label: "Salary", minWidth: 100, align: "center" },
    { id: "signedin", label: "SignedIn", minWidth: 100, align: "center" },
    { id: "faculty", label: "Faculty", minWidth: 100, align: "center" },
    { id: "department", label: "Department", minWidth: 100, align: "center" },
    { id: "dayoff", label: "DayOff", minWidth: 100, align: "center" },
    { id: "office", label: "Office", minWidth: 100, align: "center" },
    { id: "annualleavesBalance", label: "AnnualLeaves", minWidth: 100, align: "center" },
    { id: "accidentalLeavesBalance", label: "AccidentalLeaves", minWidth: 100, align: "center" },
    { id: "extraInfo", label: "ExtraInfo", minWidth: 100, align: "center" },
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
    const [updateid, setupdateID] = React.useState("");
    const [updatesalaryid, setupdatesalaryID] = React.useState("");
    const [viewattendanceid, setviewattendanceID] = React.useState("");
    const [addname, setaddName] = React.useState("");
    const [updatename, setupdateName] = React.useState("");
    const [addemail, setaddEmail] = React.useState("");
    const [updateemail, setupdateEmail] = React.useState("");
    const [addrole, setaddRole] = React.useState("HR");
    const [updaterole, setupdateRole] = React.useState("HR");
    const [addgender, setaddGender] = React.useState("Male");
    const [updategender, setupdateGender] = React.useState("Male");
    const [addsalary, setaddSalary] = React.useState(0);
    const [updatesalary, setupdateSalary] = React.useState(0);
    const [signedin, setSignedIn] = React.useState(false);
    const [addfaculty, setaddFaculty] = React.useState("");
    const [updatefaculty, setupdateFaculty] = React.useState("");
    const [adddepartment, setaddDepartment] = React.useState("");
    const [updatedepartment, setupdateDepartment] = React.useState("");
    const [adddayoff, setaddDayOff] = React.useState("Saturday");
    const [updatedayoff, setupdateDayOff] = React.useState("Saturday");
    const [addoffice, setaddOffice] = React.useState("");
    const [updateoffice, setupdateOffice] = React.useState("");
    const [missinghours, setMissingHours] = React.useState(0);
    const [extrahours, setExtraHours] = React.useState(0);
    const [annualleavesBalance, setAnnualLeavesBalance] = React.useState(0);
    const [accidentalLeavesBalance, setAccidentalLeavesBalance] = React.useState(0);
    const [addextraInfo, setaddExtraInfo] = React.useState("");
    const [updateextraInfo, setupdateExtraInfo] = React.useState("");
    const [officeNames, setOfficeNames] = React.useState([]);
    const [facultyNames, setFacultyNames] = React.useState([]);
    const [departmentNames, setDepartmentNames] = React.useState([]);


    const loadUsers = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3000/HR/viewUsers");
            setRows(response.data);
            const officeResponse = await axios.get("http://localhost:3000/HR/getOffices");
            setOfficeNames(officeResponse.data);
            setaddOffice(officeResponse.data[0]);
            setupdateOffice(officeResponse.data[0]);
            const facultyResponse = await axios.get("http://localhost:3000/HR/getFaculties");
            setFacultyNames(facultyResponse.data);
            setaddFaculty(facultyResponse.data[0]);
            setupdateFaculty(facultyResponse.data[0]);
            const departmentResponse = await axios.get("http://localhost:3000/HR/getDepartments");
            setDepartmentNames(departmentResponse.data);
            setaddDepartment(departmentResponse.data[0]);
            setupdateDepartment(departmentResponse.data[0]);
            
        
        } catch (error) {   
            setRows([]);
        }
    });
    
    React.useEffect(() => {
    loadUsers();}, []);


    function handleupdateID(myID) {
        setupdateID(myID);
    }

    function handleupdatesalaryID(myID) {
        setupdatesalaryID(myID);
    }

    function handleviewattendanceID(myID) {
        setviewattendanceID(myID);
    }

    function handleaddName(myName) {
        setaddName(myName);
    }

    function handleupdateName(myName) {
        setupdateName(myName);
    }
    
    function handleaddEmail(myEmail) {
        setaddEmail(myEmail);
    }

    function handleupdateEmail(myEmail) {
        setupdateEmail(myEmail);
    }

    function handleaddRole(myRole) {
        setaddRole(myRole);
    }

    function handleupdateRole(myRole) {
        setupdateRole(myRole);
    }

    function handleaddGender(myGender) {
        setaddGender(myGender);
    }

    function handleupdateGender(myGender) {
        setupdateGender(myGender);
    }

    function handleaddSalary(mySalary){
        setaddSalary(mySalary);
    }

    function handleupdateSalary(mySalary){
        setupdateSalary(mySalary);
    }

    function handleSignedIn(mySignedIn){
        setSignedIn(mySignedIn);
    }

    function handleaddFaculty(myFaculty){
        setaddFaculty(myFaculty);
    }

    function handleupdateFaculty(myFaculty){
        setupdateFaculty(myFaculty);
    }

    function handleaddDepartment(myDepartment){
        setaddDepartment(myDepartment);
    }

    function handleupdateDepartment(myDepartment){
        setupdateDepartment(myDepartment);
    }

    function handleaddDayOff(myDayOff){
        setaddDayOff(myDayOff);
    }

    function handleupdateDayOff(myDayOff){
        setupdateDayOff(myDayOff);
    }

    function handleaddOffice(myOffice){
        setaddOffice(myOffice);
    }

    function handleupdateOffice(myOffice){
        setupdateOffice(myOffice);
    }

    function handleMissingHours(myMissingHours){
        setMissingHours(myMissingHours);
    }

    function handleExtraHours(myExtraHours){
        setExtraHours(myExtraHours);
    }

    function handleAnnualLeavesBalance(myAnnualLeavesBalance){
        setAnnualLeavesBalance(myAnnualLeavesBalance);
    }

    function handleAccidentalLeavesBalance(myAccidentalLeavesBalance){
        setAccidentalLeavesBalance(myAccidentalLeavesBalance);
    }

    function handleaddExtraInfo(myExtraInfo){
        setaddExtraInfo(myExtraInfo);
    }

    function handleupdateExtraInfo(myExtraInfo){
        setupdateExtraInfo(myExtraInfo);
    }

   async function handleViewAttendance(){
        const response = await axios.post("http://localhost:3000/HR/viewAttendance",{id : viewattendanceid});
        if(response.data === "Please enter ID"){
            message.error(response.data);
        }
        else if(response.data === "This user has no attendance record or does not exist"){
            message.error(response.data);
        }
        else{
        setRows(response.data);
        }
    }

    async function handleAddUser(){
        try {
            let response = await axios.post("http://localhost:3000/HR/addUser", {
                name : addname,
                email : addemail,
                role : addrole,
                gender : addgender,
                salary: addsalary,
                signedin : signedin,
                faculty: addfaculty,
                department : adddepartment,
                dayoff : adddayoff,
                office : addoffice,
                extraInfo : addextraInfo
                });
                console.log(response.data)

              if(response.data==="User added successfully"){
                  message.success(response.data)
                  loadUsers()
              }else{
                  message.error(response.data)
              }
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

    async function handleUpdateUser(){
        try {
            let response = await axios.put("http://localhost:3000/HR/updateUser", { update :{
                name : updatename,
                role : updaterole,
                gender : updategender,
                signedin : signedin,
                faculty: updatefaculty,
                department : updatedepartment,
                dayoff : updatedayoff,
                office : updateoffice,
                missinghours : missinghours,
                extrahours : extrahours,
                annualleavesBalance : annualleavesBalance,
                accidentalLeavesBalance : accidentalLeavesBalance,
                extraInfo : updateextraInfo
            },
                id : updateid,
                });
                if(response.data === "Please enter ID"){
                    message.error(response.data);
                } 
                else if(response.data === "This user does not exist"){
                    message.error(response.data);
                } 
                else if(response.data === "user can not be assigned to a full office"){
                    message.error(response.data);
                }
                else {
                    loadUsers();
                    message.success(response.data);
                }     
                
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleUpdateUserSalary(){
        try {
           let response =  await axios.put("http://localhost:3000/HR/updateSalary", { update :{
            salary : updatesalary
            },
                id : updatesalaryid,
                });
                if(response.data === "Please enter ID"){
                    message.error(response.data);
                } 
                else if(response.data === "This user does not exist"){
                    message.error(response.data);
                }
                else if(response.data === "Salary must be updated"){
                    message.error(response.data);
                }
                else{
                    loadUsers();
                    message.success(response.data);
                }
        } catch (error) {
            console.log ("Error")
        }
    }


    async function handleDeleteUser(userID) {
        try {
            let response = await axios.post("http://localhost:3000/HR/deleteUser",{id : userID});
            if(response.data === "Please enter ID"){
                message.error(response.data);
            } 
            else if(response.data === "This user does not exist"){
                message.error(response.data);
            }
            else{
                loadUsers();
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
                                                            onClick ={() =>{handleDeleteUser(row.id)}}
                                                        />
                                                    )}
                                                    
                                                    {column.id === "id" && row.id}
                                                    {column.id === "name" && row.name}
                                                    {column.id === "email" && row.email}
                                                    {column.id === "role" && row.role}
                                                    {column.id === "gender" && row.gender}
                                                    {column.id === "salary" && row.salary}
                                                    {column.id === "signedin" && row.signedin}
                                                    {column.id === "faculty" && row.faculty}
                                                    {column.id === "department" && row.department}
                                                    {column.id === "dayoff" && row.dayoff}
                                                    {column.id === "office" && row.office}
                                                    {column.id === "missinghours" && row.missinghours}
                                                    {column.id === "extrahours" && row.extrahours}
                                                    {column.id === "annualleavesBalance" && row.annualleavesBalance}
                                                    {column.id === "accidentalLeavesBalance" && row.accidentalLeavesBalance}
                                                    {column.id === "extraInfo" && row.extraInfo}
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
                <h1 className = "text-HeaderHR">Add User</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>


                <TxtField
                    key="newaddUserNameSelector"
                    name="name"
                    helperText="Type User Name"
                    setText={handleaddName}
                />

                <TxtField
                    key="newaddUserEmailSelector"
                    name="email"
                    helperText="Type User Email "
                    setText={handleaddEmail} 
                />

                <Selector
                    key={"newaddRoleSelector"}
                    selects={['HR', 'ACADEMIC MEMBER']}
                    name="role"
                    helperText="Select User Role"
                    setSelector={handleaddRole}
                />

                <Selector
                    key={"newaddGenderSelector"}
                    selects={['Male', 'Female']}
                    name="gender"
                    helperText="Select User Gender"
                    setSelector={handleaddGender}
                />

                <TxtField
                    key="newaddUserSalarySelector"
                    name="salary"
                    helperText="Type User Salary "
                    setText={handleaddSalary} 
                />

                <Selector
                    key={"newaddFacultySelector"}
                    selects={facultyNames}
                   // name="faculty"
                    helperText="Select User Faculty"
                    setSelector={handleaddFaculty}
                />

                
                <Selector
                    key={"newaddDepartmentSelector"}
                    selects={departmentNames}
                    //name="department"
                    helperText="Select User Department"
                    setSelector={handleaddDepartment}
                />
                
                <Selector
                    key={"newaddOfficeSelector"}
                    selects={officeNames}
                    //name="office"
                    helperText="Select User Office"
                    setSelector={handleaddOffice}
                />

                
                <Selector
                    key={"newaddDayOffSelector"}
                    selects={['Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday']}
                    name="dayoff"
                    helperText="Select User DayOff"
                    setSelector={handleaddDayOff}
                />
                                
                <TxtField
                    key="newaddUserExtraInfoSelector"
                    name="extraInfo"
                    helperText="Type any extra info here "
                    setText={handleaddExtraInfo} 
                />
            </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleAddUser())}
                    >
                    Add</Button>

            </div>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Update User</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                <TxtField
                    key="newupdateUserIDSelector"
                    name="id"
                    helperText="Type User ID"
                    setText={handleupdateID}
                />

                <TxtField
                    key="newupdateUserNameSelector"
                    name="name"
                    helperText="Type User Name"
                    setText={handleupdateName}
                />

                <Selector
                    key={"newupdateRoleSelector"}
                    selects={['HR', 'ACADEMIC MEMBER']}
                    name="role"
                    helperText="Select User Role"
                    setSelector={handleupdateRole}
                />

                <Selector
                    key={"newupdateGenderSelector"}
                    selects={['Male', 'Female']}
                    name="gender"
                    helperText="Select User Gender"
                    setSelector={handleupdateGender}
                />

                <Selector
                    key={"newSignedInrSelector"}
                    selects={[true, false]}
                    name="signedin"
                    helperText="Select User SignedIn"
                    setSelector={handleSignedIn}
                />

                <Selector
                    key={"newupdateFacultySelector"}
                    selects={facultyNames}
                   // name="faculty"
                    helperText="Select User Faculty"
                    setSelector={handleupdateFaculty}
                />


                <Selector
                    key={"newupdateDepartmentSelector"}
                    selects={departmentNames}
                    //name="department"
                    helperText="Select User Department"
                    setSelector={handleupdateDepartment}
                />

                <Selector
                    key={"newupdateOfficeSelector"}
                    selects={officeNames}
                    //name="office"
                    helperText="Select User Office"
                    setSelector={handleupdateOffice}
                />


                <Selector
                    key={"newupdateDayOffSelector"}
                    selects={['Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday']}
                    name="dayoff"
                    helperText="Select User DayOff"
                    setSelector={handleupdateDayOff}
                />
  

                <TxtField
                    key="newUserAnnualLeavesBalanceSelector"
                    name="annualleavesBalance"
                    helperText="Type User Annual Leaves Balance "
                    setText={handleAnnualLeavesBalance} 
                /> 


                <TxtField
                    key="newUserAccidentalLeavesBalanceSelector"
                    name="accidentalLeavesBalance"
                    helperText="Type User Accidental Leaves Balance "
                    setText={handleAccidentalLeavesBalance} 
                /> 

                <TxtField
                    key="newUserExtraInfoSelector"
                    name="extraInfo"
                    helperText="Type any extra info here "
                    setText={handleupdateExtraInfo} 
                />

                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleUpdateUser())}
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

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Update User's Salary</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                <TxtField
                    key="newUserupdatesalaryIDSelector"
                    name="id"
                    helperText="Type User ID"
                    setText={handleupdatesalaryID}
                />        
                
                <TxtField
                    key="newUserupdateSalarySelector"
                    name="newSalary"
                    helperText="Type User Salary "
                    setText={handleupdateSalary} 
                />
                
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleUpdateUserSalary())}
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
            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">View User's Attendance</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                <TxtField
                    key="newUserviewattendanceIDSelector"
                    name="id"
                    helperText="Type User ID"
                    setText={handleviewattendanceID}
                />        
                
                
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleViewAttendance())}
                    >
                    View Attendance</Button>

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
