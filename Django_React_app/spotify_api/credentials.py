import os
from dotenv import load_dotenv

path_to_env_file = ('./.env')
load_dotenv(path_to_env_file)

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
