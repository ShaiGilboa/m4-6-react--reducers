import React from 'react';


export const SeatContext = React.createContext();

const initialState = {
  hasLoaded: false,
  seats: null,
  numOfRows: 0,
  seatsPerRow: 0,
  seatSelectedArr: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_INFO_FROM_SERVER":
        return { 
          ...state,
          hasLoaded: true,
          ...action.data,
          }
    case "MARK_AS_PURCHASED":
      const newSeats = JSON.parse(JSON.stringify(state.seats))
      action.seatSelectedArr.forEach(seat => {
        newSeats[seat.seatId].isBooked = 'purchased'
      });
      return {
        ...state,
        seats: JSON.parse(JSON.stringify(newSeats)),
        seatSelectedArr: [],
      }
    case "SEAT_SELECTED":
      return {
        ...state,
        seatSelectedArr: [...state.seatSelectedArr, action.data],
      }
    case "REMOVE":
      const newSeatSelectedArr = JSON.parse(JSON.stringify(state.seatSelectedArr))
      newSeatSelectedArr.splice(action.index, 1);
      return {
        ...state,
        seatSelectedArr: newSeatSelectedArr,
      }
    default:
      throw new Error (`Error: unknown action - ${action}`)
  }
}

export const SeatProvider = ({children}) => {
  const [seatState, dispatch] = React.useReducer(reducer, initialState);

  const receiveSeatInfoFromServer = data => {
    dispatch({
      type: 'GET_INFO_FROM_SERVER',
      data: {
        ...data,
      }
    });
  };

  const removeIndex = (index) => {
    if(index!==-1)dispatch({type: "REMOVE", index})
  }

  const markSeatAsPurchased = seatSelectedArr => {
    if(seatSelectedArr.length)dispatch({type: 'MARK_AS_PURCHASED', seatSelectedArr})
  }

  const addSeatToSelectedArr = data => {
    if(data)dispatch({type: "SEAT_SELECTED", data})
  }

  return (
    <SeatContext.Provider
      value={{
        seatState,
        seatAction: {
          receiveSeatInfoFromServer,
          markSeatAsPurchased,
          addSeatToSelectedArr,
          removeIndex,
        },
      }}
    >
      {children}
    </SeatContext.Provider>
  );
}