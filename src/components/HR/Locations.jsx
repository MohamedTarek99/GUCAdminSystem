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
    { id: "type", label: "Type", minWidth: 100, align: "center" },
    { id: "capacity", label: " Capacity", minWidth: 100, align: "center" },
    { id: "maxCapacity", label: "Max capacity", minWidth: 100, align: "center" },
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
    const [type, setType] = React.useState("Office");
    const [name, setName] = React.useState("");
    const [capacity, setCapacity] = React.useState(0);
    const [maxCapacity, setMaxCapacity] = React.useState(0);

    const loadLocations = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3000/HR/viewLocations");
            setRows(response.data);
        } catch (error) {   
            setRows([]);
        }
    });
    
    React.useEffect(() => {
    loadLocations();}, []);

    function handleType(myType) {
        setType(myType);
    }

    function handleName(myName) {
        setName(myName);
    }

    function handleCapacity(myCapacity){
        setCapacity(myCapacity);
    }

    function handleMaxCapacity(myMaxCapacity){
        setMaxCapacity(myMaxCapacity);
    }

    async function handleAddLocation(){
        try {
           let response =  await axios.post("http://localhost:3000/HR/addLocation", {
                name : name,
                type : type,
                capacity : capacity,
                maxCapacity : maxCapacity
                });
            if(response.data === "This room already exists"){
                message.error(response.data);
            } 
            else if(response.data === "Please enter correct capacity and maxCapacity"){
                message.error(response.data);
            }   
            else {
                loadLocations()
                message.success("Location added successfully");
            }
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleUpdateLocation(){
        try {
           let response = await axios.put("http://localhost:3000/HR/updateLocation", { update :{
                type : type,
                capacity : capacity,
                maxCapacity : maxCapacity
            },
                name : name,
                });
                if(response.data === "This room does not exist"){
                    message.error(response.data);
                } 
                else if(response.data === "Capacity of this room can not be updated"){
                    message.error(response.data);
                }   
                else {
                    loadLocations();
                    message.success(response.data);
                }  
                
        } catch (error) {
            console.log ("Error")
        }
    }

    async function handleDeleteLocation(locationName) {
        try {
            let response = await axios.post("http://localhost:3000/HR/deleteLocation",{name : locationName});
            if(response.data === "This room does not exist"){
                message.error(response.data);
            } 
            else {
                loadLocations();
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
                                                            onClick ={() =>{handleDeleteLocation(row.name)}}
                                                        />
                                                    )}

                                                    {column.id === "maxCapacity" && row.maxCapacity}
                                                    {column.id === "capacity" && row.capacity}
                                                    {column.id === "name" && row.name}
                                                    {column.id === "type" && row.type}
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
                <h1 className = "text-HeaderHR">Location</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    <Selector
                        key={"newTypeSelector"}
                        selects={['Office', 'Lab', 'Hall', 'Room']}
                        name="Type"
                        helperText="Select location type"
                        setSelector={handleType}
                    />
                    <TxtField
                        key="newLocationNameSelector"
                        name="Name"
                        helperText="Type Location Name"
                        setText={handleName}
                    />
                   <TxtField
                        key="newLocationSize"
                        name="Capacity"
                        helperText="Type capacity"
                        setText={handleCapacity}
                        type="number"
                    />
                    <TxtField
                        key="newLocationMaxSize"
                        name="Max Capacity"
                        helperText="Type max capacity"
                        setText={handleMaxCapacity}
                        type="number"
                    />
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleAddLocation())}
                    >
                    Add</Button>

                    <p />
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (handleUpdateLocation())}
                    >
                    Update</Button>
            </div>
        </Paper>
    );
}
