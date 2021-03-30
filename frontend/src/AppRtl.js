import React, { Component } from 'react';
import Nav from './components/nav'
import CChart from './components/disscussion/chart'
import DiscussionList from './components/discussionList';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Discussion from './components/disscussion/discussion';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from "react-redux";
import store from "./store";
import login from './components/login';
import  Register  from './components/Register';
import Profile from './components/profile/profile';
import { PrivateRoute } from './components/PrivateRoute';
import  logout  from './components/logout';
import NewDiscussion from './components/disscussion/newDiscussion';
import editDiscussion from './components/disscussion/editDiscussion'
import myDiscussion from './components/disscussion/myDiscussion' 
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';  
import Search from './components/search';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import editTeam from "./components/profile/editTeam";
import Footer from './components/Footer';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });


const theme = createMuiTheme({
  direction: 'rtl',
  typography: {
     fontSize: 20,
     fontFamily:'sans',
     direction: 'ltr'
  },
});


class App extends Component {


  render() {
    return (
      <MuiThemeProvider theme={theme}>
         <StylesProvider jss={jss}>
        <Provider store={store}>
          <Router>
            <div>
              <div className="contents">
                <Nav/>
              </div>
              <div className='container' style={{minHeight:window.innerHeight-65-50}}>
              <Switch>
                <Route exact path='/' component={DiscussionList} />
                <Route path='/discussion/:id' component={Discussion} />
                <Route path='/discussion' component={DiscussionList} />
                <Route path='/login' component={login} />
                <Route path='/logout' component={logout} />
                <Route path='/register' component={Register} />
                <Route path='/search' component={Search} />
                <PrivateRoute path='/edit-discussion/:id' component={editDiscussion} />
                <PrivateRoute path='/profile' component={Profile} />
                <PrivateRoute path='/editTeam' component={editTeam}/>
                <PrivateRoute path='/add-discussion' component={NewDiscussion} />
              </Switch>
              </div>
              <Footer/>
            </div>
          </Router>
        </Provider>
        </StylesProvider>
        
      </MuiThemeProvider>
       
    );
  }
}

export default App;
