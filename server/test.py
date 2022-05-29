# import socket
#
# # Create a client socket
#
# clientSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#
# # Connect to the server
#
# clientSocket.connect(("127.0.0.1", 9092))
#
# # Send data to server
#
# data = "Hello Server!"
#
# clientSocket.send(data.encode())
#

import socketio

sio = socketio.Client()



@sio.event
def connect():
    print('connection established')
    sio.emit('my_message', "hi mark")

@sio.event
def echo(data):
    print('message received with ', data)


@sio.event
def disconnect():
    sio.disconnect()
    print('disconnected from server')

sio.connect('http://localhost:9092')
sio.wait()