from flask import Flask, request, redirect, url_for,jsonify
import re
import pdfplumber
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Load the blood report dataset and prepare the model
blood_data = pd.read_csv("./datasets/blood_report.csv")
X_blood = blood_data[['HAEMOGLOBIN', 'TOTAL_RBC_COUNT', 'WBC_TOTAL', 'PLATELETS_COUNT', 'Neutrophils', 'Lymphocytes', 'Eosinophils', 'Monocytes', 'Basophils']]
y_blood = blood_data['Conditions']
blood_label_encoder = LabelEncoder()
y_blood_encoded = blood_label_encoder.fit_transform(y_blood)
blood_model = RandomForestClassifier(n_estimators=100, random_state=42)
blood_model.fit(X_blood, y_blood_encoded)

# Load the anemia dataset and prepare the model
anemia_data = pd.read_csv("./datasets/anemia.csv")
X_anemia = anemia_data[['Serum Iron (mcg/dL)', 'TIBC (mcg/dL)', 'Transferrin Saturation (%)']]
y_anemia = anemia_data['Result']
anemia_label_encoder = LabelEncoder()
y_anemia_encoded = anemia_label_encoder.fit_transform(y_anemia)
anemia_model = LogisticRegression(max_iter=1000)
anemia_model.fit(X_anemia, y_anemia_encoded)

# Load the diabetes dataset and prepare the model
diabetes_data = pd.read_csv("./datasets/diabetes.csv")
diabetes_data['fasting_plasma_glucose'] = diabetes_data['fasting_plasma_glucose'].round()
diabetes_data['post_lunch_plasma_glucose'] = diabetes_data['post_lunch_plasma_glucose'].round()
X_diabetes = diabetes_data[['fasting_plasma_glucose', 'post_lunch_plasma_glucose']]
y_diabetes = diabetes_data['label']
all_possible_labels = ['Normal', 'Pre-Diabetes', 'Diabetes']
diabetes_label_encoder = LabelEncoder()
diabetes_label_encoder.fit(all_possible_labels)
diabetes_model = LogisticRegression(max_iter=1000)
diabetes_model.fit(X_diabetes, diabetes_label_encoder.transform(y_diabetes))

# Load the bp dataset and prepare the model
bp_data=pd.read_csv("./datasets/blood_pressure_data.csv")
X_bp = bp_data[['systolic_bp', 'diastolic_bp']]  # Features
y_bp = bp_data['bp_category']  # Labels
X_train_bp, X_test_bp, y_train_bp, y_test_bp = train_test_split(X_bp, y_bp, test_size=0.2, random_state=42)
bp_model = LogisticRegression(max_iter=1000)
bp_model.fit(X_train_bp, y_train_bp)

# Load the thyroid dataset and prepare the model


thyroid_data = pd.read_csv("./datasets/thyroid999.csv")
imputer = SimpleImputer(strategy='mean')
X_thyroid = thyroid_data[['TSH (μIU/mL)', 'T3 (ng/mL)', 'T4 (μg/dL)']]
X_thyroid = imputer.fit_transform(X_thyroid)
y_thyroid = thyroid_data['Result']
thyroid_label_encoder = LabelEncoder()
y_thyroid_encoded = thyroid_label_encoder.fit_transform(y_thyroid)
thyroid_model = LogisticRegression(max_iter=1000)
thyroid_model.fit(X_thyroid, y_thyroid_encoded)


# Preprocess and load the kidney condition dataset and prepare the model

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


# Common function to extract text from PDF using pdfplumber
def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    return text

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
        # 'Monocytes': re.compile(r'MONOCYTES\s*[:\-]?\s*(\d+(\.\d+)?)\s*%', re.IGNORECASE),
        'Monocytes': re.compile(r'MONOCYTES\s*[:\-]?\s*(\d+(\.\d+)?)\s*', re.IGNORECASE),

        'Basophils': re.compile(r'BASOPHILS\s*[:\-]?\s*(\d+(\.\d+)?)\s*%', re.IGNORECASE)
    }

    features = []
    missing_values = []

    for key, pattern in patterns.items():
        match = pattern.search(text)
        value = None
        if match:
            value = round(float(match.group(1).replace(',', '')), 2)
        else:
            missing_values.append(key)
        features.append(value)
    
    return [features], features, missing_values

