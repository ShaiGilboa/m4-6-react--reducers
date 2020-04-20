import React from 'react';

import { SeatContext } from './SeatContext'
import TicketWidget from './TicketWidget'

import GlobalStyles from './GlobalStyles';

function App() {
  const {
    seatAction:{
      receiveSeatInfoFromServer,
    },
  } = React.useContext(SeatContext)
  
  React.useEffect(() => {
    fetch('/api/seat-availability')
      .then(res => res.json())
      .then(data => receiveSeatInfoFromServer(data));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GlobalStyles />
      <TicketWidget />
    </>
  );
}

export default App;
