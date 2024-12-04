import pymongo
from decouple import config
from pymongo import MongoClient

MONGO_URI = config("DB_URI")
mongo_client = pymongo.MongoClient(MONGO_URI)
MONGO_DB_NAME = config("DB_NAME")
mongo_db = mongo_client[MONGO_DB_NAME]