condition_analysis = {
    'Anemia': (
"""Anemia refers to a condition where your body lacks enough healthy red blood cells to carry adequate oxygen to your tissues. 
Patients with this condition may feel very tired and weak. To manage anemia, it is important to follow a few guidelines:
- Diet: Include iron-rich foods such as leafy green vegetables, beans, and red meat. Foods high in vitamin C can help with iron absorption.
- Supplements: Your doctor might recommend iron supplements or other vitamins and minerals.
- Lifestyle:Ensure you get enough rest and avoid strenuous activities if you feel fatigued."""
),
'Infection': (
"""An infection refers to the invasion and multiplication of harmful microorganisms like bacteria, viruses, or fungi in the body.\nPatients with infections often experience symptoms like fever, pain, and fatigue. To combat infections, consider the following:\n- Medical Treatment: Depending on the type of infection, antibiotics, antivirals, or antifungal medications may be necessary.\n- Hydration: Drink plenty of fluids to help your body fight off the infection.\n- Rest: Ensure you get adequate rest to support your immune system in fighting the infection."""
),
'Hematologic_Disorders': (
"""\nHematologic disorders refer to diseases that affect your blood or bone marrow, such as leukemia or lymphoma.\nManaging these conditions often involves specific medical treatments. Here’s what you might need to do:\n- Medical Care:Treatments may include chemotherapy, radiation, or bone marrow transplants depending on the disorder.\n- Follow-up: Regular follow-ups with your hematologist are crucial for monitoring your condition.\n- Diet: Eating a balanced diet rich in fruits, vegetables, and protein can support overall health."""
),
'Thrombocytopenia': (
"""Thrombocytopenia refers to a condition where you have a low platelet count, which can lead to excessive bruising and bleeding. \nPatients with this condition should be cautious and take the following steps:\n- Avoid Injuries: Be careful to avoid cuts and bruises as your blood may not clot properly.\n- Medical Advice: Your doctor may prescribe medications to increase platelet count or treat the underlying cause.\n- Diet: Include foods that promote platelet production such as leafy greens and citrus fruits."""
),
'Thrombocytosis' :(
"""Thrombocytosis refers to a condition where your body produces too many platelets, which can increase the risk of blood clots. \nTo manage this condition, follow these guidelines:\n- Medical Treatment: Medications may be prescribed to lower platelet counts and prevent clotting.\n- Regular Monitoring: Regular blood tests are essential to monitor platelet levels and adjust treatment as needed.\n- Healthy Lifestyle: Maintain a balanced diet, exercise regularly, and avoid smoking to reduce clot risks."""
),
'Polycythemia' : (
"""Polycythemia refers to a condition where there are too many red blood cells in your body, making your blood thicker.\nPatients with polycythemia should consider the following management strategies:\n- Medical Procedures: Sometimes blood removal (phlebotomy) is required to reduce red blood cell levels.\n- Medication: Doctors may prescribe medication to reduce blood cell production.\n- Hydration: Drink plenty of fluids to help keep your blood from becoming too thick."""
),
'Dehydration': (
"""Dehydration occurs when your body loses more fluids than it takes in, leading to insufficient water for normal body functions.\nTo prevent and manage dehydration, follow these tips:\n- Fluid Intake: Drink plenty of water throughout the day, especially in hot weather or during exercise.\n- Electrolytes: Consider drinks with electrolytes if you’re sweating a lot or recovering from illness.\n- Diet: Eat water-rich foods like fruits and vegetables to help maintain hydration levels."""
),
'Bone_Marrow_Disorders': (
"""\nBone marrow disorders affect the production of blood cells and can lead to various blood conditions.\nManaging these disorders involves a combination of treatments and lifestyle adjustments:\n- Medical Treatment: This may include medications, bone marrow transplants, or other therapies depending on the specific disorder.\n- Regular Monitoring: Frequent check-ups with your healthcare provider are essential to monitor blood cell levels.\n- Healthy Diet: Ensure a nutritious diet to support your overall health and treatment."""
),
'Immunodeficiency':  (
"""\nImmunodeficiency refers to a weakened immune system, making you more susceptible to infections.\nTo manage this condition, consider the following steps:\n- Avoid Infections: Practice good hygiene and avoid contact with sick individuals.\n- Vaccinations: Stay up to date with vaccinations as recommended by your healthcare provider.\n- Healthy Lifestyle: Maintain a balanced diet, exercise regularly, and get enough sleep to support your immune system."""
)
}

