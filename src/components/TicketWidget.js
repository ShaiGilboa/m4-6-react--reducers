import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { SeatContext } from './SeatContext'
import { BookingContext } from './BookingContext'
import PurchaseModal from './PurchaseModal';
import Seat from './Seat';

import { getRowName, getSeatNum } from '../helpers';
import { range } from '../utils';

const purchaseButtonStyle = {position: '-webkit-sticky', position: 'sticky', bottom:'0', height: '10vh', width:'100%', fontWeight:'900', zIndex:'1',}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TicketWidget = () => {
  const handleCloseSnack = () => {
    closeBookingProcess();
  }

  const seatSelect = (seatId, price) => {
    const index = seatSelectedArr.findIndex(seat=> seat.seatId === seatId)
    index === -1 ? addSeatToSelectedArr({seatId, price}) : removeIndex(index)
  }

  const {
      seatState: {
        numOfRows,
        hasLoaded,
        seats,
        seatsPerRow,
        seatSelectedArr,
        },
      seatAction: {
        markSeatAsPurchased,
        addSeatToSelectedArr,
        removeIndex,
      },
    } = React.useContext(SeatContext);

  const {
      bookingState: {
          bookingSeatSelectedArr,
          status,
        },
      bookingAction: {
          beginBookingProcess,
          closeBookingProcess,
        }
    } = React.useContext(BookingContext);

  if(!hasLoaded) return<CircularProgress style={{position: 'absolute', top: '50vh', left: '50vw'}}/>

  if(status==='purchase-ticket-success') markSeatAsPurchased(bookingSeatSelectedArr);

  return (
    <>
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
                  status={seats[seatId].isBooked ? {type:'unavailable', purchased:seats[seatId].isBooked} : {type:'available'}}
                  tippyText={`Row ${rowName}, seat ${seatIndex+1} - `}
                  beginBookingProcess={beginBookingProcess}
                  seatSelect={seatSelect}
                  seatSelectedArr={seatSelectedArr}
                />
              </SeatWrapper>
              )
              })
            }
          </Row>
        );
      })}
      <PurchaseModal />
      {seatSelectedArr.length ? <button onClick={()=> beginBookingProcess(seatSelectedArr)} style={purchaseButtonStyle}>Purchase</button> : null}
      <Snackbar open={status==='purchase-ticket-success'} autoHideDuration={4000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          Successfully completed the purchase! Enjoy the show!
        </Alert>
      </Snackbar>
    </Wrapper>
  </>
  );
};

const Wrapper = styled.div`
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px;
  margin: 20px auto;
  width: fit-content;
  height: fit-content;
  position: relative;
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
