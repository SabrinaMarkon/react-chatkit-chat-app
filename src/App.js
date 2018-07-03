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
    this.createRoom = this.createRoom.bind(this);
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
    .catch(err => {
      console.log(`Error getting joinable rooms: ${err}`)
    })
  }

    subscribeToRoom(roomId) {
      console.log(typeof roomId);
      console.log(typeof this.state.roomId);
      console.log(this.state.roomId);
        this.setState({ messages: [] })
        this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
            }
        })
        .then(room => {
            this.setState({
                roomId: room.id
            })
            this.getRooms()
        })
        .catch(err => console.log('error on subscribing to room: ', err))
    }

  sendMessage(text) {
    console.log(typeof this.state.roomId);
    /* get the currentUser for the instance and call sendMessage on it */
    if (this.state.roomId) {
      this.currentUser.sendMessage({
        text,
        roomId: this.state.roomId
      });
    }
  }

  createRoom(roomName) {
    console.log('roomName:' , roomName);
  }

  render() {
    return (
        <div className="app">
            <RoomList
                subscribeToRoom={this.subscribeToRoom}
                rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
                roomId={this.state.roomId} />
            <MessageList message={this.state.messages} />
            <SendMessageForm sendMessage={this.sendMessage} />
            <NewRoomForm createRoom={this.createRoom} />
        </div>
    );
}
}

export default App
