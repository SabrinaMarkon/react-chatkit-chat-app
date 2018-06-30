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
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
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
          this.getRooms();
          // the user should now be able to click on a room name to subscribeToRoom.
          // this.subscribeToRoom();

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
          })
      })
      .catch(err => console.log('Error on connect:', err));
  }

  getRooms() {
    this.currentUser.getJoinableRooms()
    .then(joinableRooms => {
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms
      });
    })
    .catch(err => console.log('Error on joinableRooms:', err));
  }

  subscribeToRoom(roomId) {
    this.setState({
      messages: []
    });
    this.currentUser.subscribeToRoom({
      roomId: roomId,
      messageLimit: 10, // default is 20 but can go up to 100
      hooks: {
        onNewMessage: message => {
          // console.log('message.text:', message.text);
          this.setState({
            messages: [...this.state.messages, message]
          });
        }
      }
    })
    .then(room => {
      this.setState({
        roomId: room.id
      });
      this.getRooms();
    } )
    .catch(err => console.log('Error on subscribing to room:', err));
  }

  sendMessage(text) {
    /* get the currentUsera for the instance and call sendMessage on it */
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  }

  render() {
    return (
      <div className="app">
        <RoomList
        roomId={this.state.roomId}
        subscribeToRoom={this.subscribeToRoom}
        rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
        <MessageList message={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
