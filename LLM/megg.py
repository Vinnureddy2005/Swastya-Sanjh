from flask import Flask, request, jsonify
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import re
import pdfplumber
import pandas as pd
import joblib
import asyncio
import json
import requests
from flask_cors import CORS
from langchain_community.llms import Ollama
import time

import os

app = Flask(__name__)
CORS(app)

# Load environment variables
DIABETES_MODEL_PATH = os.getenv('DIABETES_MODEL_PATH', './models/diabetes_model.pkl')
DIABETES_LABEL_ENCODER_PATH = os.getenv('DIABETES_LABEL_ENCODER_PATH', './models/diabetes_label_encoder.pkl')
THYROID_MODEL_PATH = os.getenv('THYROID_MODEL_PATH', './models/thyroid_model_rf.pkl')
THYROID_LABEL_ENCODER_PATH = os.getenv('THYROID_LABEL_ENCODER_PATH', './models/thyroid_label_encoder_rf.pkl')
DIABETES_DATA_PATH = os.getenv('DIABETES_DATA_PATH', './datasets/diabetes.csv')
THYROID_DATA_PATH = os.getenv('THYROID_DATA_PATH', './datasets/thyroid999.csv')
ANEMIA_MODEL_PATH = os.getenv('ANEMIA_MODEL_PATH', './models/anemia_model.pkl')
ANEMIA_LABEL_ENCODER_PATH = os.getenv('ANEMIA_LABEL_ENCODER_PATH', './models/anemia_label_encoder.pkl')
ANEMIA_DATA_PATH = os.getenv('ANEMIA_DATA_PATH', './datasets/anemia.csv')
BLOOD_MODEL_PATH = os.getenv('BLOOD_MODEL_PATH', './models/blood_model.pkl')
BLOOD_LABEL_ENCODER_PATH = os.getenv('BLOOD_LABEL_ENCODER_PATH', './models/blood_label_encoder.pkl')
BLOOD_DATA_PATH = os.getenv('BLOOD_DATA_PATH', './datasets/blood_report.csv')

# Load the saved models and the label encoders
diabetes_model = joblib.load(DIABETES_MODEL_PATH)
diabetes_label_encoder = joblib.load(DIABETES_LABEL_ENCODER_PATH)
diabetes_data = pd.read_csv(DIABETES_DATA_PATH)

thyroid_model = joblib.load(THYROID_MODEL_PATH)
thyroid_label_encoder = joblib.load(THYROID_LABEL_ENCODER_PATH)
thyroid_data = pd.read_csv(THYROID_DATA_PATH)

anemia_model = joblib.load(ANEMIA_MODEL_PATH)
anemia_label_encoder = joblib.load(ANEMIA_LABEL_ENCODER_PATH)
anemia_data = pd.read_csv(ANEMIA_DATA_PATH)

blood_model = joblib.load(BLOOD_MODEL_PATH)
blood_label_encoder = joblib.load(BLOOD_LABEL_ENCODER_PATH)
blood_data = pd.read_csv(BLOOD_DATA_PATH)

# Load the dataset
bp_data = pd.read_csv("./datasets/blood_pressure_data.csv")

# Prepare features and labels
X_bp = bp_data[['systolic_bp', 'diastolic_bp']]  # Features
y_bp = bp_data['bp_category']  # Labels

# Split the dataset into training and test sets
X_train_bp, X_test_bp, y_train_bp, y_test_bp = train_test_split(X_bp, y_bp, test_size=0.2, random_state=42)

# Initialize the Random Forest Classifier
bp_model = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the model
bp_model.fit(X_train_bp, y_train_bp)

# Make predictions
y_pred_bp = bp_model.predict(X_test_bp)



# Common function to extract text from PDF using pdfplumber
def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    return text

