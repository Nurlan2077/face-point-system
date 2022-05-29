import requests
import json
import ast
import uuid
import socketio

sio = socketio.Client()


@sio.event
def connect():
    print('connection established')


@sio.event
def disconnect():
    sio.disconnect()


sio.connect('http://localhost:9092')


# Добавить отправку данных post запросом
def get_info_from_webcam():
    # Base64 обнаруженного лица.
    image_bytes = 0

    external_id = 0

    r = requests.get('http://127.0.0.1:8080/event?login=root&password=&responsetype=json',
                     stream=True)

    for line in r.iter_lines():
        if line.decode('utf-8').startswith("\t\"ExternalId\""):
            external_id = ast.literal_eval("{" + line.decode('utf-8') + "}")["ExternalId"]
            print("Распознан")

            if external_id != "":
                sio.emit('external_id', str(external_id))


        elif line.decode('utf-8').startswith("\t\"ImageBytes\""):
            image_bytes = ast.literal_eval("{" + line.decode('utf-8') + "}")["ImageBytes"]
            # print(image_bytes)

            url = 'http://127.0.0.1:9091/add_person'
            send_data = {"image_bytes": str(image_bytes)}

            x = requests.post(url, json=send_data)

    # print(line.decode('utf-8'))

get_info_from_webcam()
