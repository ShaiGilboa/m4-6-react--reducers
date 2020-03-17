import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import actualSeat from '../assets/seat-available.svg';

import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { SeatContext } from './SeatContext'
import { BookingContext } from './BookingContext'
import PurchaseModal from './PurchaseModal';

import { getRowName, getSeatNum } from '../helpers';
import { range } from '../utils';

const Seat = ({seatId, rowIndex, price, status, tippyText, beginBookingProcess}) => {
  switch (status) {
    case 'available':
      return (
          <Tippy content={ <span>{`${tippyText}$${price}`}</span>}>
            <Button onClick={()=>beginBookingProcess(seatId, price)}>
              <img alt='seat' src={actualSeat}/>
            </Button>
          </Tippy>
      );
    case 'unavailable':
      return (
        <Button disabled={true}>
          <img alt='seat' src={actualSeat} style={{filter: 'grayscale(100%)'}} />
        </Button>
      );
    default:
      throw new Error(`error: unknown status of seat: ${seatId}`)
  }   
} 

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TicketWidget = () => {
  const handleCloseSnack = () => {
    closeBookingProcess();
  }

  const {
      seatState: {numOfRows, hasLoaded, seats, seatsPerRow},
      seatAction: {
        markSeatAsPurchased,
      },
    } = React.useContext(SeatContext);

  const {
      bookingState: {
          selectedSeatId,
          status,
        },
      bookingAction: {
          beginBookingProcess,
          closeBookingProcess,
        }
    } = React.useContext(BookingContext);

  if(!hasLoaded) return<CircularProgress style={{position: 'absolute', top: '50vh', left: '50vw'}}/>

  if(status==='purchase-ticket-success') markSeatAsPurchased(selectedSeatId);

  return (
    <Wrapper>
    
      {range(numOfRows).map(rowIndex => {
        const rowName = getRowName(rowIndex);
        return (
          <Row key={rowIndex}>
            <RowLabel><p>Row {rowName}</p></RowLabel>
            {range(seatsPerRow).map(seatIndex => {
              const seatId = `${rowName}-${getSeatNum(seatIndex)}`;
              return (<SeatWrapper key={seatId}>
                <Seat
                  rowIndex={rowIndex}
                  seatId={seatId}
                  price={seats[seatId].price}
                  status={seats[seatId].isBooked ? 'unavailable' : 'available'}
                  tippyText={`Row ${rowName}, seat ${seatIndex+1} - `}
                  beginBookingProcess={beginBookingProcess}
                />
              </SeatWrapper>
              )
              })
            }
          </Row>
        );
      })}
      <PurchaseModal />
      <Snackbar open={status==='purchase-ticket-success'} autoHideDuration={4000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          Successfully completed the purchase! Enjoy the show!
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};

const Button = styled.button`
  border: none;
  color: none;
  width: fit-content;
  height: fit-content;
  margin: 0;
  padding: 0;
  cursor: pointer;
`;

const Wrapper = styled.div`
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px;
  margin: 20px auto;
  width: fit-content;
  height: fit-content;
`;

const Row = styled.div`
  display: flex;
  position: relative;

  &:not(:last-of-type) {
    border-bottom: 1px solid #ddd;
  }
`;

const RowLabel = styled.div`
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  p{
    color: black;
  }
`;

const SeatWrapper = styled.div`
  padding: 5px;
`;

export default TicketWidget;
