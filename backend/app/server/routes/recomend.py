import pandas as pd
from bson import ObjectId
from fastapi import APIRouter
from server.config.db import db
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

recommendation_router = APIRouter()

job_data = list(db.jobs.find())

job_titles = []
descriptions = []
skills = []
job_ids = []

for job in job_data:
    job_ids.append(str(job.get('_id', '')))
    job_titles.append(job.get('title', ''))
    descriptions.append(job.get('description', ''))
    skills.append(job.get('skills', ''))

job_data = pd.DataFrame({
    '_id': job_ids,
    'title': job_titles,
    'description': descriptions,
    'skills': skills
})

job_data['description'] = job_data['description'].fillna('')
job_data['skills'] = job_data['skills'].fillna('')
job_data['content'] = job_data['title'].apply(str) + ' ' + \
    job_data['description'].apply(str) + ' ' + job_data['skills'].apply(str)


tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(job_data['content'])


cosine_sim = cosine_similarity(tfidf_matrix)


def get_job_recommendations(user_skills, cosine_sim, job_data):
  
    user_profile = tfidf.transform([user_skills])

  
    similarity_scores = cosine_similarity(user_profile, tfidf_matrix)
    recommendations_df = pd.DataFrame({
        '_id': job_data['_id'],
        'title': job_data['title'],
        'description': job_data['description'],
        'skills': job_data['skills'],
        'similarity_score': similarity_scores[0]
    })
    recommendations_df = recommendations_df.sort_values(
        by='similarity_score', ascending=False)

    recommendations_df = recommendations_df.drop_duplicates(subset='_id')

    return recommendations_df


@recommendation_router.get("/recommendation")
async def get_recommendations(user_skills: str, page: int = 1, limit: int = 10):
    recommendations_df = get_job_recommendations(
        user_skills, cosine_sim, job_data)
 
    recommendations_df = recommendations_df[recommendations_df['similarity_score'] > 0.1]

    total_recommendations = len(recommendations_df)
    total_pages = (total_recommendations + limit - 1) // limit

    start_index = (page - 1) * limit
    end_index = start_index + limit
    recommended_jobs = recommendations_df[start_index:end_index][[
        '_id', 'title', 'description', 'skills', 'similarity_score']].to_dict(orient='records')


    for job in recommended_jobs:
        job['_id'] = str(job['_id'])

    response = {
        'total_recommendations': total_recommendations,
        'total_pages': total_pages,
        'current_page': page,
        'recommended_jobs': recommended_jobs
    }

    return response
