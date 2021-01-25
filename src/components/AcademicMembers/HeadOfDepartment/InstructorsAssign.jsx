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
    const [courseID,setCourseID] = React.useState("");
    const [InstructorID,setInstructorID] = React.useState(""); 
    const [newInstructorID,setNewInstructorID] = React.useState(""); 


    function handleCourseID(myCourseID) {
        setCourseID(myCourseID);
    }

    function handleInstructorID(myInstructorID) {
        setInstructorID(myInstructorID);
    }

    
    function handleNewInstructorID(myNewInstructorID) {
        setNewInstructorID(myNewInstructorID);
    }

    async function handleAssign(){
        try {
           let response =  await axios.post("http://localhost:3000/assign", {
                    id : InstructorID,
                    courseId : courseID
                });
            if(response.data === "This course does not belong to your department !!"){
                message.error(response.data);
            } 
            else if(response.data === "The id you entered does not belong to a ACADEMIC MEMBER !!"){
                message.error(response.data);
            }   
            else if(response.data === "This instructor does not belong to your depatrment !!"){
                message.error(response.data);
            }   
            else if(response.data === "This page can not be accessed !!"){
                message.error(response.data);
            }   
            else if(response.data === "This Instructor has been already assigned to this course !!"){
                message.error(response.data);
            }  
            else if(response.data === ("There is no Instructor with ID "+ InstructorID+ " !!")){
                message.error(response.data);
            }    
            else if(response.data === ("There is no Course with ID "+ courseID+ " !!")){
                message.error(response.data);
            }   
            else if(response.data === ("You entered wrong data !!")){
                message.error(response.data);
            }   
            else {
                message.success(response.data);
            }
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleUpdate(){
        try {
            let response =  await axios.post("http://localhost:3000/update", {
                     id : InstructorID,
                     id2 : newInstructorID,
                     courseId : courseID
                 });
             if(response.data === "This course does not belong to your department !!"){
                 message.error(response.data);
             } 
             else if(response.data === "The id you entered does not belong to an Instructor !!"){
                 message.error(response.data);
             }   
             else if(response.data === "This instructor does not belong to your depatrment !!"){
                 message.error(response.data);
             }   
             else if(response.data === "Make sure you entered the id of a instructor that teach the same department !!"){
                 message.error(response.data);
             }   
             else if(response.data === "This page can not be accessed !!"){
                 message.error(response.data);
             }  
             else if(response.data === "This Instructor does not teach this course !!"){
                 message.error(response.data);
             }
             else if(response.data === ("There is no Instructor with ID "+ InstructorID+ " !!")){
                 message.error(response.data);
             }    
             else if(response.data === ("There is no Course with ID "+ courseID+ " !!")){
                 message.error(response.data);
             } 
             else if(response.data === ("There is no Instructor with ID "+ newInstructorID+ " !!")){ 
                message.error(response.data);
            } 
            else if(response.data === ("There is no Instructor with ID "+ InstructorID+ " !! \n There is no Instructor with ID "+ newInstructorID+ " !!")){
                message.error(response.data);
            } 
            else if(response.data === ("There is no Instructor with ID "+ newInstructorID+ " !!"+"\n"+"There is no Course with ID "+ courseID+ " !!")){
                message.error(response.data);
            } 
            else if(response.data === ("There is no Instructor with ID "+ InstructorID+ " !!"+"\n"+"There is no Course with ID "+ courseID+ " !!")){
                message.error(response.data);
            }   
             else if(response.data === ("You entered wrong data !!")){
                 message.error(response.data);
             }   
             else {
                 message.success(response.data);
             }
         } catch (error) {
             console.log ("Error")
         }
    }

    async function handleDelete(locationName) {
        try {
            let response =  await axios.post("http://localhost:3000/delete", {
                     id : InstructorID,
                     courseId : courseID
                 });
             if(response.data === "This course does not belong to your department !!"){
                 message.error(response.data);
             } 
             else if(response.data === "The id you entered does not belong to a Instructor !!"){
                 message.error(response.data);
             }   
             else if(response.data === "This instructor does not belong to your depatrment !!"){
                 message.error(response.data);
             }   
             else if(response.data === "The id you entered does not belong to a Instructor !!"){
                 message.error(response.data);
             }   
             else if(response.data === "This page can not be accessed !!"){
                 message.error(response.data);
             }  
             else if(response.data === "This Instructor does not teach this course !!"){
                 message.error(response.data);
             }
             else if(response.data === ("There is no Instructor with ID "+ InstructorID+ " !!")){
                 message.error(response.data);
             }    
             else if(response.data === ("There is no Course with ID "+ courseID+ " !!")){
                 message.error(response.data);
             }   
             else if(response.data === ("You entered wrong data !!")){
                 message.error(response.data);
             }   
             else {
                 message.success(response.data);
             }
         } catch (error) {
             console.log ("Error")
         }
    }

    

    return (
        <Paper className={classes.root}>
            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Assign/Delete Course Instructor</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    <TxtField
                        key="newInstructorIDSelector"
                        name="InstructorID"
                        helperText="Type Instructor ID"
                        setText={handleInstructorID}
                    />
                   <TxtField
                        key="newCourseID"
                        name="CourseID"
                        helperText="Type Course ID"
                        setText={handleCourseID}
                    />
                    
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleAssign())}
                    >
                    Assign</Button>

                    <p />

                    <p />
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleDelete())}
                    >
                    Delete</Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1 className = "text-HeaderHR">Update Course Instructor</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    <TxtField
                        key="InstructorIDSelector"
                        name="InstructorID"
                        helperText="Type Instructor ID"
                        setText={handleInstructorID}
                    />

                    <TxtField
                        key="newInstructorIDSelector"
                        name="newInstructorID"
                        helperText="Type new Instructor ID"
                        setText={handleNewInstructorID}
                    />

                   <TxtField
                        key="newCourseID"
                        name="CourseID"
                        helperText="Type Course ID"
                        setText={handleCourseID}
                    />
                    
                </div>

                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleUpdate())}
                    >
                    Update</Button>
        <p />
            </div>
        </Paper>
    );
}
