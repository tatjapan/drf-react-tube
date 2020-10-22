import React from 'react';
import './App.css';

import indigo from '@material-ui/core/colors/indigo';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import NavBar from './components/NavBar';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: '#f44336'
    },
  },
  typography: {
    fontFamily: '"Roboto",',
  },
});


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar />
    </MuiThemeProvider>
  );
}

export default App;
