import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import actualSeat from '../assets/seat-available.svg';

import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

import { SeatProvider, SeatContext } from './SeatContext'

import { getRowName, getSeatNum } from '../helpers';
import { range } from '../utils';

const Seat = ({seatId, rowIndex, price, status, tippyText}) => {
  switch (status) {
    case 'available':
      return (
          <Tippy content={ <span>{`${tippyText}$${price}`}</span>}>
            <Button onClick={()=>{console.log('clickl')}}>
              <img alt='seat' src={actualSeat} style={{filter: 'grayscale(100%)'}}/>
            </Button>
          </Tippy>
      )
      break;
    case 'unavailable':
      return (
        <Button disabled={true}>
          <img alt='seat' src={actualSeat} />
        </Button>
      );
    break;
    default:
      throw new Error(`error: unknown status of seat: ${seatId}`)
  }   
} 

const TicketWidget = () => {
  // TODO: use values from Context
  // const numOfRows = 6;
  // const seatsPerRow = 6;

  // TODO: implement the loading spinner <CircularProgress />
  // with the hasLoaded flag

  const {
    state: {numOfRows, hasLoaded, seats, seatsPerRow},
    action,
  } = React.useContext(SeatContext)
  if(!hasLoaded) return<CircularProgress style={{position: 'absolute', top: '50vh', left: '50vw'}}/>
  console.log('seatsPerRow', seatsPerRow)
  console.log('numOfRows', numOfRows)
  console.log('seats', seats)
  return (
    <Wrapper>
    
      {range(numOfRows).map(rowIndex => {
        const rowName = getRowName(rowIndex);
        return (
          <Row key={rowIndex}>
            <RowLabel>Row {rowName}</RowLabel>
            {range(seatsPerRow).map(seatIndex => {
              const seatId = `${rowName}-${getSeatNum(seatIndex)}`;
              return (<SeatWrapper key={seatId}>
                <Seat
                  rowIndex={rowIndex}
                  seatId={seatId}
                  price={seats[seatId].price}
                  status={seats[seatId].isBooked ? 'unavailable' : 'available'}
                  tippyText={`Row ${rowName}, seat ${seatIndex} - `}
                />
              </SeatWrapper>
              )
              })
            }
          </Row>
        );
      })}

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
`;

const SeatWrapper = styled.div`
  padding: 5px;
`;

export default TicketWidget;
