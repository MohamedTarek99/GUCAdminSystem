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
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "id", label: "ID", minWidth: 100 },
  { id: "role", label: "Course Role", minWidth: 100 },

  {
    id: "gender",
    label: "Gender",
    minWidth: 150,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "department",
    label: "Department",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "faculty",
    label: "Faculty",
    minWidth: 150,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "office",
    label: "Office",
    minWidth: 150,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "dayoff",
    label: "Dayoff",
    minWidth: 150,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(
  name,
  id,
  role,
  email,
  gender,
  department,
  faculty,
  dayoff,
  office
) {
  return { name, id, role, email, gender, department, faculty, dayoff, office };
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
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);
  const [chosen, changeChosen] = useState("Course");
  const [courses, setcourses] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  const [assignID, assignIDChange] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setError("");
    setOpen(false);
    assignIDChange("");
  };

  function handleIDChange(event) {
    const { value } = event.target;
    assignIDChange(value);
  }
  function handleClick(event) {
    console.log(event.target.text);
    changeChosen(event.target.text);

    populateRows(event.target.text);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    console.log("asa");
    const coursesData = await axios.get(
      "http://localhost:3000/getInstructorCourses"
    );
    setcourses(coursesData.data);
  }, []);

  async function assignCoordinator() {
    const staffData = await axios.put(
      "http://localhost:3000/assignCoordinator",
      { courseid: chosen, instructorid: assignID }
    );
    if (staffData.data === "Coordinator assigned succesfully!") {
      populateRows(chosen);
      handleClose();
    } else {
      setError(staffData.data);
    }
  }
  async function populateRows(course) {
    const staffData = await axios.post(
      "http://localhost:3000/viewCourseStaff",
      { course: course }
    );
    const staffDataArray = staffData.data;
    console.log(staffDataArray);
    const result = [];
    for (let index = 0; index < staffDataArray.length; index++) {
      const element = staffDataArray[index];
      let role;
      let cur;
      if (element.Coordinator != null) {
        role = "Coordinator";
        cur = element.Coordinator;
        console.log(cur);
      } else {
        if (element.Instructors != null) {
          role = "Instructor";
          cur = element.Instructors;
        } else {
          role = "Teaching Assistant";
          cur = element["Teaching Assistants"];
        }
      }

      // eslint-disable-next-line array-callback-return
      cur.map((staff) => {
        if (staff != null)
          result.push(
            createData(
              staff.name,
              staff.id,
              role,
              staff.email,
              staff.gender,
              staff.department,
              staff.faculty,
              staff.dayoff,
              staff.office
            )
          );
      });
    }

    console.log(result);
    setRows(result);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
          <Button onClick={handleClickOpen} color="primary" variant="contained">
            Assign Coordinator
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
                      {columns.map((column) => {
                        const value = row[column.id];
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
              "Enter the ID of the Academic Member that you want to assign as an coordinator to this course"
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
          <Button onClick={assignCoordinator} color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
