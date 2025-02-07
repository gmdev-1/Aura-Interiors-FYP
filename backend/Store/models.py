from rest_framework import serializers
from django.core.exceptions import ValidationError
import re
import bcrypt
from utils.db_connection import mongo_db

# MongoDB collection
user_collection = mongo_db["users"]

# Model
class User:
    def __init__(self, name, email, phone, password, role="user", id=None):
        self.name = name
        self.email = email.lower() if email else None
        self.phone = phone
        self.password = password  # Hashed password
        self.role = role
        self._id = id
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @property
    def id(self):
        return str(self._id) if self._id else None

    @staticmethod
    def hash_password(raw_password):
        return bcrypt.hashpw(raw_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def check_password(hashed_password, raw_password):
        return bcrypt.checkpw(raw_password.encode("utf-8"), hashed_password.encode("utf-8"))

    def save(self):
        if user_collection.find_one({"email": self.email}):
            raise ValueError("A user with this email already exists.")

        if user_collection.find_one({"phone": self.phone}):
            raise ValueError("A user with this phone number already exists.")

        user_document = {
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "password": self.hash_password(self.password),
            "role": self.role,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        result = user_collection.insert_one(user_document)
        self._id = result.inserted_id
        return self._id

    @classmethod
    def authenticate(cls, email, password):
        user_data = user_collection.find_one({"email": email.lower()})
        if not user_data:
            return None
        
        if cls.check_password(user_data['password'], password):
            return cls(
                id=user_data['_id'],
                name=user_data['name'],
                email=user_data['email'],
                phone=user_data['phone'],
                password=user_data['password'],
                role=user_data['role'],
            )
        return None