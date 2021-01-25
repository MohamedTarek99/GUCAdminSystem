import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { message } from "antd";
import "antd/dist/antd.css";

const columns = [
  { id: "course", label: "Couse", minWidth: 170 },
  { id: "date", label: "Date", minWidth: 100 },
  {
    id: "location",
    label: "Location",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "instructor",
    label: "AcademicID",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "AcademicName",
    label: "AcademicName",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "update",
    label: "",
    minWidth: 100,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "delete",
    label: "",
    minWidth: 100,
    align: "left",
    format: (value) => value.toFixed(2),
  },
];

function createData(course, date, location, instructor, AcademicName, ID) {
  return { course, date, location, instructor, AcademicName, ID };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});
export default function StickyHeadTable() {
  axios.defaults.headers.common["token"] = localStorage.getItem("JWT");
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setData] = useState([]);
  const [updateSlot, setSlot] = useState("");
  const [updateLocation, setUpdateLocation] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [open, setOpen] = React.useState(false);
  const [addopen, setAddOpen] = React.useState(false);
  const [time, settime] = useState("2021-01-24T10:30");
  const error = "";

  useEffect(populateRows, []);
  function changeUpdateSlot(event) {
    setUpdateLocation(event.target.value);
  }
  async function addConfirmation() {
    const date = new Date(time);
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const response = await axios.post("http://localhost:3000/addSlot", {
      day: day,
      time: hours,
      minutes: minutes,
      month: month,
      year: year,
      location: addLocation,
    });
    if (response.data === "Slot added") {
      handleAddClose();
      populateRows();
      message.success(response.data);
    } else {
      message.error(response.data);
    }
  }
  async function UpdateSlotConfirmation() {
    const response = await axios.put("http://localhost:3000/updateSlot", {
      slot: updateSlot,
      location: updateLocation,
    });
    if (response.data === "Location updated sucessfully") {
      populateRows();
      handleClose();
      message.success(response.data);
    } else {
      message.error(response.data);
    }
  }

  function handleClickOpenUpdate(event) {
    setSlot(event.currentTarget.value);
    setOpen(true);
  }

  const handleClose = () => {
    setUpdateLocation("");
    setOpen(false);
  };

  function handleClickOpenAdd() {
    setAddOpen(true);
  }

  const handleAddClose = () => {
    setAddLocation("");
    setAddOpen(false);
  };
  function handleAddLocationChange(event) {
    setAddLocation(event.target.value);
  }
  async function deleteSlot(event) {
    const slots = await axios.put("http://localhost:3000/deleteSlot", {
      id: event.currentTarget.value,
    });
    if (slots.data === "slot deleted succesfully") {
      populateRows();
    } else {
      message.error(slots.data);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function populateRows() {
    const slots = await axios.get("http://localhost:3000/viewCoordinatorSlots");
    console.log(slots);
    const response = slots.data;
    const result = [];
    console.log(response);
    // eslint-disable-next-line array-callback-return
    response.map((slot) => {
      result.push(
        createData(
          slot.course,
          slot.date,
          slot.location,
          slot.instructor,
          slot.AcademicName,
          slot._id
        )
      );
    });
    setData(result);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function changeTime(event) {
    event.preventDefault();
    settime(event.target.value);
  }
  return (
    <div>
      <Button onClick={handleClickOpenAdd} variant="contained">
        Add Slot
      </Button>
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === "update") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant="contained"
                                color="primary"
                                value={row["ID"]}
                                onClick={handleClickOpenUpdate}
                              >
                                Update{" "}
                              </Button>
                            </TableCell>
                          );
                        }
                        if (column.id === "delete") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant="contained"
                                color="secondary"
                                value={row["ID"]}
                                onClick={deleteSlot}
                              >
                                Delete{" "}
                              </Button>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update Slot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Enter the new Location of the slot"}
          </DialogContentText>
          <p style={{ color: "red" }}>{error}</p>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Location"
            type="text"
            onChange={changeUpdateSlot}
            fullWidth
            value={updateLocation}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={UpdateSlotConfirmation} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={addopen}
        onClose={handleAddClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Slot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Enter the details of the new slot you want to add"}
          </DialogContentText>
          <p style={{ color: "red" }}>{error}</p>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Location"
            type="text"
            onChange={handleAddLocationChange}
            fullWidth
            value={addLocation}
            required
          />
          <TextField
            id="datetime-local"
            label="Next appointment"
            type="datetime-local"
            defaultValue="2017-05-24T10:30"
            className={classes.textField}
            onChange={changeTime}
            value={time}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addConfirmation} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
