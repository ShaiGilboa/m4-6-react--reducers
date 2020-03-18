import React from 'react';
import styled from 'styled-components';

import actualSeat from '../assets/seat-available.svg';
import checkMark from '../assets/checkMark.png';

import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

const checkMarkStyle = {position: 'absolute', width: '20px',bottom: '0', right: '0'};

const Seat = ({seatId, rowIndex, price, status, tippyText, beginBookingProcess, seatSelect, seatSelectedArr}) => {
  switch (status.type) {
    case 'available':
      return (
          <Tippy content={ <span>{`${tippyText}$${price}`}</span>}>
            <Button onClick={()=>seatSelect(seatId, price)} style={{position:'relative'}}>
              <img alt='seat' src={actualSeat}/>
              {seatSelectedArr.some(seat=> seat.seatId === seatId) ? <img alt="check" src={checkMark} style={checkMarkStyle}/> : null}
            </Button>
          </Tippy>
      );
    case 'unavailable':
      return (
        <Button disabled={true} style={{position:'relative'}}>
          <img alt='seat' src={actualSeat} style={{filter: 'grayscale(100%)'}} />
          {status.purchased==='purchased' ? <img alt="check" src={checkMark} style={checkMarkStyle}/> : null}
        </Button>
      );
    default:
      throw new Error(`error: unknown status of seat: ${seatId}`)
  }   
} 

const Button = styled.button`
  border: none;
  color: none;
  width: fit-content;
  height: fit-content;
  margin: 0;
  padding: 0;
  cursor: pointer;
`;

export default Seat;