# Preprocess and extract features for diabetes report
def preprocess_and_extract_features_diabetes(text):
    # Define patterns for glucose levels
    fasting_glucose_pattern = re.compile(
        r'(?:Glucose Fasting|FASTING PLASMA GLUCOSE|GLUCOSE, FASTING \(F\), PLASMA|Fasting Blood Glucose|Fasting Blood Sugar|FBS)\s*[:\-]?\s*(\d+\.\d+|\d+)\s*mg/dL',
        re.IGNORECASE
    )
    post_lunch_glucose_pattern = re.compile(
        r'(?:Glucose\s*\(PP\)|POST LUNCH PLASMA GLUCOSE|GLUCOSE, POST PRANDIAL \(PP\), 2 HOURS\s*,?\s*PLASMA|Postprandial Blood Glucose|Postprandial Blood Sugar|PPBS|GLUCOSE, POST PRANDIAL \(PP\), 2 HOURS,)\s*[:\-]?\s*(\d+\.\d+|\d+)\s*mg/dL',
        re.IGNORECASE
    )

    fasting_glucose_match = fasting_glucose_pattern.search(text)
    post_lunch_glucose_match = post_lunch_glucose_pattern.search(text)

    if not fasting_glucose_match or not post_lunch_glucose_match:
        return None, None, None

    fasting_plasma_glucose = float(fasting_glucose_match.group(1)) if fasting_glucose_match else 0
    post_lunch_plasma_glucose = float(post_lunch_glucose_match.group(1)) if post_lunch_glucose_match else 0

    # Use nearest values from diabetes_data for prediction
    fasting_plasma_glucose = diabetes_data['fasting_plasma_glucose'].iloc[(diabetes_data['fasting_plasma_glucose'] - fasting_plasma_glucose).abs().argsort()[:1]].values[0]
    post_lunch_plasma_glucose = diabetes_data['post_lunch_plasma_glucose'].iloc[(diabetes_data['post_lunch_plasma_glucose'] - post_lunch_plasma_glucose).abs().argsort()[:1]].values[0]

    return [[fasting_plasma_glucose, post_lunch_plasma_glucose]], fasting_plasma_glucose, post_lunch_plasma_glucose

# Preprocess and extract features for thyroid report
def preprocess_and_extract_features_thyroid(text):
    # Define patterns for TSH, T3, T4
    t3_pattern = re.compile(r'T3[^0-9]([0-9.]+)\s(ng/mL|ngmL|ng/dL)', re.IGNORECASE)
    t4_pattern = re.compile(r't4\s*total\s*:?\s*([\d.]+)\s*µg/dl', re.IGNORECASE)
    tsh_pattern = re.compile(r'tsh\s*-\s*ultrasensitive\s*:?\s*([\d.]+)\s*µiu/ml', re.IGNORECASE)

    # Match patterns in text
    tsh_match = tsh_pattern.search(text)
    t3_match = t3_pattern.search(text)
    t4_match = t4_pattern.search(text)

    # Extract values
    tsh_value = float(tsh_match.group(1)) if tsh_match else 0
    t3_value = float(t3_match.group(1)) if t3_match else 0
    t4_value = float(t4_match.group(1)) if t4_match else 0

    # Prepare features for prediction
    features = [[tsh_value, t3_value, t4_value]]

    return features, tsh_value, t3_value, t4_value

def preprocess_and_extract_features_anemia(text):
    serum_iron_pattern = re.compile(r'Iron\s*[:\-]?\s*(\d+(\.\d+)?)\s*ug/dL', re.IGNORECASE)
    tibc_pattern = re.compile(r'Total Iron Binding Capacity \(TIBC\)\s*[:\-]?\s*(\d+(\.\d+)?)\s*µg/dL', re.IGNORECASE)
    transferrin_saturation_pattern = re.compile(r'Transferrin Saturation\s*[:\-]?\s*(\d+(\.\d+)?)\s*%', re.IGNORECASE)

    serum_iron_match = serum_iron_pattern.search(text)
    tibc_match = tibc_pattern.search(text)
    transferrin_saturation_match = transferrin_saturation_pattern.search(text)

    serum_iron = round(float(serum_iron_match.group(1))) if serum_iron_match else None
    tibc = round(float(tibc_match.group(1))) if tibc_match else None
    transferrin_saturation = round(float(transferrin_saturation_match.group(1))) if transferrin_saturation_match else None
   
    return [[serum_iron, tibc, transferrin_saturation]], serum_iron, tibc, transferrin_saturation
