import React from 'react';

class RoomList extends React.Component {

    render() {
        /* We need to sort the rooms so the list isn't shuffled whenever the user joins a room */
        const orderedRooms = [...this.props.rooms].sort((a, b) => a.id - b.id);
        return(
            <div className="rooms-list">
                <ul>
                <h3>Users Online: {this.props.usersonline}</h3>
                <h3>Your rooms:</h3>
                    {orderedRooms.map(room => {
                        const active = this.props.roomId === room.id ? 'active' : '';
                        return (
                            <li key={room.id} className={"room " + active}>
                                {/* We use onClick={() => {}} anonymous function because if we did not have () => {} it would call subscribeToRoom when the component renders instead of when it is clicked. */}
                        <button onClick={(e) => this.props.subscribeToRoom(e, room.id)} ># {room.name}</button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default RoomList;