# Function to preprocess and extract features for anemia
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

# Function to preprocess and extract features for diabetes
def preprocess_and_extract_features_diabetes(text):
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

    fasting_plasma_glucose = diabetes_data['fasting_plasma_glucose'].iloc[(diabetes_data['fasting_plasma_glucose'] - fasting_plasma_glucose).abs().argsort()[:1]].values[0]
    post_lunch_plasma_glucose = diabetes_data['post_lunch_plasma_glucose'].iloc[(diabetes_data['post_lunch_plasma_glucose'] - post_lunch_plasma_glucose).abs().argsort()[:1]].values[0]

    return [[fasting_plasma_glucose, post_lunch_plasma_glucose]], fasting_plasma_glucose, post_lunch_plasma_glucose


# Function to find matching row for anemia
def find_matching_row_anemia(features):
    matching_row = anemia_data[
        (anemia_data['Serum Iron (mcg/dL)'] == features[0][0]) &
        (anemia_data['TIBC (mcg/dL)'] == features[0][1]) &
        (anemia_data['Transferrin Saturation (%)'] == features[0][2])
    ]
    return matching_row.index.tolist()

# Function to find matching row for diabetes
def find_matching_row_diabetes(features):
    matching_row = diabetes_data[
        (diabetes_data['fasting_plasma_glucose'] == features[0][0]) &
        (diabetes_data['post_lunch_plasma_glucose'] == features[0][1])
    ]
    return matching_row.index.tolist()

# Function to preprocess and extract features for thyroid

def preprocess_and_extract_features_thyroid(text):
    t3_pattern = re.compile(r'T3[^0-9]*([0-9.]+)\s*(ng/mL|ngmL|ng/dL)', re.IGNORECASE)
    t4_pattern = re.compile(r't4\s*total\s*:?\s*([\d.]+)\s*µg/dl', re.IGNORECASE)
    tsh_pattern = re.compile(r'tsh\s*-\s*ultrasensitive\s*:?\s*([\d.]+)\s*µiu/ml', re.IGNORECASE)

    t3_match = t3_pattern.search(text)
    t4_match = t4_pattern.search(text)
    tsh_match = tsh_pattern.search(text)


    t3 = round(float(t3_match.group(1)), 1) if t3_match else None
    t4 = round(float(t4_match.group(1)), 1) if t4_match else None
    tsh = round(float(tsh_match.group(1)), 1) if tsh_match else None

    return [[t3, t4, tsh]], t3, t4, tsh, t3_match, t4_match, tsh_match

def find_matching_row_thyroid(features):
    matching_rows = thyroid_data[
        (thyroid_data['TSH (μIU/mL)'].round(1) == round(features[0][2], 1)) &
        (thyroid_data['T3 (ng/mL)'].round(1) == round(features[0][0], 1)) &
        (thyroid_data['T4 (μg/dL)'].round(1) == round(features[0][1], 1))
    ]
    
    

    return matching_rows.index.tolist()


# Function to preprocess and extract features for kidney disease


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
        print(f"Color: {color}")
    else:
        color = None
        print("No match found for Color")

    appearance_pattern = re.compile(r'Appearance\s+\w+\s+(\w+)', re.IGNORECASE)
    appearance_match = appearance_pattern.search(text)
    if appearance_match:
        appearance = appearance_match.group(1)
        print(f"Appearance: {appearance}")
        
    else:
        appearance = None
        print("No match found for Appearance")

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





