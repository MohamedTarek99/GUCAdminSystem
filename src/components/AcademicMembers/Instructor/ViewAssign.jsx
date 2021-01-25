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
import Dropdown from "react-bootstrap/Dropdown";
import Chip from "@material-ui/core/Chip";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
    id: "unassign",
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
  const [chosen, changeChosen] = useState("Course");
  const [rows, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [courses, setcourses] = useState([]);
  const [coverage, setCoverage] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [openUpdateForm, setUpdateForm] = React.useState(false);
  const [openDeleteForm, setDeleteForm] = React.useState(false);

  const [assignID, assignIDChange] = useState("");
  const [assignSlotID, assignSlotIDChange] = useState("");
  const [updateFormCurrentID, setUpdateFormCurrentID] = useState("");
  const [updateFormNewID, setUpdateFormNewID] = useState("");
  const [deleteAssignmentID, setDeleteAssignmentID] = useState("");

  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  function handleCurrentIDChange(event) {
    const { value } = event.target;
    setUpdateFormCurrentID(value);
  }
  function handleNewIDChange(event) {
    const { value } = event.target;
    setUpdateFormNewID(value);
  }
  function handleDeleteIDChange(event) {
    const { value } = event.target;
    setDeleteAssignmentID(value);
  }
  async function applyUpdate() {
    const res = await axios.put("http://localhost:3000/updateAssignment", {
      courseid: chosen,
      instructor: updateFormCurrentID,
      newinstructor: updateFormNewID,
    });
    console.log(res.data);
    if (res.data === "Assignment was updated succesfully") {
      populateRows(chosen);
      handleUpdateClose();
    } else {
      setUpdateError(res.data);
    }
  }
  function assignButtonAction(event) {
    console.log(event.currentTarget.value);
    assignSlotIDChange(event.currentTarget.value);
    handleClickOpen();
  }
  async function assignConfirmationAction(event) {
    const res = await axios.put("http://localhost:3000/assignSlot", {
      id: assignID,
      slot: assignSlotID,
    });
    if (res.data !== "Slot assigned Succesfully") {
      setError(res.data);
    } else {
      populateRows(chosen);
      handleClose();
    }
  }
  async function deleteConfirmation(event) {
    const res = await axios.put("http://localhost:3000/deleteAssignment", {
      instructor: deleteAssignmentID,
      courseid: chosen,
    });
    if (res.data !== "Assignment was deleted succesfully") {
      setDeleteError(res.data);
    } else {
      populateRows(chosen);
      handleDeleteClose();
    }
  }
  function handleIDChange(event) {
    const { value } = event.target;
    assignIDChange(value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    assignSlotIDChange("");
    assignIDChange("");
    setOpen(false);
  };
  const handleClickUpdateOpen = () => {
    setUpdateForm(true);
  };
  const handleUpdateClose = () => {
    setUpdateForm(false);
    setUpdateFormCurrentID("");
    setUpdateFormNewID("");
    setUpdateError("");
  };

  const handleClickDeleteOpen = () => {
    setDeleteForm(true);
  };
  const handleDeleteClose = () => {
    setDeleteForm(false);
    setDeleteAssignmentID("");
    setDeleteError("");
  };

  async function populateRows(course) {
    const slots = await axios.post("http://localhost:3000/courseAssignments", {
      id: course,
    });
    const response = slots.data;
    setCoverage(response.coverage);
    const slotsArray = response.Slots;
    const result = [];
    // eslint-disable-next-line array-callback-return
    slotsArray.map((slot) => {
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

  function handleClick(event) {
    console.log(event.target.text);
    changeChosen(event.target.text);

    populateRows(event.target.text);
  }

  function unassign(event) {
    console.log(event.target.value);
  }
  let coursesData;
  const classes = useStyles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    console.log("asa");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    coursesData = await axios.get("http://localhost:3000/getInstructorCourses");
    setcourses(coursesData.data);
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  console.log(courses);

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {chosen}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {courses.map((course) => {
            return (
              <Dropdown.Item onClick={handleClick}>{course.id}</Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      {chosen !== "Course" && (
        <div align="left">
          <Chip label={"Course Assignment:" + coverage + "%"} />
          <Button
            onClick={handleClickUpdateOpen}
            color="primary"
            variant="contained"
          >
            Update Assignment
          </Button>
          <Button
            onClick={handleClickDeleteOpen}
            color="secondary"
            variant="contained"
          >
            Delete Assignment
          </Button>
        </div>
      )}

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
                      {
                        // eslint-disable-next-line array-callback-return
                        columns.map((column) => {
                          if (column.id === "unassign") {
                            if (row["AcademicID"] != null) {
                              return (
                                <button value={row} onClick={unassign}>
                                  unassign
                                </button>
                              );
                            }
                          } else {
                            const value = row[column.id];

                            if (value === null && column.id === "instructor") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <Button
                                    value={row["ID"]}
                                    onClick={assignButtonAction}
                                    variant="contained"
                                    color="primary"
                                  >
                                    Assign
                                  </Button>
                                </TableCell>
                              );
                            } else {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            }
                          }
                        })
                      }
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
      <div>
        {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Assign</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                "Enter the ID of the Academic Member that you want to assign to this slot"
              }
            </DialogContentText>
            <p style={{ color: "red" }}>{error}</p>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Academic Member ID"
              type="text"
              fullWidth
              onChange={handleIDChange}
              value={assignID}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={assignConfirmationAction} color="primary">
              Assign
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}

        <Dialog
          open={openUpdateForm}
          onClose={handleUpdateClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {"Enter the IDs of the Academic members you want to update"}
            </DialogContentText>
            <p style={{ color: "red" }}>{updateError}</p>

            <TextField
              autoFocus
              margin="dense"
              id="firstID"
              label="Current Academic Member ID"
              type="text"
              fullWidth
              onChange={handleCurrentIDChange}
              value={updateFormCurrentID}
            />

            <TextField
              autoFocus
              margin="dense"
              id="newID"
              label="New Academic Member ID"
              type="text"
              fullWidth
              onChange={handleNewIDChange}
              value={updateFormNewID}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateClose} color="primary">
              Cancel
            </Button>
            <Button onClick={applyUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
        <Dialog
          open={openDeleteForm}
          onClose={handleDeleteClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete Assignment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                "Enter the ID of the Academic Member that you want to unassign from this course "
              }
            </DialogContentText>
            <p style={{ color: "red" }}>{deleteError}</p>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Academic Member ID"
              type="text"
              fullWidth
              onChange={handleDeleteIDChange}
              value={deleteAssignmentID}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="primary">
              Cancel
            </Button>
            <Button onClick={deleteConfirmation} color="primary">
              DeleteAssignment
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
