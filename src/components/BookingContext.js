import React from 'react';

export const BookingContext = React.createContext();

const initialState ={
  status: 'idle', /*- `idle`
                    - `seat-selected`
                    - `awaiting-response`
                    - `error`
                    - `purchased`*/
  error: null,
  selectedSeatId: null,
  price: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'BEGIN_BOOKING':
      return ({
        ...state,
        status: 'seat-selected',
        selectedSeatId: action.seatId,
        price: action.price,
      })
    case 'AWAIT':
      return ({
        ...state,
        status: 'awaiting-response',
        error: null,
      })
    case 'CLOSE':
      return ({
        ...initialState,
      })
    case 'SUCCESS':
      return ({
        ...initialState,
        status: 'purchase-ticket-success',
      })
    case 'ERROR':
      return ({
        ...state,
        status: 'purchase-ticket-failure',
        error: action.error
      })
    default:
      throw new Error(`error: unknown booking action: ${action}`);
  }

}

export const BookingProvider = ({children}) => {
  const [bookingState, dispatch] = React.useReducer(reducer, initialState);

  const beginBookingProcess = (seatId, price) => {
    dispatch({type: 'BEGIN_BOOKING', seatId, price})
    return 
  }

  const closeBookingProcess = () => {
    // console.log('pre',bookingState)
    dispatch({type: 'CLOSE'})
    // console.log('post',bookingState)

  }

  const awaitingResponse = () => {
    dispatch({type: 'AWAIT'})
  }

  const bookingMade = (outcome) => {
    outcome.success ? dispatch({type: 'SUCCESS'}) : dispatch({type: 'ERROR', error: outcome.message})
  }

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        bookingAction: {
          beginBookingProcess,
          closeBookingProcess,
          awaitingResponse, 
          bookingMade,
        }
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}