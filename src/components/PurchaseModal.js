import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';
import TableComponent from './TableComponent';

import { SeatContext } from './SeatContext';
import { BookingContext } from './BookingContext';
import Form from './Form';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({

  form: {
    width: '100%',
    display: 'flex',
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
    marginBottom: '20px',
    color: '#04395E',
  },

  error: {
    color: 'red',
    margin: '10px auto',
    paddingBottom: '10px',
  },

});

const PurchaseModal = () => {

  const bookingMadeSuccessClearStates = (outcome) => {
    setCardInfo('');
    setExpiration('');
    markSeatAsPurchased(seatSelectedArr);
    bookingMade(outcome);
  }

  const handleSubmit= (cardInfo,expiration) => {
    awaitingResponse();
    const seatIdArr = seatSelectedArr.map(seat=>(seat.seatId));

    fetch('/api/book-seat', {
        method: 'POST',
        body: JSON.stringify({
          "seatIdArr": seatIdArr,
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
        data.success ? bookingMadeSuccessClearStates(data) : bookingMade(data)
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

  return(
    <Dialog
        open={status==='seats-selected' || status==='purchase-ticket-failure' || status==='awaiting-response'}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
      <DialogTitle id="booking-form">
        {"Purchase ticket"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="booking-description">
          {`You are purchasing ${seatSelectedArr.length} ticket/s, for the price of $${calculatePrice()} total`}
        </DialogContentText>
        <TableComponent bookingSeatSelectedArr={bookingSeatSelectedArr} />
      </DialogContent>
      <DialogContent className={classes.form}>
      <Form 
        handleSubmit={handleSubmit}
        cardInfo={cardInfo}
        setCardInfo={setCardInfo}
        expiration={expiration}
        setExpiration={setExpiration}
        status={status}
        />
        {error? <div className={classes.error}>{error}</div> : null}
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseModal;