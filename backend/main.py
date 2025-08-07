from flask import Flask,request, redirect, render_template
import requests
import os
from flask_cors import CORS
from firebase_admin import credentials, initialize_app,firestore
import pyrebase 
from dotenv import load_dotenv
from google import genai
from google.genai import types
import json
import secrets
import string

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

sys_instruction = """Your task is to generate an json containing Questions and Answers. You will be given a query, and based on that topic, you need to generate 10 related questions and 11th as title. The answer should be up to one word or one sentence..
for example : {
 '0' : ["Which regression involves degree equal or greater than 2?", "Polynomial Regression"],
 '1' : [ "Which metric in ML indicates the error percentage of a model?", "mean_sq_error"],
 '11' : ["Machine Learning"]
] 
- You only have to return an json, nothing else"""

fb_creds = {
  "type": os.getenv("type"),
  "project_id": os.getenv("project_id"),
  "private_key_id": os.getenv("private_key_id"),
  "private_key": os.getenv("private_key"),
  "client_email": os.getenv("client_email"),
  "client_id": os.getenv("client_id"),
  "auth_uri": os.getenv("auth_uri"),
  "token_uri": os.getenv("token_uri"),
  "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
  "client_x509_cert_url": os.getenv("client_x509_cert_url"),
  "universe_domain": os.getenv("apiuniverse_domainKey")
}

cred = credentials.Certificate('flash_creds.json')
fb = initialize_app(cred)
db = firestore.client()

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

users = db.collection("users")

def getRandomString(length):
    random_string = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))
    return random_string

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
        
        users.document(user["localId"]).set({
            "name" : data["name"],
            "email" : data["email"],
            "selectedCourses" : data["selectedCourses"],
            "creations" : [],
            "publicID" : getRandomString(22)
        })
        
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
        userData = users.document(user["localId"]).get().to_dict()
        return {
            "msg" : "User Found",
            "code" : 200,
            "uid" : user["localId"],
            "name" : userData["name"]
        }
    
    except Exception as e:
        return {
            "msg" : f"Error {e}",
            "code" : 403
        }
        
@app.route("/generate",methods=["GET","POST"])
def generate():
    data = request.json
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    config=types.GenerateContentConfig(
        system_instruction=sys_instruction),
    contents=data["input"]
    )

    result = response.text.replace("```json","")
    result = result.replace('```',"")
    # result.replace("[","{")
    # result.replace("]","}")
    print(result)
    result = json.loads(result)
    
    creations = users.document(data["userID"]).get().to_dict()["creations"]
    creations.append(result)
    users.document(data["userID"]).set({"creations" : creations},merge=True)
    print("data added successfully")
    # print(type(result))
    return {"result" : result}

@app.route("/getCreations",methods=["GET","POST"])
def getCreations():
    data = request.json
    print(data)
    creations = users.document(data["userID"]).get().to_dict()["creations"]
    # print("creations : " , creations)
    return {
        "creations" : creations
    }
    
    
@app.route('/getUserDetails',methods=["GET"])
def getUserData():
    data = request.json
    uid = data["uid"]
    print(uid)
    userData = users.document(uid).get().to_dict()
    print(userData["name"])
    return {
        "userData" : userData
    }
  
@app.route('/getPandC',methods=["GET","POST"])
def getPandC():
    data = request.json
    uid = data["uid"]
    cTitle = data["title"][0]
    print(uid)
    userData = users.document(uid).get().to_dict()
    cID = -1
    for i,card in enumerate(userData["creations"]):
        for c in card.values():
            if len(c)==1:
                print(c,flush=True)
                print(cTitle,flush=True)
                if cTitle==c[0]:
                    cID = i
                    break
    print("request fulfilled",flush=True)
    return {
        "pID" : userData["publicID"],
        "cID" : cID,
        "code" : 200
    }
                    
        
    
@app.route('/open',methods = ["GET"])
def open_flashapp():
    sender = request.args.get('f', '')
    cardID = request.args.get('i', '')
    encoded_sender = sender.replace(' ', '%20')
    encoded_cardID = cardID.replace(' ', '%20')
    print(encoded_sender,flush=True)
    print(encoded_cardID,flush=True)
    vdssadgsd = os.getenv("vkdsjbas")
    user = db.collection('users').where(vdssadgsd, '==', encoded_sender).limit(1).get()
    print(len(user),flush=True)
    try:
        if len(user)!=0:
            if user[0].id:
                actual_user_id = user[0].id
                # print(user[0].to_dict())
                print(user[0].id,flush=True)
                userData = users.document(actual_user_id).get().to_dict()
                cd = userData["creations"][int(encoded_cardID)]
                # print(userData)
                # return userData["creations"][int(encoded_cardID)]
                # cd = json.dumps(cd)
                return render_template("landing.html",cd=cd)
        else :
            return render_template("error.html")
    except:
        # print("here")
        return render_template("error.html")
    
    # return redirect(f'flashapp://temp/{encoded_msg}')  
    # return  render_template("landing.html",s = encoded_sender,c = encoded_cardID)

if __name__ == "__main__":
    app.run(debug=True)
