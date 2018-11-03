import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      messages: [
      'Welcome to test chat!', 
      'Make yourself at homeand be yourself.', 
      "let's type something and submit."
      ],
      input_message: 'hello world'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // change react state of iputing message
    this.setState({input_message: event.target.value});
  }

  handleSubmit(event) {
    // send data  to server with submit event
    socket.emit('chat message', this.state.input_message);
    event.preventDefault();
  }


  componentDidMount() {
    // more accuracy with '()=>{}' and 'function(){}'
    // receive data from server
    socket.on('chat message', (msg) => {
      const messages = this.state.messages.slice();
      console.log("incoming...");
      this.setState({
        isLoaded: true,
        messages: messages.concat([msg]),
      });
    });
  }

  render() {
    const { error, isLoaded, messages } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        // for some reasons don't work without outside div
        <div>
          <div>
            <ul id="messages">
            {messages.map((item, index) => ( 
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <form onSubmit={this.handleSubmit}>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              <input type="submit" value="Submit" />
            </form> 
          </div>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// export default App;