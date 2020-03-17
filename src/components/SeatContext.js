import React from 'react';


export const SeatContext = React.createContext();

const initialState = {
  hasLoaded: false,
  seats: null,
  numOfRows: 0,
  seatsPerRow: 0,
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
      return {
        ...state,
        seats: {
          ...state.seats,
          [action.selectedSeatId] : {
            ...state.seats[action.selectedSeatId],
            isBooked: true,
          }
        }
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

  const markSeatAsPurchased = selectedSeatId => {
    if(selectedSeatId)dispatch({type: 'MARK_AS_PURCHASED', selectedSeatId})
  }

  return (
    <SeatContext.Provider
      value={{
        seatState,
        seatAction: {
          receiveSeatInfoFromServer,
          markSeatAsPurchased,
        },
      }}
    >
      {children}
    </SeatContext.Provider>
  );
}