import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Alert from './components/layout/Alert';

//Auth check
import { loadUser } from './actions/auth';
import {setAuthToken} from './utils/setAuthToken';

//redux
import { Provider } from 'react-redux';
import store from './store';
import './App.css';

/*React is made from components, the components are created in order to make things with small reusable
peaces of code. In each component, you can manage the "State" wich means you can use this info for sending 
it to the API and so on. */

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //UseEffect takes the [] for just running once
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  
  return (
  <Provider store = {store}>
  <Router>
    <Fragment>
      <Navbar/>
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
        </Switch>
      </section>
    </Fragment>
  </Router>
  </Provider>
  );};

export default App;
