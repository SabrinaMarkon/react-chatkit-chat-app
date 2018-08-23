import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message';

class MessageList extends React.Component {

    /* triggered right BEFORE this component will update */
    componentWillUpdate() {

        /* If the user is reading messages higher up the list of messages, and another user posts a message, it scrolls everyone reading to the bottom of the list (interrupting their reading), because of componentDidUpdate code. This will fix that: */
        const node = ReactDOM.findDOMNode(this);
        /* where the user is on the scroll position: 
        clientHeight is the visible area (box)
        The extra 100 added on is if we are within 100px of the bottom already so it doesn't have to be EXACTLY at the bottom to drop down.
        */
        this.shouldScrollToBottom = node.scrolltop + node.clientHeight + 300 >= node.scrollHeight

    }

    /* triggered right AFTER this component has updated. shouldScrollToBottom is from componentWillUpdate lifecycle method. */
    componentDidUpdate() {
        if (this.shouldScrollToBottom) {
            const node = ReactDOM.findDOMNode(this);
            /* scrollTop is how far we've scrolled down, and scrollHeight is how long our entire scrollable element is. We want the chat to automatically scroll to the end of the messages so we can see the last one */
            node.scrollTop = node.scrollHeight;
        }
    }

    render() {
        return(
            <div className="message-list">
                {this.props.message.map((message, index) => {
                    return (
                        <Message key={index} username={message.senderId} text={message.text} />
                    )
                })}
            </div>
        )
    }
}

export default MessageList;