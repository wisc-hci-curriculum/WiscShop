import React from 'react';
import '../styles/App.css';
import {Link, Redirect} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
      redirect: null
    }
  }
  render() {
    if(this.state.redirect != null) {
      return (
        <Redirect push to={'/' + this.state.redirect}/>
      )
    }
    return (
      <div className='dark' style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <p style={{fontSize: 40}}>Create an account</p>
        <Form>
          <Form.Group style={{width: 500}}>
            <Form.Control type="text" placeholder="First name" onChange={(e) => this.setState({firstName: e.target.value})} style={{margtnTop: 20, marginBottom: 20}}/>
            <Form.Control type="text" placeholder="Last name" onChange={(e) => this.setState({lastName: e.target.value})} style={{margtnTop: 20, marginBottom: 20}}/>
            <Form.Control type="text" placeholder="Username" onChange={(e) => {this.setState({username: e.target.value}); this.setWarning(e.target.value, this.state.password, this.state.confirmPassword)}} style={{margtnTop: 20, marginBottom: 20}}/>
            <Form.Control type="password" placeholder="Password" onChange={(e) => {this.setState({password: e.target.value}); this.setWarning(this.state.username, e.target.value, this.state.confirmPassword)}} style={{margtnTop: 20, marginBottom: 20}}/>
            <Form.Control type="password" placeholder="Confirm password" onChange={(e) => {this.setState({confirmPassword: e.target.value}); this.setWarning(this.state.username, this.state.password, e.target.value)}} style={{margtnTop: 20, marginBottom: 20}}/>
          </Form.Group>
        </Form>
        <p style={{height: 19, color: '#c72e2e'}}>{this.state.warning}</p>
        <Button variant='outline-dark' style={{marginTop: 20, marginBottom: 20}} onClick={() => this.signUp()}>Sign up</Button>
        <Link to={'/signIn'} className='clear-button'>Sign in instead</Link>
      </div>
    );
  }

  setWarning(username, password, confirmPassword) {
    if(username.length < 5) {
      this.setState({warning: 'Username must be 5 characters or longer'});
    }
    else if(password.length < 5) {
      this.setState({warning: 'Password must be 5 characters or longer'});
    }
    else if(password !== confirmPassword) {
      this.setState({warning: 'Passwords do not match'});
    }
    else {
      this.setState({warning: ''})
    }
  }

  async signUp() {
    if(this.state.warning === '') {
      let success = await this.props.signUp(this.state.username, this.state.password, this.state.firstName, this.state.lastName);
      if(success) {
        this.setState({redirect: this.state.username});
      }
    }
  }
}

export default SignUp;
