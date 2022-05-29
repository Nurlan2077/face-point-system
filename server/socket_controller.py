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


# Перенаправляет сообщение на всех подписчиков события.
@sio.event
def external_id(sid, data):
    print(data)
    sio.emit('echo', {'external_id': data}, broadcast=True, include_self=False)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)



if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('localhost', 9092)), app)