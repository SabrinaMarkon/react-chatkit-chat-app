import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit';
import MessageList from './components/MessageList';
import NewRoomForm from './components/NewRoomForm';
import RoomList from './components/RoomList';
import SendMessageForm from './components/SendMessageForm';

import { tokenUrl, instanceLocator } from './config'

class App extends Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }
    this.sendMessage = this.sendMessage.bind(this);
  }

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
          /* take currentUser and hook onto the entire component (this) itself so it is accessible outside this scope */
          this.currentUser = currentUser;

          this.currentUser.getJoinableRooms()
            .then(joinableRooms => {
              this.setState({
                joinableRooms,
                joinedRooms: this.currentUser.rooms
              });
            })
            .catch(err => console.log('Error on joinableRooms:', err));

          this.currentUser.subscribeToRoom({
            roomId: 10403759,
            messageLimit: 10, // default is 20 but can go up to 100
            hooks: {
              onNewMessage: message => {
                // console.log('message.text:', message.text);
                this.setState({
                  messages: [...this.state.messages, message]
                });
              }
            }
          });
      })
      .catch(err => console.log('Error on connect:', err));
  }

  sendMessage(text) {
    /* get the currentUsera for the instance and call sendMessage on it */
    this.currentUser.sendMessage({
      text,
      roomId: 10403759 
    });
  }

  render() {
    return (
      <div className="app">
        <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
        <MessageList message={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