# Function to preprocess and extract features for blood report
def preprocess_and_extract_features_blood(text):
    patterns = {
        'HAEMOGLOBIN': re.compile(r'HAEMOGLOBIN\s*[:\-]?\s*(\d+(\.\d+)?)\s*gms?%', re.IGNORECASE),
        'TOTAL_RBC_COUNT': re.compile(r'TOTAL\s*R\.?\s*B\.?\s*C\s*COUNT\s*[:\-]?\s*(\d+(\.\d+)?)\s*Mill(?:ion|\/Cumm|\/Cumm\.)', re.IGNORECASE),
        'WBC_TOTAL': re.compile(r'W\.?\s*B\.?\s*C\s*\(TOTAL\)\s*[:\-]?\s*([\d,]+)\s*\/Cumm', re.IGNORECASE),
        'PLATELETS_COUNT': re.compile(r'PLATELETS\s*COUNT\s*[:\-]?\s*(\d+\.\d+)', re.IGNORECASE),
        'Neutrophils': re.compile(r'NEUTROPHILS\s*[:\-]?\s*(\d+(\.\d+)?)\s*%', re.IGNORECASE),
        'Lymphocytes': re.compile(r'LYMPOCYTES\s*[:\-]?\s*(\d+(\.\d+)?)\s*%', re.IGNORECASE),
        'Eosinophils': re.compile(r'EOSINOPHILS\s*[:\-]?\s*(\d+(\.\d+)?)\s*%', re.IGNORECASE),
        'Monocytes': re.compile(r'MONOCYTES\s*[:\-]?\s*(\d+(\.\d+)?)\s*', re.IGNORECASE),
        'Basophils': re.compile(r'BASOPHILS\s*[:\-]?\s*(\d+(\.\d+)?)\s*%', re.IGNORECASE)
    }
   

    features = []
    missing_values = []

    for key, pattern in patterns.items():
        match = pattern.search(text)
        value = 0  # Default to 0 if value is missing
        if match:
            value = round(float(match.group(1).replace(',', '')), 2)
        else:
            missing_values.append(key)
        features.append(value)
    
    return [features], features, missing_values

def preprocess_kidney_dataset(file_path):
    kidney_data = pd.read_csv(file_path)
    kidney_data.replace('Negative', 0, inplace=True)
    kidney_data.replace('Trace', 0.5, inplace=True)
    
    # Convert relevant columns to numeric
    for column in ['Specific Gravity', 'pH', 'Protein (mg/dL)']:
        kidney_data[column] = pd.to_numeric(kidney_data[column], errors='coerce')

    # Encode 'Blood' and 'WBCs/pus cells' as numeric
    kidney_data['Blood'] = kidney_data['Blood'].apply(lambda x: 1 if x != 'None' else 0)
    
    def parse_wbcs(x):
        if '-' in x:
            return float(x.split('-')[0])
        elif '>' in x:
            return float(x.replace('>', ''))
        else:
            return float(x)
    
    kidney_data['WBCs/pus cells'] = kidney_data['WBCs/pus cells'].apply(parse_wbcs)
    
    kidney_data.dropna(inplace=True)

    # Encode categorical columns
    color_encoder = LabelEncoder()
    appearance_encoder = LabelEncoder()

    kidney_data['Color'] = color_encoder.fit_transform(kidney_data['Color'])
    kidney_data['Appearance'] = appearance_encoder.fit_transform(kidney_data['Appearance'])

    return kidney_data, color_encoder, appearance_encoder

