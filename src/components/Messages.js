import React from 'react';
import '../styles/App.css';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      show: false
    }
  }

  componentDidMount() {
    this.fetchMessages();
  }

  render() {
    if(this.state.show) {
      return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', flexDirection: 'row', borderBottom: '1px solid #aaaaaa', width: 300, backgroundColor: '#c5050c', borderTopLeftRadius: 10}}>
            <button style={{border: 'none', backgroundColor: '#c5050c', marginLeft: 10, fontSize: 15, color: '#f9f9f9', borderRadius: 30}} onClick={() => this.setState({show: false})}>✕</button>
            <div style={{paddingLeft: 60, fontSize: 25, color: '#f9f9f9'}}>Messages</div>
          </div>

          <div style={{height: 500, width: 300, border: '1px solid #aaaaaa', backgroundColor: 'white', overflowY: 'auto', paddingRight: 20}}>
            {this.getMessages()}
          </div>
        </div>
      );
    }
    return (
      <button style={{width: 300, border: '1px solid #aaaaaa', borderTopLeftRadius: 10, padding: 10, color: '#f9f9f9', backgroundColor: '#c5050c'}} onClick={() => this.setState({show: true})}>
        Show messages
      </button>
    )
  }

  async fetchMessages() {
    while(true) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", localStorage.getItem('token'));

      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      let response = await fetch('https://mysqlcs639.cs.wisc.edu/application/messages', requestOptions);
      if(!response.ok) {
        await this.delay(500);
        continue;
      }
      let result = await response.json();

      if(this.state.messages.length !== result.messages.length) {
        this.setState({messages: result.messages})
        continue;
      }

      for(let i = 0; i < this.state.messages.length; i++) {
        if(result.messages[i] !== this.state.messages[i]) {
          await this.setState({messages: result.messages});
          break;
        }
      }
      await this.delay(500);
    }
  }

  async delay(delayInms) {
    return new Promise(resolve  => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

  getMessages() {
    let messages = [];

    for(const message of this.state.messages) {
      if(message.isUser) {
        messages.push (
          <div key={message.id} style={{width: 200, backgroundColor: '#2d78cf', margin: 20, marginLeft: 75, borderRadius: 20, padding: 10}}>
            {message.text}
          </div>
        )
      }
      else {
        messages.push (
          <div key={message.id} style={{width: 200, backgroundColor: '#b2c4d9', margin: 20, marginLeft: 10, borderRadius: 20, padding: 10}}>
            {message.text}
          </div>
        )
      }
    }

    return messages;
  }
}

export default Messages;
