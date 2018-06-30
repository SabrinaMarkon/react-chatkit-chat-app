import React from 'react';

class RoomList extends React.Component {

    render() {
        /* We need to sort the rooms so the list isn't shuffled whenever the user joins a room */
        const orderedRooms = [...this.props.rooms].sort((a, b) => a.id - b.id);
        return(
            <div className="rooms-list">
                <div className="help-text">RoomList</div>
                <ul>
                <h3>Your rooms:</h3>
                    {orderedRooms.map(room => {
                        return (
                            <li key={room.id} className="room">
                                {/* We use onClick={() => {}} anonymouss function because if we did not have () => {} it would call subscribeToRoom when the component renders instead of when it is clicked. */}
                                <a onClick={() =>  this.props.subscribeToRoom(room.id)} href=""># {room.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default RoomList;