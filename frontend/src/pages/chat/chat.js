import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './chat.css'

let socket;
const Chat = () => {
    const [user, setUser] = useState("");
    const [room, setRoom] = useState("");
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketUrl = 'http://localhost:3000'

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const user = params.get('name');
        const room = params.get('room');

        setUser(user)
        setRoom(room)

        socket = io(socketUrl);



        socket.emit('join', { user, room }, (err) => {
            if (err) {
                // alert(err)
            }
        })

        return () => {
            // User leaves room
            socket.disconnect();

            socket.off()
        }

    }, [socketUrl,window.location.search])

    useEffect(() => {
        socket.on('message', msg => {
            setMessages(prevMsg => [...prevMsg, msg])

            setTimeout(() => {

                var div = document.getElementById("chat_body");
                div.scrollTop = div.scrollHeight - div.clientWidth;
            }, 10)
        })

        socket.on('roomMembers', usrs => {
            setUsers(usrs)
        })
    }, [])

    const sendMessage = (e) => {
        e.preventDefault();
       
        socket.emit('sendMessage', message, () => setMessage(""))
        setTimeout(() => {
            var div = document.getElementById("chat_body");
            div.scrollTop = div.scrollHeight ;
        }, 100)
    }

    return (
        <div className="container mt-4 ">
            <div className="row chat-window" id="chat_window_1" >
                <div className="col-xs-4 col-md-4">
                    {/* <p>Chats</p> */}
                    <ul>
                        {
                            users.map((e, i) => (
                                <li key={i}>{e.user}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className="col-xs-8 col-md-8">
                    <div className="panel panel-default">
                    <div className="panel-heading top-bar">
                        <div className="col-md-12 col-xs-8 text-right" style={{ backgroundColor: '#7276E3', padding: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <h3 className="panel-title" style={{ color: 'white', marginBottom: '5px' }}>
                                    <span className="glyphicon glyphicon-comment"></span>{user}
                                </h3>
                                <p style={{ color: 'white', fontSize: '14px', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    <span 
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: 'green',
                                            borderRadius: '50%',
                                            marginRight: '5px'
                                        }}
                                    ></span>
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>

                        <div className="panel-body msg_container_base" id="chat_body">
                            {
                                messages.map((e, i) => (
                                    e.user === user?.toLowerCase() ? <>
                                        <div key={i} className="row msg_container base_receive">
                                            <div className="col-xs-10 col-md-10">
                                                <div className="messages msg_receive">
                                                    <p>{e.text}</p>
                                                    <time>{e.user}</time>
                                                </div>
                                            </div>
                                        </div>
                                    </> : <>
                                        <div key={i} className="row msg_container base_sent">
                                            <div className="col-xs-10 col-md-10">
                                                <div className="messages msg_sent">
                                                    <p>{e.text}</p>
                                                    <time>{e.user}</time>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }

                        </div>
                        <div className="panel-footer">
                            <div className="input-group">
                                <input id="btn-input" type="text"
                                    value={message}
                                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                                    onChange={(event) => setMessage(event.target.value)}
                                    className="form-control input-sm chat_input" placeholder="Type your message here..." />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;