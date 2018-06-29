import React from 'react';

class SendMessageForm extends React.Component {

    /* Need this to be a 'controlled component', by not having duplicate state and controlling how it works */
    constructor() {
        super();
        this.state = {
            message: ''
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
        console.log(this.state.message);
        this.props.sendMessage(this.state.message);
        this.setState({
            message: ''
        });
    }

    render() {
        return(
            <form className="send-message-form"
            onSubmit={this.handleSubmit}>
                <input 
                placeholder="Type your message and hit enter" 
                type="text" 
                onChange={this.handleChange}
                value={this.state.message} />
            </form>
            // No button because it needs to submit with enter key for a chat as user-expected behavior.
        )
    }
}

export default SendMessageForm;