import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { SeatProvider, SeatContext } from './SeatContext'
import TicketWidget from './TicketWidget'

import GlobalStyles from './GlobalStyles';

function App() {
  const {
    state: {numOfRows, hasLoaded, seats, seatsPerRow},
    action,
  } = React.useContext(SeatContext)
    React.useEffect(() => {
    fetch('/api/seat-availability')
      .then(res => res.json())
      .then(data => action.receiveSeatInfoFromServer(data));
  }, []);

  return (
    <>
      <GlobalStyles />
      <TicketWidget />
              {/* <button onClick={()=> {
                  fetch('/api/seat-availability')
                    .then(res=>res.json())
                    .then(data=> {
                      console.log(data)
                      action.receiveSeatInfoFromServer(data)
                      })
                  }
              }>TODO: write code</button>
        This venue has {numOfRows} rows, {seatsPerRow} seate per row, {hasLoaded? 'true': 'false'} */}
    </>
  );
}

export default App;
