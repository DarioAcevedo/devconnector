import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';


export const Login = () => {
    const [ formData, setFormData ] = useState({
        email : '',
        password : ''
    });
    
    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value });
    const onSubmit = e => {
      e.preventDefault();
        console.log('Success');
    }

    return (
        <Fragment>
            <h1 class="large text-primary">Sign In</h1>
      <p class="lead"><i class="fas fa-user"></i> Sign Into Your Account</p>
      <form class="form" onSubmit = { e => onSubmit(e) }>
        <div class="form-group">
          <input type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange = {e => onChange(e)}
            name="email" 
            required />
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
        <input type="submit" class="btn btn-primary" value="Register" />
      </form>
      <p class="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
        </Fragment>
    )
}

export default Login