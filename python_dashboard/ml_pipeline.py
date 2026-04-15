import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

def train_model():
    print("Loading CWRU unsupervised dataset...")
    # Read the dataset
    cwru_data_path = '../cwru_unsupervised_features.csv'
    if not os.path.exists(cwru_data_path):
        cwru_data_path = 'cwru_unsupervised_features.csv'
        
    df = pd.read_csv(cwru_data_path)
    
    # Extract needed features and rename to match dashboard nomenclature
    df_features = df[['rms', 'kurtosis']].copy()
    df_features = df_features.rename(columns={'rms': 'vibration_rms'})
    
    # We will also add dummy temperature and load to the sample data so the dashboard UI gauges don't break
    # However, the Isolation Forest will ONLY be trained on vibration_rms and kurtosis 
    # to purely reflect the real data distributions.
    
    X_train = df_features[['vibration_rms', 'kurtosis']]
    
    print("Training Isolation Forest Model (Unsupervised)...")
    model = IsolationForest(
        n_estimators=100, 
        max_samples='auto', 
        contamination=0.1, # Assuming 10% anomalies in the dataset generally
        random_state=42
    )
    
    model.fit(X_train)
    
    # Predict to see how many anomalies we caught in the training set
    predictions = model.predict(X_train)
    num_anomalies = np.sum(predictions == -1)
    print(f"Model identified {num_anomalies} anomalies out of {len(X_train)} samples during training.")
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/rf_model.joblib')  # Keeping filename rf_model to avoid breaking Streamlit imports, though it's IF
    print("Model saved to models/rf_model.joblib")
    
    # Save a sample of data for the Streamlit dashboard simulation
    # Adding synthetic temp and load just for the UI
    df_features['temperature'] = np.random.normal(45, 5, len(df_features))
    df_features['load'] = np.random.uniform(50, 80, len(df_features))
    df_features.to_csv('models/sample_data.csv', index=False)

if __name__ == "__main__":
    train_model()
