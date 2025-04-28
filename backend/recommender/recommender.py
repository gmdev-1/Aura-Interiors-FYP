import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils.db_connection import mongo_db

# MongoDB collection name for products
COLLECTION_NAME = 'product'


def _load_data():
    """
    Load and preprocess product data from MongoDB into a pandas DataFrame.
    """
    cursor = mongo_db[COLLECTION_NAME].find()
    df = pd.DataFrame(list(cursor))

    # Normalize column names to lowercase
    df.columns = df.columns.str.lower()

    # Drop rows missing essential fields
    df = df.dropna(subset=['name', 'description'])

    # Ensure no NaNs and cast key fields to strings
    df.fillna('', inplace=True)
    for col in ['description', 'category', 'material', 'color', 'name']:
        if col in df:
            df[col] = df[col].astype(str)

    # Build combined text feature for similarity
    df['combined_features'] = (
        df['description'] + ' ' +
        df.get('category', '') + ' ' +
        df.get('material', '') + ' ' +
        df.get('color', '')
    )
    return df

# Preload data at import
_df = _load_data()

# Vectorize combined features
_tfidf = TfidfVectorizer(stop_words='english')
_tfidf_matrix = _tfidf.fit_transform(_df['combined_features'])
_cosine_sim = cosine_similarity(_tfidf_matrix, _tfidf_matrix)


def recommend_by_name(product_name: str, top_n: int = 3) -> list:
    """
    Given a partial or full product name, return up to top_n similar product names.
    """
    # Find matching product index
    mask = _df['name'].str.contains(product_name, case=False, na=False)
    if not mask.any():
        return []
    idx = _df[mask].index[0]

    # Compute and sort similarity scores
    sim_scores = list(enumerate(_cosine_sim[idx]))
    sim_scores.sort(key=lambda x: x[1], reverse=True)

    # Exclude self and take top_n
    top_indices = [i for i, _ in sim_scores if i != idx][:top_n]
    
    recommended_products = []
    for i in top_indices:
        product = _df.iloc[i]
        recommended_products.append({
            "id": str(product.get('_id', '')),
            "name": product.get('name', ''),
            "description": product.get('description', ''),
            "category": product.get('category', ''),
            "image": product.get('image', ''),
            "quantity": product.get('quantity', ''),
            "discount": product.get('discount', ''),
            "material": product.get('material', ''),
            "color": product.get('color', ''),
            "price": product.get('price', ''),
            "rating": product.get('rating', ''),
            "review": product.get('review', ''),
            "is_featured": product.get('is_featured', ''),
        })

    return recommended_products
