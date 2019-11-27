import React from 'react';
import '../styles/App.css';
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';

class Welcome extends React.Component {
  render() {
    return (
      <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <p style={{fontSize: 50, margin: 0}}>WiscShop</p>
        <p style={{fontSize: 30}}>Badger Store</p>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <Link to={'/signUp'} className='button' style={{margin: 20}}>
            <Button variant='outline-dark'>Sign up</Button>
          </Link>
          <Link to={'/signIn'} className='button' style={{margin: 20}}>
            <Button variant='outline-dark'>Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Welcome;
