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
      joinedRooms: [],
      usersonline: 0
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
          let allusersonlineobj = this.currentUser.rooms[0].userIds;
          let allusersonline = Object.keys(allusersonlineobj).length;
          // console.log(allusersonline);
          this.setState({
            usersonline: allusersonline
          });
          this.getRooms(this.state.roomId);
          // the user should now be able to click on a room name to subscribeToRoom.
          // this.subscribeToRoom();
      })
      .catch(err => console.log('Error on connect:', err));
  }

  getRooms(roomId) {
    this.currentUser.getJoinableRooms()
    .then(joinableRooms => {
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms,
        roomId: roomId
      });
      // console.log(this.state.roomId + ' getRooms method');
    })
    .catch(err => {
      console.log(`Error getting joinable rooms: ${err}`)
    })
  }

    subscribeToRoom(e, roomId) {
        if(e) {
          e.preventDefault();
        }
        this.setState({ 
          messages: [], 
          roomId: roomId 
        })
        // console.log(roomId);
        // console.log(typeof roomId);
        // console.log(typeof this.state.roomId)
        this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message],
                    })
                }
            }
        })
        .then(room => {
          // console.log(typeof roomId);
            this.setState({
                roomId: roomId
            })
            this.getRooms(roomId)
        })
        .catch(err => console.log('error on subscribing to room: ', err))
    }

  sendMessage(roomId, text) {
    // console.log(text);
    // console.log(roomId);
    /* get the currentUser for the instance and call sendMessage on it */
    // if (this.state.roomId) {
      this.currentUser.sendMessage({
        text,
        roomId: roomId
      });
    // }
  }

  createRoom(e, name) {
    // console.log('roomName:' , typeof(name));
    this.currentUser.createRoom({
      name
    })
    .then(room => this.subscribeToRoom(null, room.id))
    .catch(err => console.log('error with createRoom: ', err))
  }

  render() {
    return (
        <div className="app">
            <RoomList
                usersonline={this.state.usersonline}
                subscribeToRoom={this.subscribeToRoom}
                rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
                roomId={this.state.roomId} />
            <MessageList message={this.state.messages} />
            <SendMessageForm sendMessage={this.sendMessage}
                roomId={this.state.roomId}
             />
            <NewRoomForm createRoom={this.createRoom} />
        </div>
    );
}
}

export default App

/* Next:
online users:
this.currentUser.rooms[this.state.roomID].userIds;

UI Avatars

user typing indicators
admin/moderator can delete rooms or messages
user can delete/edit own messages
*/