# Home route
@app.route('/')
def home():
    return '''
    <form action="/select_report" method="post">
        <label for="report_type">Choose a report type:</label>
        <select id="report_type" name="report_type">
            <option value="blood">Blood Report</option>
            <option value="anemia">Anemia Report</option>
            <option value="thyroid">Thyroid Report</option>
            <option value="diabetes">Diabetes Report</option>
            <option value="general_checkup">General Check Up</option>
            <option value="kidney">Kidney</option>

        </select>
        <input type="submit" value="Submit">
    </form>
    '''

# Route to handle report type selection and redirect to appropriate route
@app.route('/select_report', methods=['POST'])
def select_report():
    report_type = request.form.get('report_type')
    if report_type == 'blood':
        return redirect(url_for('blood'))
    elif report_type == 'anemia':
        return redirect(url_for('anemia'))
    elif report_type == 'thyroid':
        return redirect(url_for('thyroid'))
    elif report_type == 'diabetes':
        return redirect(url_for('diabetes'))
    elif report_type == 'general_checkup':
        return redirect(url_for('general_checkup'))
    elif report_type == 'kidney':
        return redirect(url_for('kidney'))
    else:
        return redirect(url_for('home'))




# Route for blood report processing
@app.route('/blood', methods=['GET', 'POST'])
def blood():
    if request.method == 'POST':
        if 'pdf' not in request.files:
            print("No file part in the request")  # Debugging statement
            return "No file part", 400

        file = request.files['pdf']
        if file.filename == '':
            print("No selected file")  # Debugging statement
            return "No selected file", 400

        if file:
            text = extract_text_from_pdf(file)
            print("Extracted text from PDF:")  # Debugging statement
            print(text)  # Debugging statement

            features, feature_values, missing_values = preprocess_and_extract_features_blood(text)
            print("Extracted features:")  # Debugging statement
            print(features)  # Debugging statement
            print("Feature values:")  # Debugging statement
            print(feature_values)  # Debugging statement
            print("Missing values:")  # Debugging statement
            print(missing_values)  # Debugging statement

            if missing_values:
                return jsonify({"error": f"Not a valid blood report. The following values are missing: {', '.join(missing_values)}."}), 400

            prediction = blood_model.predict(features)
            conditions = blood_label_encoder.inverse_transform(prediction)
            print("Predicted conditions:")  # Debugging statement
            print(conditions)  # Debugging statement

            


            response_data = {
                "HAEMOGLOBIN": feature_values[0],
                "TOTAL_RBC_COUNT": feature_values[1],
                "WBC_TOTAL": feature_values[2],
                "PLATELETS_COUNT": feature_values[3],
                "Neutrophils": feature_values[4],
                "Lymphocytes": feature_values[5],
                "Eosinophils": feature_values[6],
                "Monocytes": feature_values[7],
                "Basophils": feature_values[8],
                "result": ', '.join(conditions),
                "conditionAnalysis": {}
            }

            # Add condition analysis for each detected condition
            for condition in conditions[0].split(','):
                condition = condition.strip()
                print(f"Condition: {condition}")  # Debugging statement
                if condition in condition_analysis:
                    response_data["conditionAnalysis"][condition] = condition_analysis[condition]

            print("Final response data:")  # Debugging statement
            print(response_data)  # Debugging statement

            return jsonify(response_data)

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new PDF File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=pdf>
      <input type=submit value=Upload>
    </form>
    '''

#Route for anemia report processing
@app.route('/anemia', methods=['POST'])
def anemia():
    if 'file' not in request.files:
        return {"error": "No file part"}, 400

    file = request.files['file']

    if file.filename == '':
        return {"error": "No selected file"}, 400

    text = extract_text_from_pdf(file)
    preprocessed_text = text.lower()
    features, serum_iron, tibc, transferrin_saturation = preprocess_and_extract_features_anemia(preprocessed_text)

    if not serum_iron or not tibc or not transferrin_saturation:
        return {"result": "Not an Anemia Report"}, 200

    matching_indices = find_matching_row_anemia(features)

    if not matching_indices:
        return {"result": "No matching rows found."}, 200

    actual_label = anemia_data.iloc[matching_indices[0]]['Result']
    condition_analysis = ""
    if actual_label == 'Anemia':
        condition_analysis = """
        Anemia: Anemia occurs when your body lacks enough healthy red blood cells to carry adequate oxygen to your body's tissues. This can lead to symptoms such as fatigue, weakness, pale skin, irregular heartbeat, and shortness of breath.Management: To prevent and manage anemia, consider the following tips:- Iron-Rich Diet: Include iron-rich foods such as leafy greens, red meat, poultry, seafood, beans, and fortified cereals in your diet.- Vitamin C: Consume foods high in vitamin C to enhance iron absorption, such as citrus fruits, strawberries, and bell peppers.- Avoidance: Limit intake of tea or coffee with meals as they can inhibit iron absorption.Note: Please monitor the patient's iron levels regularly. Take doctor's advice to intake iron supplements if necessary.
        """
    elif actual_label == 'No Anemia':
        condition_analysis = """
        Anemia Not Detected: The report indicates that there is no evidence of anemia in the patient.General Health Tips: While anemia is not present, it's still essential to maintain overall health by following a balanced diet, staying hydrated, and getting regular exercise.Consult with a healthcare professional for personalized advice and to address any other health concerns.
        """

    result = {
        "serumIron": serum_iron,
        "tibc": tibc,
        "transferrinSaturation": transferrin_saturation,
        "result": actual_label,
        "conditionAnalysis": condition_analysis
    }

    return jsonify(result), 200

# Route for diabetes report processing
@app.route('/diabetes', methods=['GET', 'POST'])

def diabetes():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    if file:
        # Your diabetes report processing logic goes here
        text = extract_text_from_pdf(file)
        preprocessed_text = text.lower()
        diabetes_keywords = ['diabetes', 'insulin', 'glucose', 'blood sugar', 'hyperglycemia', 'hypoglycemia']
        diabetes_related = any(keyword in preprocessed_text for keyword in diabetes_keywords)
        if not diabetes_related:
            return "This is not a diabetes report."
        features, fasting_glucose, post_lunch_glucose = preprocess_and_extract_features_diabetes(preprocessed_text)
        if fasting_glucose is None or post_lunch_glucose is None:
            return "Not a diabetes report. Glucose values not found in the document."
        matching_indices = find_matching_row_diabetes(features)
        if not matching_indices:
            return "No matching rows found."
        actual_label = diabetes_data.iloc[matching_indices[0]]['label']

        condition_analysis = "Condition Analysis: "
        if actual_label == 'Normal':
            condition_analysis += """
Diabetes Status:The report indicates that there is no evidence of diabetes or pre-diabetes in the patient.
General Health Tips:While diabetes is not detected, it's still important to maintain a healthy lifestyle by eating well, staying active, and managing stress."""
        elif actual_label == 'Pre-Diabetes':
            condition_analysis += """
Pre-Diabetes: Pre-diabetes is a condition where blood sugar levels are higher than normal but not high enough to be diagnosed as diabetes. Without intervention, pre-diabetes can lead to type 2 diabetes.Management:To prevent the progression to diabetes, consider the following:Healthy Lifestyle: Adopt healthy habits such as eating a balanced diet, exercising regularly, and maintaining a healthy weight.Blood Sugar Monitoring: Monitor your blood sugar levels regularly and work with your healthcare provider to develop amanagement plan.  With early intervention and lifestyle changes, it's possible to prevent or delay the onset of type 2 diabetes.
"""
        elif actual_label == 'Diabetes':
            condition_analysis += """
Diabetes: Diabetes is a chronic condition that affects how your body metabolizes glucose (sugar), leading to symptoms such as increased thirst, 
frequent urination, hunger, fatigue, and blurred vision.
Management:To effectively manage diabetes, consider the following:
Healthy Eating:Follow a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats.
Regular Exercise: Engage in regular physical activity to help control blood sugar levels and improve overall health.
Blood Sugar Monitoring: Monitor your blood sugar levels regularly and keep track of your results.
Medications: Take prescribed medications or insulin injections as directed by your healthcare provider.
It's essential to attend regular check-ups with your healthcare team for proper management and to reduce the risk of complications associated
swith diabetes.
"""

        response_text = '''
        <p>Fasting Plasma Glucose: {}</p>
        <p>Post-Lunch Plasma Glucose: {}</p>
        <p>Report Result: {}</p>
        <p>Condition Analysis:{}</p>
        '''.format(fasting_glucose, post_lunch_glucose, actual_label, condition_analysis)
        return response_text

    return "An error occurred", 400

# Route for general checkup
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
# Route for  thyroid

@app.route('/thyroid', methods=['GET', 'POST'])
def thyroid():
    home_button = '<a href="/">Back to Home</a>'
    back = '<a href="/thyroid">Back</a>'
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part", 400

        file = request.files['file']
        if file.filename == '':
            return "No selected file", 400
        if file:
            text = extract_text_from_pdf(file)
            print(text)  # Print extracted text for debugging
            preprocessed_text = text.lower()
            print(preprocessed_text)  # Print preprocessed text for debugging

            features, tsh, t3, t4, t3_match, t4_match, tsh_match = preprocess_and_extract_features_thyroid(preprocessed_text)

            thyroid_keywords = ['t3', 't4', 'tsh']
            thyroid_related = any(keyword in preprocessed_text for keyword in thyroid_keywords)
            if not thyroid_related:
                return "Not a Thyroid Report"

            missing_values = []
            if t3 is None:
                missing_values.append('T3')
            if t4 is None:
                missing_values.append('T4')
            if tsh is None:
                missing_values.append('TSH')
            if missing_values:
                return f"Thyroid report values not found or incomplete: Missing {', '.join(missing_values)}."

            matching_indices = find_matching_row_thyroid(features)
            if not matching_indices:
                return "No matching rows found."
            actual_label = thyroid_data.iloc[matching_indices[0]]['Result']
            condition_analysis = ""
        
        if actual_label == "Normal":
            condition_analysis = """
Condition:  Normal thyroid hormone production and function.Diet:Fruits and Vegetables: Variety and colorful.Whole Grains: Brown rice, quinoa.Hydration: Drink plenty of water.Lifestyle:Physical Activity: Regular exercise.
Social Engagement: Participate in group activities.
"""
        elif actual_label == "Hyperthyroidism":
            condition_analysis = """Condition: Overactive thyroid resulting in excessive thyroid hormone production.Diet:Limit Iodine: Reduce seafood, iodized salt.Antioxidants: Berries, leafy greens.Balanced Diet: Adequate protein, fats, carbs.Lifestyle:Exercise: Low-impact like walking or tai chi.Stress Management: Meditation, gentle yoga.
"""
        elif actual_label == "Hypothyroidism":
            condition_analysis = """
Underactive thyroid resulting in insufficient thyroid hormone production.Diet:- Iodine-Rich Foods: Dairy, seafood, iodized salt.- Selenium: Brazil nuts, sunflower seeds.- Zinc: Lean meats, legumes.- Limit Goitrogens: Reduce soya, cruciferous vegetables.Lifestyle- Exercise: Moderate activity like walking or swimming.- Stress Management: Meditation, yoga.
"""
       

            # Print extracted values
            print("Extracted Values:")
            print(f"T3: {t3}")
            print(f"T4: {t4}")
            print(f"TSH: {tsh}")
            print(f"Report Result: {actual_label}")
            print(f"Analsyis:{condition_analysis}")

            response_text = '''
            <p>T3: {}</p>
            <p>T4: {}</p>
            <p>TSH: {}</p>
            <p>Report Result: {}</p>
            <p>Condition Analysis: {}</p>

            '''.format(t3, t4, tsh, actual_label,condition_analysis , back)
            return response_text,200
    return "An error occurred", 400

# Route for kidney disease
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
        
        condition_analysis = ""
        
        if condition == "Normal":
            condition_analysis = """
            Kidney Condition is normal.Dietary Recommendation:Adhering to these dietary recommendations can help older adults maintain their health, prevent chronic diseases, and improve their quality of life. Always consult with a healthcare provider or a registered dietitian before making significant changes to your diet.1. Emphasize Fruits and Vegetables2. Choose Whole Grains3. Adequate HydrationLifestyle:Physical Activity: Combine diet with regular physical activity, such as walking, swimming, or yoga, to maintain muscle mass, balance, and overall health.Social Engagement: Participate in social activities and group meals to enhance mental well-being.
            """
        elif condition == "Possible Infection":
            condition_analysis = """
            There is a possible chance that your kidney might be having an infection.Dietary Recommendation:Focus on a diet rich in fluids (water, herbal teas) to stay hydrated and flush out bacteria. Include foods low in sodium and potassium, such as berries, apples, and bell peppers, to reduce kidney strain. Avoid high-protein and high-phosphorus foods, like red meat and dairy, to minimize kidney workload.Ensure plenty of rest and consult a healthcare provider for appropriate antibiotics and further guidance.Note: Please visit your doctor to get it checked.
            """
        elif condition == "Possible UTI":
            condition_analysis = """
There is a possibility that the patient is suffering from Urinary Tract Infection (UTI).UTI:A urinary tract infection (UTI) is an infection in any part of the urinary system, which includes the kidneys, ureters, bladderand urethra. Most infections involve the lower urinary tract—the bladder and the urethra.Diet and Lifestyle:For older patients with a possible UTI, increase fluid intake (water,berry juices) to flush out bacteria.Include probiotics like yogurt to promote healthy gut and prevent infections. Avoid caffeine,alcohol and spicy foods.Practice good hygiene and ensure regular urination to prevent bacterial growth.Consult a healthcare provider for appropriatetreatment and management.
"""
        elif condition == "Severe Infection":
            condition_analysis = """
            There seems to be a severe infection in the patient's kidney and excretory system.Diet and Lifestyle:For an older patient with a severe kidney infection, focus on staying hydrated by drinking plenty of water, while adhering to a low-sodium and low-protein diet to reduce kidney strain. Opt for low-potassium and low-phosphorus foods like apples, berries, and rice. Maintain good personal hygiene to prevent further infections and ensure ample rest.Regular medical checkups and strict adherence to prescribed medications are crucial for effective treatment and recovery. Avoid irritants such as caffeine, alcohol, and spicy foods.
            """
        elif condition == "Hematuria, Proteinuria":
            condition_analysis = """
            From your reports, it looks like you have Hematuria and Proteinuria.Hematuria: The presence of blood in the urine.Proteinuria: High levels of protein in your urine.Dietary Recommendations:1. Low Sodium: Reduce salt intake to manage blood pressure and fluid balance.2. Moderate Protein: Avoid excessive protein intake to lessen the workload on the kidneys.3. Limit Phosphorus: If there's evidence of kidney damage, limit phosphorus intake to protect bone health.4. Plenty of Fluids: Ensure adequate hydration unless contraindicated by specific medical conditions.Lifestyle Recommendations:Regular Exercise: Encourage moderate physical activity to support overall health and manage blood pressure.Quit Smoking: If the patient smokes, encourage cessation to reduce cardiovascular risk.Monitor Blood Pressure: Regular monitoring and management of blood pressure are crucial.Medication Adherence: Ensure compliance with any prescribed medications to manage underlying conditions.
            """
        
        response_text = """
        <p>Color: {}</p>
        <p>Appearance: {}</p>
       <p> Specific Gravity: {}</p>
        <p>pH: {}</p>
        <p>WBCs: {}</p>
        <p>Protein: {}</p>
        <p>Blood: {}</p>
        <p>Predicted Kidney Condition: {}</p>
        <p>Condition Analysis: {}</p>
        """.format(*feature_values, condition, condition_analysis)
        
        return response_text, 200
    
    return "An error occurred", 400

if __name__ == '__main__':
    app.run(debug=True)



