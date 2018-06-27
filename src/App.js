import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit';
import MessageList from './components/MessageList';
import NewRoomForm from './components/NewRoomForm';
import RoomList from './components/RoomList';
import SendMessageForm from './components/SendMessageForm';

import { tokenUrl, instanceLocator } from './config'

class App extends Component {

/* How to hook up a React component with an API?
With the ComponentDidMount Lifecycle method, which
runs after the component is rendered. */
  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator,
      userId: 'starlightocean',
      tokenProvider: new TokenProvider({
        url: tokenUrl
      })
    })

    chatManager.connect()
      .then(currentUser => {
          currentUser.subscribeToRoom({
            roomId: 10403759,
            messageLimit: 10, // default is 20 but can go up to 100
            hooks: {
              onNewMessage: message => {
                console.log('message.text:', message.text);
              }
            }
          });
      })

  }

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
