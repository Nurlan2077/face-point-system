# from flask_socketio import SocketIO, emit, send
# from flask import Flask
#
# app = Flask(__name__)
#
# app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app)
#
#
# @socketio.on('message')
# def handle_message(msg):
#     print('Message: ' + msg.decode())
#     send(msg, broadcast=True)
#
#
# if __name__ == '__main__':
#     socketio.run(app, port=9092)

import eventlet
import socketio
from flask import app

sio = socketio.Server()
sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio, app)

@sio.event
def connect(sid, environ):
    print('connect ', sid)
    # sio.emit("my_message", "from the hell and back")

@sio.event
def external_id(sid, data):
    print(data)
    sio.emit('echo', {'external_id': data}, broadcast=True, include_self=False)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


# @sio.on("new_message")
# def new_message(sid, data):
#     print(data)


if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('localhost', 9092)), app)