preprocessed_kidney_data, color_encoder, appearance_encoder = preprocess_kidney_dataset("./datasets/urine_test_combinations.csv")
X_kidney = preprocessed_kidney_data[['Color', 'Appearance', 'Specific Gravity', 'pH', 'WBCs/pus cells', 'Protein (mg/dL)', 'Blood']]
y_kidney = preprocessed_kidney_data['Report Result']
kidney_label_encoder = LabelEncoder()
y_kidney_encoded = kidney_label_encoder.fit_transform(y_kidney)
kidney_model = RandomForestClassifier(n_estimators=100, random_state=42)
kidney_model.fit(X_kidney, y_kidney_encoded)
def preprocess_and_extract_features_kidney(text):
    patterns = {
        'Specific_Gravity': re.compile(r'Specific Gravity\s+(\d+\.\d+)', re.IGNORECASE),
        'pH': re.compile(r'pH\s+(\d+\.\d+)', re.IGNORECASE),
        'WBCs': re.compile(r'WBCs/Pus Cells\s+(\d+)\s*-\s*\d+|\WBCs/Pus Cells\s+>\s*(\d+)', re.IGNORECASE),
        'Protein': re.compile(r'Protein\s+(\w+)', re.IGNORECASE),
        'Blood': re.compile(r'Blood\s+(\w+)', re.IGNORECASE),
    }
    
    color_pattern = re.compile(r'Color\s+(\w+\s\w+)', re.IGNORECASE)
    color_match = color_pattern.search(text)
    if color_match:
        color = color_match.group(1)
       
    else:
        color = None

    appearance_pattern = re.compile(r'Appearance\s+\w+\s+(\w+)', re.IGNORECASE)
    appearance_match = appearance_pattern.search(text)
    if appearance_match:
        appearance = appearance_match.group(1)
        
    else:
        appearance = None

    features = []
    feature_values = []

    for key, pattern in patterns.items():
        match = pattern.search(text)
        value = None
        if match:
            value = match.group(1) if match.group(1) else match.group(2)
            if key in ['Specific_Gravity', 'pH']:
                try:
                    value = float(value)
                except ValueError:
                    value = None
            elif key == 'WBCs':
                try:
                    value = float(value)
                except ValueError:
                    value = None
            elif key in ['Protein', 'Blood']:
                value = 1 if value != 'Negative' and value != 'Nil' else 0
        features.append(value)
        feature_values.append(value)

        if not match:
            print(f"No match found for {key}")
        else:
            print(f"{key}: {value}")

    # Append the original string values of color and appearance to feature_values for display purposes
    feature_values.insert(0, color)
    feature_values.insert(1, appearance)

    # Convert color and appearance to encoded values for prediction
    try:
        color = color_encoder.transform([color])[0] if color else -1
    except ValueError:
        color = -1
    try:
        appearance = appearance_encoder.transform([appearance])[0] if appearance else -1
    except ValueError:
        appearance = -1

    features.insert(0, color)
    features.insert(1, appearance)

    return [features], feature_values
#Endpoint for diabetes report analysis
@app.route('/diabetes', methods=['POST'])
def diabetes():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        text = extract_text_from_pdf(file)
        preprocessed_text = text.lower()
        diabetes_keywords = ['diabetes', 'insulin', 'glucose', 'blood sugar', 'hyperglycemia', 'hypoglycemia']
        diabetes_related = any(keyword in preprocessed_text for keyword in diabetes_keywords)
        
        if not diabetes_related:
            return jsonify({'message': 'This is not a diabetes report.'}), 400
        
        features, fasting_glucose, post_lunch_glucose = preprocess_and_extract_features_diabetes(preprocessed_text)
        if fasting_glucose is None or post_lunch_glucose is None:
            return jsonify({'message': 'Not a diabetes report. Glucose values not found in the document.'}), 400
        
        prediction = diabetes_model.predict(features)
        predicted_label = diabetes_label_encoder.inverse_transform(prediction)[0]
        query_to_execute = predicted_label
        response = run_with_query(query_to_execute)
        
        # Prepare JSON response
        response_data = {
            'fasting_plasma_glucose': int(fasting_glucose),
            'post_lunch_plasma_glucose': int(post_lunch_glucose),
            'predicted_label': predicted_label,
            'response': response,
        }

        
        return jsonify(response_data), 200

    return jsonify({'error': 'An error occurred'}), 400
