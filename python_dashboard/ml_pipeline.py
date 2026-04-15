import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# Create dummy operational data mimicking CWRU bearing dataset and industrial sensor readings
def generate_synthetic_data(num_samples=5000):
    np.random.seed(42)
    
    # Healthy Data
    healthy = pd.DataFrame({
        'vibration_rms': np.random.normal(0.12, 0.02, num_samples),
        'kurtosis': np.random.normal(3.1, 0.1, num_samples),
        'temperature': np.random.normal(45, 2, num_samples),
        'load': np.random.uniform(50, 80, num_samples),
        'fault_type': 'Normal'
    })
    
    # Inner Race Fault
    inner = pd.DataFrame({
        'vibration_rms': np.random.normal(0.68, 0.08, num_samples),
        'kurtosis': np.random.normal(7.2, 0.5, num_samples),
        'temperature': np.random.normal(60, 3, num_samples),
        'load': np.random.uniform(70, 95, num_samples),
        'fault_type': 'Inner Race'
    })
    
    # Outer Race Fault
    outer = pd.DataFrame({
        'vibration_rms': np.random.normal(0.52, 0.05, num_samples),
        'kurtosis': np.random.normal(5.8, 0.4, num_samples),
        'temperature': np.random.normal(55, 2.5, num_samples),
        'load': np.random.uniform(60, 90, num_samples),
        'fault_type': 'Outer Race'
    })
    
    # Ball Fault
    ball = pd.DataFrame({
        'vibration_rms': np.random.normal(0.41, 0.06, num_samples),
        'kurtosis': np.random.normal(6.1, 0.45, num_samples),
        'temperature': np.random.normal(58, 3.5, num_samples),
        'load': np.random.uniform(65, 85, num_samples),
        'fault_type': 'Ball Fault'
    })
    
    df = pd.concat([healthy, inner, outer, ball], ignore_index=True)
    return df

def train_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data(num_samples=2500)
    
    X = df[['vibration_rms', 'kurtosis', 'temperature', 'load']]
    y = df['fault_type']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc * 100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/rf_model.joblib')
    print("Model saved to models/rf_model.joblib")
    
    # Save a sample of data for the Streamlit dashboard simulation
    df.to_csv('models/sample_data.csv', index=False)

if __name__ == "__main__":
    train_model()
