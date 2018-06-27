import React, { Component } from 'react';
import MessageList from './components';
import NewRoomForm from './components';
import RoomList from './components';
import SendMessageForm from './components';

class App extends Component {
  render() {
    return (
      <div className="app">
        <RoomList />
        <MessageList />
        <SendMessageForm />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
