import psycopg2
import os

DATABASE_URL = "postgresql://neondb_owner:npg_kpx8oHv7XTVt@ep-purple-bonus-ajuntmkb-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def get_connection():
    return psycopg2.connect(DATABASE_URL)
