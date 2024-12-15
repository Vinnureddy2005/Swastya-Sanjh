import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

# # Load the diabetes data
diabetes_data = pd.read_csv("./datasets/diabetes.csv")
# Define features and target variable
X_diabetes = diabetes_data[['fasting_plasma_glucose', 'post_lunch_plasma_glucose']]
y_diabetes = diabetes_data['label']
# Label encoding
all_possible_diabetes_labels = ['Normal', 'Pre-Diabetes', 'Diabetes']
diabetes_label_encoder = LabelEncoder()
diabetes_label_encoder.fit(all_possible_diabetes_labels)
# Transform target variable
Y_encoded = diabetes_label_encoder.transform(y_diabetes)
# Train-test split (optional but recommended)
X_train, X_test, Y_train, Y_test = train_test_split(X_diabetes, Y_encoded, test_size=0.2, random_state=42)
# Train the Random Forest Classifier model
diabetes_model = RandomForestClassifier(n_estimators=100, random_state=42)
diabetes_model.fit(X_diabetes, diabetes_label_encoder.transform(y_diabetes))
# Save the model and the label encoder
joblib.dump(diabetes_model, 'diabetes_model.pkl')
joblib.dump(diabetes_label_encoder, 'diabetes_label_encoder.pkl')

#Load the thyroid dataset
thyroid_data = pd.read_csv("./datasets/thyroid999.csv")
# Define features and target variable
X_thyroid = thyroid_data[['TSH (μIU/mL)', 'T3 (ng/mL)', 'T4 (μg/dL)']]
Y_thyroid = thyroid_data['Result']
# Label encoding
all_possible_thyroid_labels = ['Hypothyroidism', 'Normal', 'Hyperthyroidism']
thyroid_label_encoder = LabelEncoder()
thyroid_label_encoder.fit(all_possible_thyroid_labels)
# Transform target variable
Y_encoded = thyroid_label_encoder.transform(Y_thyroid)
# Train-test split (optional but recommended)
X_train, X_test, Y_train, Y_test = train_test_split(X_thyroid, Y_encoded, test_size=0.2, random_state=42)
# Train the Random Forest Classifier
thyroid_model = RandomForestClassifier(n_estimators=100, random_state=42)
thyroid_model.fit(X_thyroid, Y_encoded)
# Save the model and the label encoder
joblib.dump(thyroid_model, 'thyroid_model_rf.pkl')
joblib.dump(thyroid_label_encoder, 'thyroid_label_encoder_rf.pkl')

# Load the blood report dataset and prepare the model
blood_data = pd.read_csv("./datasets/blood_report.csv")
# Define features and target variable
X_blood = blood_data[['HAEMOGLOBIN', 'TOTAL_RBC_COUNT', 'WBC_TOTAL', 'PLATELETS_COUNT', 'Neutrophils', 'Lymphocytes', 'Eosinophils', 'Monocytes', 'Basophils']]
y_blood = blood_data['Conditions']
# Label encoding
blood_label_encoder = LabelEncoder()
y_blood_encoded = blood_label_encoder.fit_transform(y_blood)
# Train-test split (optional but recommended)
X_train, X_test, Y_train, Y_test = train_test_split(X_blood, y_blood, test_size=0.2, random_state=42)
# Train the Random Forest Classifier model
blood_model = RandomForestClassifier(n_estimators=100, random_state=42)
blood_model.fit(X_blood, y_blood_encoded)
# Save the model and the label encoder
joblib.dump(blood_model, 'blood_model.pkl')
joblib.dump(blood_label_encoder, 'blood_label_encoder.pkl')

# Load the anemia dataset
anemia_data = pd.read_csv("./datasets/anemia.csv")
# Define features and target variable
X_anemia = anemia_data[['Serum Iron (mcg/dL)', 'TIBC (mcg/dL)', 'Transferrin Saturation (%)']]
y_anemia = anemia_data['Result']
# Label encoding
all_possible_anemia_labels =['Anemia','No Anemia']
anemia_label_encoder = LabelEncoder()
anemia_label_encoder.fit(all_possible_anemia_labels)
#Transform target variable
y_anemia_encoded = anemia_label_encoder.fit_transform(y_anemia)
# Train-test split (optional but recommended)
X_train_anemia, X_test_anemia, Y_train_anemia, Y_test_anemia = train_test_split(X_anemia, y_anemia_encoded, test_size=0.2, random_state=42)
# Train the Random Forest Classifier model
anemia_model = RandomForestClassifier(n_estimators=100, random_state=42)
anemia_model.fit(X_train_anemia, Y_train_anemia)
# Save the model and the label encoder
joblib.dump(anemia_model, 'anemia_model.pkl')
joblib.dump(anemia_label_encoder, 'anemia_label_encoder.pkl')


urine_data = pd.read_csv("./datasets/urine_test_combinations.csv")

# Define features and target variable
X_urine = urine_data[['Color', 'Appearance', 'Blood', 'Protein', 'Specific Gravity', 'pH', 'WBCs/pus cells', 'Protein (mg/dL)']]
y_urine = urine_data['Report Result']

# Convert categorical features to numerical
X_urine = pd.get_dummies(X_urine, columns=['Color', 'Appearance', 'Blood', 'Protein', 'WBCs/pus cells'])

# Label encoding for the target variable
urine_label_encoder = LabelEncoder()
y_urine_encoded = urine_label_encoder.fit_transform(y_urine)

# Train-test split (optional but recommended)
X_train_urine, X_test_urine, Y_train_urine, Y_test_urine = train_test_split(X_urine, y_urine_encoded, test_size=0.2, random_state=42)

# Train the Random Forest Classifier model
urine_model = RandomForestClassifier(n_estimators=100, random_state=42)
urine_model.fit(X_train_urine, Y_train_urine)

# Save the model and the label encoder
joblib.dump(urine_model, 'urine_model.pkl')
joblib.dump(urine_label_encoder, 'urine_label_encoder.pkl')