# Endpoint for thyroid report analysis
@app.route('/thyroid', methods=['POST'])
def thyroid():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        text = extract_text_from_pdf(file)
        preprocessed_text = text.lower()

        # Preprocess and extract features
        features, tsh_value, t3_value, t4_value = preprocess_and_extract_features_thyroid(preprocessed_text)

        # Make prediction using the loaded model
        prediction = thyroid_model.predict(features)
        predicted_label = thyroid_label_encoder.inverse_transform(prediction)[0]
        query_to_execute = predicted_label
        response = run_with_query(query_to_execute)
        
        # Prepare JSON response
        response_data = {
            't3_value': t3_value,
            't4_value': t4_value,
            'tsh_value': tsh_value,
            'predicted_label': predicted_label,
            'response': response,
        }
        
        return jsonify(response_data), 200

    return jsonify({'error': 'An error occurred'}), 400

@app.route('/anemia', methods=['POST'])
def anemia():
    
    if 'file' not in request.files:
        return {"error": "No file part"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "No selected file"}, 400
    if file:
        # Extract text from the PDF file
        text = extract_text_from_pdf(file)
        preprocessed_text = text.lower()

        # Preprocess text and extract features
        features, serum_iron, tibc, transferrin_saturation = preprocess_and_extract_features_anemia(preprocessed_text)

        if not serum_iron or not tibc or not transferrin_saturation:
            return {"result": "Not an Anemia Report"}, 200
        # Make prediction using the loaded model
        prediction = anemia_model.predict(features)
        predicted_label = anemia_label_encoder.inverse_transform(prediction)[0]
        query_to_execute = predicted_label
        response = run_with_query(query_to_execute)
        
        result = {
                    "serumIron": serum_iron,
                    "tibc": tibc,
                    "transferrinSaturation": transferrin_saturation,
                    "result": predicted_label,
                    "condition_analysis": response
                }
      

        return jsonify(result), 200

    return jsonify({'error': 'An error occurred'}), 400

@app.route('/blood', methods=['POST'])
def blood():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        text = extract_text_from_pdf(file)
        preprocessed_text = text.lower()

        features, values, missing_values = preprocess_and_extract_features_blood(preprocessed_text)

        if missing_values:
            return jsonify({'error': f'Missing values for: {", ".join(missing_values)}'}), 400

        prediction = blood_model.predict(features)
        predicted_label = blood_label_encoder.inverse_transform(prediction)[0]
        query_to_execute = predicted_label
        response = run_with_query(query_to_execute)
        response_data = {
            'blood_report_values': values,
            'predicted_label': predicted_label,
            'condition_analysis': response
        }

        return jsonify(response_data), 200

    return jsonify({'error': 'An error occurred'}), 400
@app.route('/kidney', methods=['POST'])
def kidney():
    if 'file' not in request.files:
        return "No file part", 400
    
    file = request.files['file']
    
    if file.filename == '':
        return "No selected file", 400
    
    if file:
        text = extract_text_from_pdf(file)
        features, feature_values = preprocess_and_extract_features_kidney(text)
        
        if None in feature_values:
            return "Not a valid kidney test report. Some values are missing."
        
        prediction = kidney_model.predict(features)
        condition = kidney_label_encoder.inverse_transform(prediction)[0]
        if condition=="Normal":
                condition="No kidney disease"
        query_to_execute = condition
        response=run_with_query(query_to_execute)
        
        response_text = """
        <p>Color: {}</p>
        <p>Appearance: {}</p>
       <p> Specific Gravity: {}</p>
        <p>pH: {}</p>
        <p>WBCs: {}</p>
        <p>Protein: {}</p>
        <p>Blood: {}</p>
        <p>Predicted Kidney Condition: {}</p>
        <p>{}</p>
        """.format(*feature_values, condition, response)
        
        return response_text, 200
    
    return "An error occurred", 400
