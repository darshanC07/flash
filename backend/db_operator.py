import pyrebase 
from main import firebase_config
from firebase_admin import firestore,initialize_app,credentials
from main import db

# creds = credentials.Certificate("flash_creds.json")
# firebase = initialize_app(creds)

# db = firestore.client()
db.collection("users").document("mAZ07wixd0bRpkilToFI8JxDz7R2").set({"email" : "hi"},merge=True)

# for doc in db.collection("users").stream():
#     print(doc.to_dict())
#     print(doc.id)