import React from 'react';

class SendMessageForm extends React.Component {

    /* Need this to be a 'controlled component', by not having duplicate state and controlling how it works */
    constructor() {
        super();
        this.state = {
            message: '',
            placeholder: 'Type your message and hit enter'
        }
        // bind to this.handleChange method
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
     /* 'this' keyword is undefined inside this method. It's not bound to the component instance, so we have to bind in the constructor for this instance. SEE bind in constructor */
        this.setState({
            message: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        /** send off the message */
        // console.log(this.state.message);
        if (this.props.roomId) {
            this.props.sendMessage(this.props.roomId, this.state.message);
            this.setState({
                message: ''
            });
        } else {
            this.setState({
                placeholder: 'Click a room to subscribe first'
            });
        }
    }

    render() {
        return(
            <form className="send-message-form"
            onSubmit={this.handleSubmit}>
                <input
                placeholder={this.state.placeholder}
                type="text" 
                onChange={this.handleChange}
                value={this.state.message} />
                <button type="submit">Send</button>
            </form>
            // User can submit either with button or enter key.
        )
    }
}

export default SendMessageForm;