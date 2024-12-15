import requests
import time
import asyncio
import json
from langchain_community.llms import Ollama
from aiofile import AIOFile

CACHE_FILE = 'response_cache.json'

response_cache = {}
llm = None  # Initialize the model variable

async def check_server():
    try:
        response = requests.get('http://localhost:11434')
        if response.status_code == 200:
            return True
    except requests.exceptions.ConnectionError:
        return False

async def load_cache():
    global response_cache
    try:
        async with AIOFile(CACHE_FILE, 'r') as file:
            cache_data = await file.read()
            response_cache = json.loads(cache_data)
        print("Cache loaded successfully.")
    except FileNotFoundError:
        print("Cache file not found. Starting with an empty cache.")
    except json.JSONDecodeError:
        print("Cache file is corrupted. Starting with an empty cache.")
        response_cache = {}

async def save_cache():
    async with AIOFile(CACHE_FILE, 'w') as file:
        await file.write(json.dumps(response_cache))
    print("Cache saved successfully.")

async def invoke_model(query):
    global response_cache
    
    if query in response_cache:
        print("Fetching response from cache for query:", query)
        start_time = time.time()
        response = response_cache[query]
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Time taken to fetch from the cache: {elapsed_time:.2f} seconds")
    else:
        print("Sending query to model for query:", query)
        start_time = time.time()  # Start timing
        response = await asyncio.to_thread(llm.invoke, query)
        end_time = time.time()  # End timing
        elapsed_time = end_time - start_time
        print(f"Time taken to invoke model: {elapsed_time:.2f} seconds")
        response_cache[query] = response
        await save_cache()
    
    print("Response:")
    points = response.split('\n')
    for i, point in enumerate(points, start=1):
        if point.strip():
            print(f"{point.strip()}")

async def initialize_model():
    global llm
    llm = Ollama(model="gemma2")  # Initialize the model once

async def run_with_query(query):
    await load_cache()
    await initialize_model()  # Ensure the model is initialized
    await invoke_model(query)

query_to_execute = "what is cancer"  

# Running the asynchronous main function
asyncio.run(run_with_query(query_to_execute))
