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
import Button from "@material-ui/core/Button";
import { message } from "antd";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "id", label: "ID", minWidth: 100 },
  {
    id: "date",
    label: "slotDate",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "course",
    label: "Course",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "accept",

    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "reject",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function createData(name, id, date, course, requestId) {
  return { name, id, date, course, requestId };
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

  useEffect(populateRows, []);

  async function rejectRequest(event) {
    const requestsData = await axios.post(
      "http://localhost:3000/rejectSlotLinkingRequest",
      { id: event.currentTarget.value }
    );
    if (requestsData.data === "request rejected succesfully") {
      message.success("Rejected succesfully");
      populateRows();
    } else {
      message.error(requestsData.data);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function populateRows() {
    const requestsData = await axios.get(
      "http://localhost:3000/getSlotLinkingRequests"
    );
    console.log(requestsData, "123123123");
    const requestsDataArray = requestsData.data;
    const result = [];
    // eslint-disable-next-line array-callback-return
    requestsDataArray.map((request) => {
      result.push(
        createData(
          request.name,
          request.id,
          request.date,
          request.course,
          request.requestId
        )
      );
    });
    console.log(result);
    setRows(result);
  }

  async function acceptRequest(event) {
    console.log(event.currentTarget);
    const requestsData = await axios.post(
      "http://localhost:3000/acceptSlotLinkingRequest",
      { id: event.currentTarget.value }
    );
    console.log(requestsData);
    if (requestsData.data === "request succesfully accepted") {
      populateRows();
      message.success("Accepted succesfully");
    } else {
      message.error(requestsData.data);
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      if (column.id === "accept") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {
                              <Button
                                variant="contained"
                                color="primary"
                                value={row["requestId"]}
                                onClick={acceptRequest}
                              >
                                Accept
                              </Button>
                            }
                          </TableCell>
                        );
                      }
                      if (column.id === "reject") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {
                              <Button
                                variant="contained"
                                color="secondary"
                                value={row["requestId"]}
                                onClick={rejectRequest}
                              >
                                Reject
                              </Button>
                            }
                          </TableCell>
                        );
                      }
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
  );
}
