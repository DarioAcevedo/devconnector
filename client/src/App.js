import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

//redux
import { Provider } from 'react-redux';
import store from './store';

/*React is made from components, the components are created in order to make things with small reusable
peaces of code. In each component, you can manage the "State" wich means you can use this info for sending 
it to the API and so on. */

const App = () => (
  <Provider store = {store}>
  <Router>
    <Fragment>
      <Navbar/>
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Switch>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
        </Switch>
      </section>
    </Fragment>
  </Router>
  </Provider>
  );

export default App;
