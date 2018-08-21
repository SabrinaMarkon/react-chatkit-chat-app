import React from 'react';

class NewRoomForm extends React.Component {

    constructor() {
        super();
        this.state = {
            roomName: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            roomName: e.target.value
        });
    }

    handleSubmit(e) {   
        e.preventDefault();
        // console.log('handleSubmit: ' + this.state.roomName);
        this.props.createRoom(e, this.state.roomName);
    }

    render() {
        return(
            <div className="new-room-form">
                <form onSubmit={this.handleSubmit}>
                    <input
                        value={this.state.roomName}
                        onChange={this.handleChange}
                        type="text"
                        placeholder="Create New Room"
                        required />
                    <button id="create-room-btn" type="submit">+</button>
                </form>
            </div>
        )
    }
}

export default NewRoomForm;