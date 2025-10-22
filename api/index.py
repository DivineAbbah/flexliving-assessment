from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.main import app

handler = app