@app.route('/general_checkup', methods=['GET', 'POST'])
def general_checkup():
    if request.method == 'POST':
        try:
            data = request.json
            required_fields = ['height', 'weight', 'bp_systolic', 'bp_diastolic', 'pulse_rate', 'temperature']
            for field in required_fields:
                if field not in data or not data[field]:
                    return jsonify({"error": f"Missing or empty '{field}' field in request data"}), 400

            height = float(data['height'])
            weight = float(data['weight'])
            bp_systolic = float(data['bp_systolic'])
            bp_diastolic = float(data['bp_diastolic'])
            pulse_rate = float(data['pulse_rate'])
            temperature = float(data['temperature'])

            def calculate_bmi(height, weight):

                bmi = weight / (height ** 2)
                if bmi < 23:
                    weight_status = 'Underweight'
                elif 23 <= bmi < 30:
                    weight_status = 'Normal'
                else:
                    weight_status = 'Overweight/Obese'
                return bmi, weight_status

            def pulserate(rate):
                if rate > 70:
                    pulse_rate_status = "High"
                else:
                    pulse_rate_status = "Normal"
                return pulse_rate_status

            def body_temp(temp):
                if temp < 95:
                    temp_status = "Hypothermia(Low fever)"
                elif temp < 99.6:
                    temp_status = "No Fever"

                elif 99.6 <= temp <= 100.3:
                    temp_status = "Mild Fever"
                elif 100.4 <= temp <= 102.2:
                    temp_status = "Moderate Fever"
                elif temp > 102.2:
                    temp_status = "High Fever"
                return temp_status

            # Calculate BMI
            bmi, weight_status = calculate_bmi(height, weight)

            # Use the trained BP model to predict the BP category
            bp_category = bp_model.predict([[bp_systolic, bp_diastolic]])[0]

            # Check if the pulse rate is within the specified range for elderly people

            heartbeat = pulserate(pulse_rate)
            body_temperature = body_temp(temperature)

            response_data = {
                "bmi": bmi,
                "weight_status": weight_status,
                "blood_pressure_category": bp_category,
                "pulse_rate_status": heartbeat,
                "body_temperature_status": body_temperature,
               
            }

            # Return the JSON response
            return jsonify(response_data), 200

        except ValueError as e:
            # Handle errors and return JSON response
            return jsonify({"error": str(e)}), 400
        
# Cache and server check functions
CACHE_FILE = 'response_cache.json'
response_cache = {}

def check_server():
    try:
        response = requests.get('http://localhost:11434')
        if response.status_code == 200:
            return True
    except requests.exceptions.ConnectionError:
        return False

def load_cache():
    global response_cache
    try:
        with open(CACHE_FILE, 'r') as file:
            response_cache = json.load(file)
        print("Cache loaded successfully.")
    except FileNotFoundError:
        print("Cache file not found. Starting with an empty cache.")
    except json.JSONDecodeError:
        print("Cache file is corrupted. Starting with an empty cache.")
        response_cache = {}

def save_cache():
    with open(CACHE_FILE, 'w') as file:
        json.dump(response_cache, file)
    print("Cache saved successfully.")

async def invoke_model(query):
    global response_cache
    
    if query in response_cache:
        print("Fetching response from cache for query:", query)
        start_time = time.time()
        response = response_cache[query]
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Time taken to fetch from cache: {elapsed_time:.2f} seconds")
    else:
        print("Sending query to model for query:", query)
        llm = Ollama(model="gemma2")
        response = await asyncio.to_thread(llm.invoke, query)
        response_cache[query] = response
        save_cache()
           
    return response

def run_with_query(query):
    load_cache()
    return asyncio.run(invoke_model(query))

# Endpoint for handling queries
@app.route('/query', methods=['POST'])
def handle_query():
    data = request.json
    query = data.get('query')
    if query:
        response = run_with_query(query)
        return jsonify({'response': response}), 200
    return jsonify({'error': 'Query parameter is missing'}), 400

if __name__ == '__main__':
    app.run(debug=True)