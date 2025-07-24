from flask import Flask,request
import requests
import os
from flask_cors import CORS
# from firebase_admin import credentials, auth, initialize_app
import pyrebase 
from dotenv import load_dotenv


    
# cred = credentials.Certificate('flash_creds.json')
# firebase_app = initialize_app(cred)

load_dotenv()
# print("start")
firebase_config = {
  "apiKey": os.getenv("apiKey"),
  "authDomain": os.getenv("authDomain"),
  "databaseURL": os.getenv("databaseURL"),
  "projectId": os.getenv("projectId"),
  "storageBucket": os.getenv("storageBucket"),
  "messagingSenderId": os.getenv("messagingSenderId"),
  "appId": os.getenv("appId"),
  "measurementId": os.getenv("measurementId")
}

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

app = Flask(__name__)
CORS(app)

@app.route("/signup",methods = ['POST'])
def register():
    # print("hello")
    data = request.json
    print(type(data))
    print(data)
    try:
        # user = auth.create_user(
        #     email=data['email'],
        #     password=data['password'],
        #     display_name=data['name'],
        # )
        user = auth.create_user_with_email_and_password(data["email"],data["password"])
        print(f'Successfully created new user: {user}')
        print(type(user))
        print(user["localId"])
        return {
            "msg": "user created successfully",
            "code": 200,
            'uid' :user["localId"]
        }
    except Exception as e:
        print(f'Error creating user: {e}')
        return {
            "msg": e,
            "code": 401
        }
    
@app.route("/login",methods=["GET",'POST'])
def login():
    data = request.json
    print(os.getenv("apiKey"))
    print(data)
    try:
        user = auth.sign_in_with_email_and_password(data["email"],data["password"])
        print(user)
        return {
            "msg" : "User Found",
            "code" : 200,
            "uid" : user["localId"]
        }
    
    except Exception as e:
        return {
            "msg" : f"Error {e}",
            "code" : 403
        }
        
if __name__ == "__main__":
    app.run(debug=True)