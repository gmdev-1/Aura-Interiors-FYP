from django.db import models
from django.conf import settings
from bson import ObjectId, json_util
import json
from utils.db_connection import mongo_db

product_collection = mongo_db["product"]

@staticmethod
def get_one_product_by_name(product_name):
        pipeline = [
            { "$match": {"name": product_name}},
            {
                "$lookup": {
                    "from": "category",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "category_info"
                }
            },
            {
                "$unwind": {
                    "path": "$category_info",
                    "preserveNullAndEmptyArrays": True
                }
            }
        ]
        product_cursor = product_collection.aggregate(pipeline)
        product_list = list(product_cursor)
        if not product_list:
            return None
        product = product_list[0]
        
        product["id"] = str(product.get("_id"))
        product["category_id"] = str(product.get("category"))
        product["category"] = product.get("category_info", {}).get("name")
        product.pop("_id", None)
        product.pop("category_info", None)
        return product
    
def home_featured_products():
    featured_cursor = product_collection.find({"is_featured": "true"})
    products = list(featured_cursor)
    json_products = json.loads(json_util.dumps(products))
    return json_products
    

def get_filtered_products(query_params):
    conditions = []

    # --- Featured Filter ---
    featured = query_params.get("featured")
    if featured and featured.lower() == "true":
        conditions.append({
            "$or": [
                {"is_featured": True},
                {"is_featured": "true"}
            ]
        })

    # --- Category Filter ---
    category_param = query_params.get("category")
    if category_param:
        # Expecting a comma-separated list of category IDs
        category_ids = [cat.strip() for cat in category_param.split(",") if cat.strip()]
        try:
            # Convert category IDs to ObjectId if applicable
            category_object_ids = [ObjectId(cat) for cat in category_ids]
            conditions.append({"category": {"$in": category_object_ids}})
        except Exception as e:
            conditions.append({"category": {"$in": category_ids}})

    # --- Price Range Filter ---
    price_map = {
        "Under $25": (0, 25),
        "$25 - $50": (25, 50),
        "$50 - $100": (50, 100),
        "$100 - $200": (100, 200),
        "Above $200": (200, 10000)
    }
    price_range_param = query_params.get("priceRange")
    if price_range_param:
        price_labels = [label.strip() for label in price_range_param.split(",") if label.strip()]
        price_conditions = []
        for label in price_labels:
            if label in price_map:
                min_price, max_price = price_map[label]
                price_conditions.append({"price": {"$gte": min_price, "$lte": max_price}})
        if price_conditions:
            conditions.append({"$or": price_conditions})

    # --- Material Filter ---
    material_param = query_params.get("material")
    if material_param:
        materials = [m.strip() for m in material_param.split(",") if m.strip()]
        if materials:
            conditions.append({"material": {"$in": materials}})

    # --- Color Filter ---
    color_param = query_params.get("color")
    if color_param:
        colors = [c.strip() for c in color_param.split(",") if c.strip()]
        if colors:
            conditions.append({"color": {"$in": colors}})

    # Combine conditions if any; otherwise, use an empty query to fetch all products.
    query = {"$and": conditions} if conditions else {}

    products = list(product_collection.find(query, {"_id": 0}))
    
    # Convert the result to JSON and back, so that ObjectIds are automatically converted to strings.
    products = json.loads(json_util.dumps(products))
    return products