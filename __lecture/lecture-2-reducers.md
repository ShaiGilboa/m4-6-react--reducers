# 4.6.2 Reducers

---

### The limitations of `useState`

No restrictions. It's the wild west.

```js
const App = () => {
  const [count, setCount] = React.useState(0);

  setCount('Hello'); // Whyyyyy makes no sense
};
```

---

### The limitations of `useState`

It spreads your application logic around

```js
const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <>
      Count: {count}
      <Game count={count} setCount={setCount} />
      <Reset setCount={setCount} />
    </>
  );
};

const Game = ({ count, setCount }) => {
  // Some logic here:
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </>
  );
};

const Reset = ({ setCount }) => {
  // Some other logic here:
  return (
    <>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
};
```

---

### Introducing: `useReducer`

This is a _powerful_ but _complex_ tool

---

### Part I: What is a "reducer"?

A reducer is a function that takes _the current state_ and _an action_ and produces a new state.

---

### useReducer demo

```js
// All of our logic is contained here.
// There is no other way to change the state.
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'RESET':
      return 0;
    default:
      throw new Error(`Unrecognized action: ${action,type}`);
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, 0);

  return (
    <>
      Count: {state}
      <Game count={count} dispatch={dispatch} />
      <Reset dispatch={dispatch} />
    </>
  );
};

const Game = ({ count, dispatch }) => {
  return (
    <>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
    </>
  );
};

const Reset = ({ dispatch }) => {
  return (
    <>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </>
  );
};
```

---

# Terminology

### "Action"

an "action" is a plain Javascript object that has a "type" property.

```js
{ type: 'INCREMENT' }

{ type: 'WIN_GAME' }

{
  type: 'submit-registration',
  username: 'seriousbanker123',
  password: 'passw0rd',
  agreedToTerms: true,
}

{
  type: 'registration-failure',
  message: 'Your password is too insecure.',
}
```

---

### Action Best Practices

Actions _describe an event_. They don't dictate what should happen to the state.

```js
// Good action: describes what is happening
{ type: 'clear-form' }

// Bad action: dictates what should happen with the state
{ type: 'set-user-email', value: '' } // maybe { type: 'accept input' OR type: 'accept user email'...}
{ type: 'set-user-password', value: '' }
```

---

### Why?

Actions _describe what happened_ because that's how you avoid spreading your logic all over the app.

Actions describe the event. _Reducers_ control what happens because of it.

---

# Quiz

Are the following actions good to go?

If not, what could be improved?

---

```js
{ type: 'click-to-open-modal', state: { newModal: 'login' } }
```
```js
{ type: 'click-login-link', state: { newModal: 'login' } }
```
---

```js
{ type: 'toggle-terms-of-service', agreed: true } // yes
```

---

```js
{ type: 'set-player-coordinates', x: 41, y: 22 }
```
```js
{ type: 'move-player', x: 41, y: 22 }
```
```js
{ type: 'read-player-coords', x: 41, y: 22 }
```

---

```js
{
  event: 'logout';
}
```
```js
{
  type: 'handle-logout', event: 'logout';
}
```
```js
{
  type: 'click-logout-link', event: 'logout';
}
```
---

# Terminology

### Reducer

A function that takes _the current state_ and _an action_, and uses that information to produce a new state.

You never call this function yourself. You pass it to `useReducer`

---

# Terminology

### Reducer

By convention, reducers often take this form:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'some-action': {
      // return some new state
    }
    case 'some-other-action': {
      // return some other new state
    }
    default: {
      // If no action matches, this must be a mistake
      throw new Error('whoopsie');
    }
  }
}
```

The _switch_ statement is a popular convention, but it's optional. You can write reducers however you want.

---

# Terminology

### Reducer

Another example:

```js
const reducer = (state, action) => {
  if (action.type === 'some-action') {
    return 'hieee';
  } else if (action.type === 'some-other-action') {
    return 'byeee';
  } else {
    throw new Error('whoopsie');
  }
};
```

---

# Terminology

### dispatch

When you call `useReducer`, you get two things out:

```js
const [state, dispatch] = useReducer(reducer, initialState);
```

The last item in that array is the state.

The second item is `dispatch`.

---

# Terminology

### dispatch

`dispatch` takes an action as an argument, and it calls the `reducer` function. This will trigger a re-render.

---

# Exercises

Update the following examples to use `useReducer`

---

```jsx
const LightSwitch = () => {
  const [isOn, setIsOn] = React.useState(false);

  return (
    <>
      Light is {isOn ? 'on' : 'off'}.
      <button onClick={() => setIsOn(!isOn)}>Toggle</button>
    </>
  );
};
```
```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_LIGHT':
      return !state;
    default:
      throw new Error(`What?: ${action.type}`)
  }
}

const LightSwitch = () => {
  const [state, dispatch] = React.usReducer(reducer, false);

  return (
    <>
      Light is {state ? 'on' : 'off'}.
      <button onClick={() => dispatch({type: 'TOGGLE_LIGHT'})}>Toggle</button>
    </>
  );
};
```
---

```jsx
function App() {
  const [status, setStatus] = React.useState('idle');

  return (
    <form
      onSubmit={() => {
        setStatus('loading');

        getStatusFromServer()
          .then(() => {
            setStatus('idle');
          })
          .catch(() => {
            setStatus('error');
          });
      }}
    >
      Status is: {status}
      <button>Submit</button>
    </form>
  );
}
```

```jsx
const reducer = (state, action) => {
  switch(action.type) {
    case 'REQUEST_DATA':
      return 'loading'
    case 'RECEIVE_DATA':
      return 'idle'
    case 'RECEIVE_ERROR':
      return 'error'
    default:
      throw new Error (`error: ${action.type}`)
  }
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, 'idle');

  return (
    <form
      onSubmit={() => {
        dispatch({type: 'REQUEST_DATA')};

        getStatusFromServer()
          .then(() => {
            dispatch({type: 'RECEIVE_DATA'});
          })
          .catch(() => {
            dispatch({type: 'RECEIVE_ERROR'});
          });
      }}
    >
      Status is: {state}
      <button>Submit</button>
    </form>
  );
}
```

---

```jsx
export const ModalContext = React.createContext(null);

export const ModalProvider = ({ children }) => {
  const [currentModal, setCurrentModal] = React.useState(null);

  return (
    <ModalContext.Provider
      value={{
        currentModal,
        setCurrentModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
```
```jsx
export const ModalContext = React.createContext(null);

const reducer = (state, action) => {
  switch (action.type){
    case 'OPEN_MODAL':
     return action.modal
    case 'CLOSE_MODAL':
      return null
    default:
      throw new Error(`error: unknown action - ${action.type}`)
  }
}

export const ModalProvider = ({ children }) => {
  const [stat, dispatch] = React.useReducer(reducer,null);
  
  const openModal = modal => dispatch({type: 'OPEN_MODAL', modal})
  const closeModal = modal => dispatch({type: 'CLOSE_MODAL', modal})

  return (
    <ModalContext.Provider
      value={{
        currentModal: state,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
```
---

# Immutable updates

It's important that you don't _mutate_ the existing state:

```js
// 🚨 don't do this:
function reducer(state, action) {
  switch (action.type) {
    case 'updateUserInfo': {
      state.firstName = action.firstName;
      state.lastName = action.lastName;

      return state;
    }
  }
}
```

---

# Quiz

What does the following output to the console?

```js
const obj = {
  numOfBeans: 2,
  numOfButtons: 0,
};

function grantHalfBean(someObject) {
  someObject.numOfBeans += 0.5;
  return someObject;
}

const updatedObj = grantHalfBean(obj);

console.log(obj === updatedObj); //true
```

its not a copy it's a reference to the same one.

---

You must produce a **new value** from the reducer, so that React knows it has to update!

---

# Demo

```jsx live=true
const initialState = {
  numOfBeans: 2,
  numOfButtons: 0,
};

function reducer(state, action) {
  if (action.type === 'increment-beans') {
    state.numOfBeans += 0.5;
  }

  return state;
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div className="App">
      <h1>
        {state.numOfBeans} Beans,
        {state.numOfButtons} Buttons.
      </h1>
      <button
        onClick={() =>
          dispatch({
            type: 'increment-beans',
          })
        }
      >
        Click
      </button>
    </div>
  );
}

render(<App />);
```

---

# Fixing it

Always return a new object.

```js
const initialState = {
  numOfBeans: 2,
  numOfButtons: 0,
};

function reducer(state, action) {
  if (action.type === 'increment-beans') {
    return {
      numOfButtons: state.numOfButtons,
      numOfBeans: state.numOfBeans + 0.5,
    };
  }

  return state;
}
```

---

### Pro-tip: Spread operator

```js
const initialState = {
  numOfBeans: 2,
  numOfButtons: 0,
  numOfBananas: 10,
  numOfBlasters: 8,
};

function reducer(state, action) {
  if (action.type === 'increment-beans') {
    return {
      ...state,
      numOfBeans: state.numOfBeans + 0.5,
    };
  } else {
    throw new Error(`error: unknown action - ${action.type}`)
  }

  return state;
}
```

```diff exclude

// ...state covers _all_ other properties

return {
-  numOfButtons: state.numOfButtons,
-  numOfBananas: state.numOfBananas,
-  numOfBlasters: state.numOfBlasters,
+  ...state,
  numOfBeans: state.numOfBeans + 0.5,
}
```

---

# Exercises

Update these objects to use `useReducer`, with a single immutable object

```jsx
const Game = () => {
  const [points, setPoints] = React.useState(0);
  const [status, setStatus] = React.useState('idle');

  return (
    <>
      Your score: {points}.
      {status === 'playing' && (
        <>
          <button onClick={() => setPoints(points + 1)}>🍓</button>
          <button onClick={() => setPoints(points - 1)}>💀</button>
        </>
      )}
      <button onClick={() => setStatus('playing')}>Start game</button>
    </>
  );
};
```
```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'WIN_POINT':
     return {
       ...state
       points: state.points + 1,
     }
    case 'LOSE_POINT':
      return {
        ...state
        points: state.points - 1,
      }
    case 'TOGGLE_STATUS':
      return state.status==='idle' ? {...state, status:'playing'}: {...state, status:'idle'};
    default:
      throw new Error('error')
  }
}

const initialState = {points: 0, status: 'idle'}

const Game = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { points, status } = state
  return (
    <>
      Your score: {points}.
      {status === 'playing' && (
        <>
          <button onClick={() => dispatch({type: 'WIN_POINT'})}>🍓</button>
          <button onClick={() => dispatch({type: 'LOSE_POINT'})}>💀</button>
        </>
      )}
      <button onClick={() => dispatch({type: 'TOGGLE_STATUS'})}>Start game</button>
    </>
  );
};
```

---

```jsx
import sendDataToServer from './some-madeup-place';
import FormField from './some-other-madeup-place';


const SignUpForm = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');

  return (
    <form onSubmit={sendDataToServer}>
      <FormField
        label="First Name"
        value={firstName}
        onChange={ev => setFirstName(ev.target.value)}
      />
      <FormField
        label="Last Name"
        value={lastName}
        onChange={ev => setLastName(ev.target.value)}
      />
      <FormField
        label="Email"
        value={email}
        onChange={ev => setEmail(ev.target.value)}
      />

      <button>Submit</button>
      <button
        onClick={ev => {
          ev.preventDefault();

          setFirstName('');
          setLastName('');
          setEmail('');
        }}
      >
        Reset
      </button>
    </form>
  );
};
```
```jsx
import sendDataToServer from './some-madeup-place';
import FormField from './some-other-madeup-place';

const initialState = { firstName: '', lastName: '', email: '' }

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        ...action.info,
      }
    case 'CLEAR':
      return initialState;
    default:
     throw new Error(`error: unknown action in form - ${action.type}`)
  }
}

const SignUpForm = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { firstName, lastName, email } = state;

  return (
    <form onSubmit={sendDataToServer}>
      <FormField
        label="First Name"
        value={firstName}
        onChange={ev => dispatch({type: 'UPDATE', info: {firstName: ev.target.value}})}
      />
      <FormField
        label="Last Name"
        value={lastName}
        onChange={ev => dispatch({type: 'UPDATE', info: {lastName: ev.target.value}})}
      />
      <FormField
        label="Email"
        value={email}
        onChange={ev => dispatch({type: 'UPDATE', info: {email: ev.target.value}})}
      />

      <button>Submit</button>
      <button
        onClick={ev => {
          ev.preventDefault();

          dispatch('CLEAR')
        }}
      >
        Reset
      </button>
    </form>
  );
};
```

SCOTT's solution:
```jsx
import sendDataToServer from './some-madeup-place';
import FormField from './some-other-madeup-place';
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
};
function reducer(state, action) {
  switch (action.type) {
    case 'update-field': {
      return {
        ...state,
        [action.key]: action.value,
      };
    }
    case 'reset-form': {
      return initialState;
    }
  }
}
const SignUpForm = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const updateField = (key, value) =>
    dispatch({ type: 'update-field', key, value });
  const resetForm = () => dispatch({ type: 'reset-form', key, value });
  return (
    <form onSubmit={sendDataToServer}>
      <FormField
        label="First Name"
        value={state.firstName}
        onChange={ev => updateField('firstName', ev.target.value)}
      />
      <FormField
        label="Last Name"
        value={state.lastName}
        onChange={ev => updateField('lastName', ev.target.value)}
      />
      <FormField
        label="Email"
        value={state.email}
        onChange={ev => updateField('email', ev.target.value)}
      />
      <button>Submit</button>
      <button
        onClick={ev => {
          ev.preventDefault();
          resetForm();
        }}
      >
        Reset
      </button>
    </form>
  );
};
```
---

### `useState` vs `useReducer`

`useReducer` is good when the logic to update state is non-trivial, or you have a complex state shape (lots of related data).

`useState` is good for small and simple bits of state.

No hard rules though. Learn both, but use whichever you want.

---

### `useReducer` and `useContext`

Because _global state_ often has _non-trivial logic_, these two hooks/patterns are frequently used together.

---

```jsx
// UserContext.js

export const UserContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'login': {
      return action.user;
    }

    case 'logout': {
      return null;
    }

    case 'change-email': {
      return {
        ...state,
        email: action.email,
      };
    }

    default:
      throw new Error('unrecognized action: ' + action.type);
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, null);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
```

---

# Exercises

Finish writing the following context components with `useReducer`

---

```js
export const StudentContext = React.createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = React.useState({
    aditya: false,
    bodhi: false,
    chetan: false,
  });

  // We need actions to:
  // - mark a student as "present"
  // - mark a student as "absent",
  // - add a student to the class.

  return (
    <StudentContext.Provider value={{ state }}>
      {children}
    </StudentContext.Provider>
  );
};
```

---

```js
export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const [status, setStatus] = React.useState({
    data: null,
    status: 'idle',
  });

  // We need actions to:
  // - start fetching data from the server
  // - receive data from the server
  // - receive an error from the server

  return (
    <DataContext.Provider value={{ state }}>{children}</DataContext.Provider>
  );
};
```

---
