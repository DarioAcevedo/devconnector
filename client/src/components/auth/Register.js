import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
//Importing connect in order to have access to the store
import { connect } from 'react-redux';
//Import the actions that we will take from the reducer
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

export const Register = ({ setAlert, register }) => {

    const [ formData, setFormData ] = useState({
        name : '',
        email : '',
        password : '',
        password2 : ''
    });
    
    const { name, email, password, password2 } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value });
    const onSubmit = e => {
      e.preventDefault();
      if(password !== password2){
        setAlert('Passwords do not match', 'danger');
      }else{
        register({name, email, password}); 
      }
    }

    return (
        <Fragment>
            <h1 class="large text-primary">Sign Up</h1>
      <p class="lead"><i class="fas fa-user"></i> Create Your Account</p>
      <form class="form" onSubmit = { e => onSubmit(e) }>
        <div class="form-group">
          <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            value ={name} 
            onChange = {e => onChange(e)}
            required />
        </div>
        <div class="form-group">
          <input type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange = {e => onChange(e)}
            name="email" 
            required />
          <small class="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange = {e => onChange(e)}
            name="password"
            minLength="6"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange = {e => onChange(e)}
            name="password2"
            minLength="6"
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Register" />
      </form>
      <p class="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
        </Fragment>
    )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
}
export default connect(null, { setAlert, register } )(Register);