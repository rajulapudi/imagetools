import React from 'react';
import Routes from './Routes'
import './App.scss'
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: {
      main: '#212121'
    },
    background: {
      default: '#cfd8dc',
    },
  },
  status: {
    danger: 'orange',
  },
});
theme = responsiveFontSizes(theme);
function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline>
        <Routes />
      </CssBaseline>
    </MuiThemeProvider>
  );
}

export default App;
