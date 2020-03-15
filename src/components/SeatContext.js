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
      break;
  
    default:
      throw new Error (`Error: unknown action - ${action}`)
  }
}

export const SeatProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const receiveSeatInfoFromServer = data => {
    console.log('func')
    dispatch({
      type: 'GET_INFO_FROM_SERVER',
      data: {
        ...data,
      }
    });
  };
  const markSeatAsPurchased = data => {

  }

  return (
    <SeatContext.Provider
      value={{
        state,
        action: {
          receiveSeatInfoFromServer,
          markSeatAsPurchased,
        },
      }}
    >
      {children}
    </SeatContext.Provider>
  );
}