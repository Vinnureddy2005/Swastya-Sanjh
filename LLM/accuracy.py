# Import necessary libraries
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder

# Load datasets
diabetes_data = pd.read_csv('./datasets/diabetes.csv')
blood_data = pd.read_csv("./datasets/blood_report.csv")

# Prepare features and target variable for blood report dataset
X_blood = blood_data[['HAEMOGLOBIN', 'TOTAL_RBC_COUNT', 'WBC_TOTAL', 'PLATELETS_COUNT', 
                      'Neutrophils', 'Lymphocytes', 'Eosinophils', 'Monocytes', 'Basophils']]
y_blood = blood_data['Conditions']

# Encode target variable
blood_label_encoder = LabelEncoder()
y_blood_encoded = blood_label_encoder.fit_transform(y_blood)

# Initialize and train Random Forest classifier
blood_model = RandomForestClassifier(n_estimators=100, random_state=42)
blood_model.fit(X_blood, y_blood_encoded)

# Make predictions on the blood report data
y_blood_pred = blood_model.predict(X_blood)

# Calculate accuracy and other metrics
accuracy = accuracy_score(y_blood_encoded, y_blood_pred)
precision = precision_score(y_blood_encoded, y_blood_pred, average='weighted')
recall = recall_score(y_blood_encoded, y_blood_pred, average='weighted')
f1 = f1_score(y_blood_encoded, y_blood_pred, average='weighted')


print(f"Model Accuracy: {accuracy * 100:.2f}%")
print(f"Precision: {precision * 100:.2f}%")
print(f"Recall: {recall * 100:.2f}%")
print(f"F1 Score: {f1 * 100:.2f}%")



