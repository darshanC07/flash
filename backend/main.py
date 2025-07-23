from flask import Flask,request
import requests
from flask_cors import CORS
from firebase_admin import credentials, auth, initialize_app


    
cred = credentials.Certificate('flash_creds.json')
firebase_app = initialize_app(cred)

app = Flask(__name__)
CORS(app)

@app.route("/signup",methods = ['POST'])
def register():
    # print("hello")
    data = request.json
    print(data)
    try:
        user = auth.create_user(
            email=data['email'],
            password=data['password'],
            display_name=data['name'],
        )
        print(f'Successfully created new user: {user.uid}')
        return {
            "msg": "user created successfully",
            "code": 200,
            'uid' :user.uid
        }
    except Exception as e:
        print(f'Error creating user: {e}')
        return {
            "msg": e,
            "code": 401
        }
    
if __name__ == "__main__":
    app.run(debug=True)