import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  cardInfo: {
    flex: '3',
    margin: '0 10px',
  },
  secondary : {
    flex: '1',
    margin: '0 10px',
  },
    formInput: {
    display: 'flex',
    flexDirection: 'row',
  },
});

const Form = ({ handleSubmit, cardInfo, setCardInfo, expiration, setExpiration, status }) => {

  const classes = useStyles();

  return (
    <form  noValidate autoComplete="off" onSubmit={(e)=>{e.preventDefault();handleSubmit(cardInfo,expiration)}}>
      <h2>Enter payment and expiration</h2>
      <div className={classes.formInput} >
        <TextField
          className={classes.cardInfo}
          name='cardInfo'
          id="cardInfo" label="Card information"
          type="text"
          value={cardInfo}
          onChange={ev => setCardInfo(ev.currentTarget.value)}
          variant="outlined"
        />
        <TextField
          className={classes.secondary}
          name='expiration'
          id="expiration" label="Expiration MMYY"
          type="text"
          value={expiration}
          onChange={ev => setExpiration(ev.currentTarget.value)}
          variant="outlined"
        />
        <Button 
          className={classes.secondary}
          variant="contained"
          color="primary"
          type='submit'
          >
          {status==='awaiting-response' ? <CircularProgress style={{color: 'black'}}/> : 'Purchase'}
        </Button>
      </div>
    </form>
  )
}

export default Form;