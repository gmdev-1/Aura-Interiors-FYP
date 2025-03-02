from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from bson import ObjectId
from utils.db_connection import mongo_db


user_collection = mongo_db["users"]
 

class User:
    def __init__(self, name, email, password, role="user", id=None, is_verified=False, verification_token=None, token_expires_at=None):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.is_verified = is_verified
        self.verification_token = verification_token
        self.token_expires_at = token_expires_at
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        hashed_password = self.hash_password(self.password)
        user_document = {
            "name": self.name,
            "email": self.email,
            "password": hashed_password,
            "role": self.role,
            "is_verified": self.is_verified,
            "verification_token": self.verification_token,
            "token_expires_at": self.token_expires_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        result = user_collection.insert_one(user_document)
        self.id = str(result.inserted_id)
        return self.id
        
        self.id = str(result.inserted_id)
        return self.id
    
    @staticmethod
    def hash_password(raw_password):
        return make_password(raw_password)
    
    @staticmethod    
    def check_password(stored_hash, raw_password):
        return check_password(raw_password, stored_hash)
        
    @classmethod
    def authenticate(cls, email, password):
        user = user_collection.find_one({"email": email, "role": "user"})
        if not user:
            return None
        
        if not user.get("is_verified", False):
            return None
        
        if cls.check_password(user["password"], password):
            return cls.from_document(user)
        
    @classmethod
    def from_document(cls, doc):
        user = cls (
            name=doc.get("name"),
            email=doc.get("email"),
            password=doc.get("password"),
            role=doc.get("role"),
            is_verified=doc.get("is_verified"),
            verification_token=doc.get("verification_token"),
            token_expires_at=doc.get("token_expires_at"),
        )
        user.id = str(doc.get("_id"))
        user.created_at = doc.get("created_at")
        user.updated_at = doc.get("updated_at")
        return user
    
    @classmethod
    def get_by_id(cls, user_id):
        try:
            user_doc = user_collection.find_one({"_id": ObjectId(user_id)})
            if user_doc:
                return cls.from_document(user_doc)
            return None
        except Exception:
            return None
        
    @property
    def is_authenticated(self):
        return True
    
    
    def update_verification_token(self, token, token_expires_at):
        self.verification_token = token
        self.token_expires_at = token_expires_at
        update_fields = {
            "verification_token": token,
            "token_expires_at": token_expires_at,
            "updated_at": datetime.utcnow()
        }
        user_collection.update_one({"_id": ObjectId(self.id)}, {"$set": update_fields})
    
    
    def __str__(self):
        return f"User(name={self.name}, email={self.email}, role={self.role}, is_verified={self.is_verified})"
