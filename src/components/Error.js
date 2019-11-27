import React from 'react';
import '../styles/App.css';

class Welcome extends React.Component {
  render() {
    return (
      <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <p style={{fontSize: 50, margin: 0}}>404</p>
        <p style={{fontSize: 30}}>Whoops. This isn't the page you're looking for</p>
      </div>
    );
  }
}

export default Welcome;
