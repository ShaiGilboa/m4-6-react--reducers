export const getRowName = rowIndex => {
  return String.fromCharCode(65 + rowIndex);
};

export const getRowIndex = rowName => {
  return rowName.charCodeAt(0) - 65;
};

export const getSeatNum = seatIndex => seatIndex + 1;
export const getSeatIndex = seatNum => seatNum - 1;

