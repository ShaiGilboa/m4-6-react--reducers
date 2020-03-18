import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    borderColor: 'blue',
  },
  tableCell: {
    color: '#70A288',
    backgroundColor: '#DAB785',
  },
})

const TableComponent = ({ bookingSeatSelectedArr }) => {

  function createData(name, bookingSeatSelectedArr) {
    const seatsInfo = [];
    if(bookingSeatSelectedArr.length) bookingSeatSelectedArr.forEach(Aseat=> {
      const nameArr = Aseat.seatId.split('-');
      const row = nameArr[0];
      const seat = nameArr[1]
      seatsInfo.push({name, row, seat, price: Aseat.price})
    });
    return seatsInfo;
  }

  const classes = useStyles();

  const rows = createData('Seat-info', bookingSeatSelectedArr);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size='small' aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>Row</TableCell>
            <TableCell className={classes.tableCell}>Seat</TableCell>
            <TableCell className={classes.tableCell}>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={`${row.name}-${row.row}.${row.seat}`}>
              <TableCell component="th" scope="row" className={classes.tableCell}>
                {row.row}
              </TableCell>
              <TableCell className={classes.tableCell}>{row.seat}</TableCell>
              <TableCell className={classes.tableCell}>{row.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableComponent;