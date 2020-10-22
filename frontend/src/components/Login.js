import React, { useReducer } from 'react'
import {withCookies } from 'react-cookie';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress'
import { START_FETCH, FETCH_SUCCESS, ERROR_CATCHED, INPUT_EDIT, TOGGLE_MODE } from './actionTypes'

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3),
    },
    span: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'teal',
    },
    spanError: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'fuchsia',
        marginTop: 10,
    },
  }));

// 初期State
const initialState = {
    isLoading: false,
    isLoginView: true,
    error: '',
    credentialsLog: {
        email: '',
        password: '',
    },
};

const loginReducer = (state, action) => {
    switch (action.type) {
        case START_FETCH: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case FETCH_SUCCESS: {
            return {
                ...state,
                isLoading: false,
            };
        }
        case ERROR_CATCHED: {
            return {
                ...state,
                error: 'Email or Password is not correct.',
                isLoading: false,
            };
        }
        case INPUT_EDIT: {
            return {
                ...state,
                [action.inputName]: action.payload,
                error: '',
            };
        }
        case TOGGLE_MODE: {
            return {
                ...state,
                isLoginView: !state.isLoginView,
            };
        }
        default:
            return state;
    }
}

const Login = (props) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const inputChangeLog = () => event => {
        const cred = state.credentialsLog;
        cred[event.target.name] = event.target.value;
        dispatch({
            type: INPUT_EDIT,
            inputName: 'state.credentialsLog',
            payload: cred,
        })
    }

    const login = async(event) => {
        event.preventDefault() // submitが押された時の処理を抑えるため
        if (state.isLoginView) {
            try {
                dispatch({type: START_FETCH})
                const res = await axios.post(`http://127.0.0.1:8000/authen/jwt/create`, state.credentialsLog, {
                headers: { 'content-Type': 'application/json'}})
                props.cookies.set('jwt-token', res.data.access);
                res.data.access ? window.location.href = "/drftube" : window.location.href = "/";
                dispatch({type: FETCH_SUCCESS})
            } catch {
                dispatch({type: ERROR_CATCHED});
            }
        } else {
            try {
                dispatch({type: START_FETCH})
                const res = await axios.post(`http://127.0.0.1:8000/api/create`, state.credentialsLog, {
                headers: { 'content-Type': 'application/json'}})
                props.cookies.set('jwt-token', res.data.access);
                res.data.access ? window.location.href = "/drftube" : window.location.href = "/";
                dispatch({type: FETCH_SUCCESS})
            } catch {
                dispatch({type: ERROR_CATCHED});
            }
        }
    }

    const toggleView = () => {
        dispatch({type: TOGGLE_MODE})
    }

    return (
        <Container component="main" maxWidth="xs">
          <form onSubmit={login}>
            <div className={classes.paper}>
                {state.isLoading && <CircularProgress />}
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                {state.isLoginView ? 'Login' : 'Register'}
                </Typography>

                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={state.credentialsLog.email}
                onChange={inputChangeLog()}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={state.credentialsLog.password}
                    onChange={inputChangeLog()}
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                />

                <span className={classes.spanError}>{state.error}</span>

                { state.isLoginView ?
                    !state.credentialsLog.password || !state.credentialsLog.email ?
                    <Button className={classes.submit} type="submit" fullWidth disabled 
                    variant="contained" color="primary">Login</Button>
                    : <Button className={classes.submit} type="submit" fullWidth
                    variant="contained" color="primary">Login</Button>
                :
                    !state.credentialsLog.password || !state.credentialsLog.email ?
                    <Button className={classes.submit} type="submit" fullWidth disabled 
                    variant="contained" color="primary">Register</Button>
                    : <Button className={classes.submit} type="submit" fullWidth
                    variant="contained" color="primary">Register</Button>
                }
                <span onClick={() => toggleView()} className={classes.span}>
                    {state.isLoginView ? 'Create Account' : 'Back to Login'}
                </span>
            </div>
          </form>  
        </Container>
    )
}

export default withCookies(Login)