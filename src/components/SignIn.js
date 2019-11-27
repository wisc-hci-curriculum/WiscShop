import React from 'react';
import '../styles/App.css';
import {Link, Redirect} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      redirect: null,
      warning: ''
    }
  }

  render() {
    if(this.state.redirect != null) {
      return (
        <Redirect push to={'/' + this.state.redirect}/>
      )
    }
    return (
      <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <p style={{fontSize: 40}}>Sign in</p>
        <Form>
          <Form.Group style={{width: 500}}>
            <Form.Control type="text" placeholder="Username" onChange={(e) => this.setState({username: e.target.value})} style={{margtnTop: 20, marginBottom: 20}}/>
            <Form.Control type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} style={{margtnTop: 20, marginBottom: 20}}/>
          </Form.Group>
        </Form>
        {this.getWarning()}
        <Button variant='outline-dark' onClick={() => this.signIn()} style={{marginTop: 20, marginBottom: 20}}>Sign in</Button>
        <Link to={'/signUp'} className='clear-button'>Sign up instead</Link>
      </div>
    );
  }

  getWarning() {
    return (
      <p style={{height: 19, color: '#c72e2e'}}>{this.state.warning}</p>
    )
  }

  async signIn() {
    let success = await this.props.signIn(this.state.username, this.state.password);
    if(success) {
      await this.setState({warning: ''});
      this.setState({redirect: this.state.username});
    }
    else {
      this.setState({warning: 'Incorrect username or password'});
    }
  }
}

export default SignUp;
