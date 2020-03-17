import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';

import { SeatContext } from './SeatContext'
import { BookingContext } from './BookingContext'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const useStyles = makeStyles({
  table: {
    width: '100%',
    border: 'none',
    boxShadow: 'none',
  },
  cardInfo: {
    flex: '3',
    margin: '0 10px',
  },
  secondary : {
    flex: '1',
    margin: '0 10px',
  },
  form: {
    width: '100%',
    display: 'flex',
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  formInput: {
    display: 'flex',
    flexDirection: 'row',
  },
  error: {
    // width: '70vw',
    // height: '70vh',
    color: 'red',
    margin: '10px auto',
    paddingBottom: '10px',
  },

});


const PurchaseModal = () => {

  const bookingMade2 = (outcome) => {
    setCardInfo('');
    setExpiration('');
    markSeatAsPurchased(seatSelectedArr);
    bookingMade(outcome);
  }

  const handleSubmit= (cardInfo,expiration) => {
    awaitingResponse();

    fetch('/api/book-seat', {
        method: 'POST',
        body: JSON.stringify({
          "seatId": seatSelectedArr[0].seatId,
          "creditCard": cardInfo,
          "expiration": expiration,
            }),
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        },
      })
      .then(res=>res.json())
      .then(data=>{
        data.success ? bookingMade2(data) : bookingMade(data)
      })
  }

  const handleClose = () => {
    closeBookingProcess();
  };

  const calculatePrice = () => {
    let sum = 0;
    seatSelectedArr.forEach(seat=>sum+=seat.price);
    return sum
  }

  const classes = useStyles();

  const [cardInfo, setCardInfo] = React.useState('')
  const [expiration, setExpiration] = React.useState('')
  
  const {
      bookingState: {
          bookingSeatSelectedArr,
          status,
          error,
        },
      bookingAction: {
          closeBookingProcess,
          awaitingResponse,
          bookingMade,
        }
    } = React.useContext(BookingContext);

  const {
      seatState: {
        seatSelectedArr,
      },
      seatAction: {
        markSeatAsPurchased,
      },
    } = React.useContext(SeatContext);

  const rows = createData('Seat-info', bookingSeatSelectedArr);

  return(
    <Dialog
        open={status==='seats-selected' || status==='purchase-ticket-failure' || status==='awaiting-response'}
        TransitionComponent={Transition}
        className={classes.purchaseModal}
        onClose={handleClose}
      >
      <DialogTitle id="booking-form">{"Purchase ticket"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="booking-description">
            {`You are purchasing ${seatSelectedArr.length} ticket/s, for the price of $${calculatePrice()}`}
          </DialogContentText>
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
        </DialogContent>
        <DialogContent className={classes.form}>
          <form  noValidate autoComplete="off" onSubmit={(e)=>{e.preventDefault();handleSubmit(cardInfo,expiration)}}>
            <h2>Enter payment and expiration</h2>
            <div className={classes.formInput}>
              {/* <label htmlFor="" /> */}
              <TextField
                className={classes.cardInfo}
                name='cardInfo'
                id="cardInfo" label="Card information"
                type="text"
                value={cardInfo}
                onChange={ev => setCardInfo(ev.currentTarget.value)}
                variant="outlined"
              />
              <TextField
                className={classes.secondary}
                name='expiration'
                id="expiration" label="Expiration MMYY"
                type="text"
                value={expiration}
                onChange={ev => setExpiration(ev.currentTarget.value)}
                variant="outlined"
              />
              <Button 
                className={classes.secondary}
                variant="contained"
                color="primary"
                type='submit'
                >
                {status==='awaiting-response' ? <CircularProgress style={{color: 'black'}}/> : 'Purchase'}
              </Button>
            </div>
          </form>
          {error? <div className={classes.error}>{error}</div> : null}
        </DialogContent>
      </Dialog>
  )
}

export default PurchaseModal;