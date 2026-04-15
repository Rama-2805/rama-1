import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib
import os
import json
import warnings
warnings.filterwarnings('ignore')

def train_model():
    print("Loading training datasets...")
    def get_path(filename):
        paths = [f'../datasets/{filename}', f'datasets/{filename}', f'../{filename}', filename]
        for p in paths:
            if os.path.exists(p): return p
        return filename

    cwru_path = get_path('cwru_unsupervised_features.csv')
    nasa4_path = get_path('nasa_test4_features.csv')
    nasa2_path = get_path('nasa_test2_features.csv')

    df_cwru = pd.read_csv(cwru_path)
    df_nasa4 = pd.read_csv(nasa4_path)
    
    # Train data formulation
    # CWRU features
    df1 = pd.DataFrame({
        'max_vibration': df_cwru['max'],
        'vibration_rms': df_cwru['rms']
    })
    
    # NASA Test 4 features
    df2 = pd.DataFrame({
        'max_vibration': df_nasa4['max_vibration_b1'],
        'vibration_rms': df_nasa4['rms_vibration_b1']
    })
    
    df_train = pd.concat([df1, df2], ignore_index=True)
    X_train_unsupervised = df_train[['max_vibration', 'vibration_rms']]
    
    print("Training Isolation Forest Model (Unsupervised)...")
    model = IsolationForest(
        n_estimators=100, 
        max_samples='auto', 
        contamination=0.1, 
        random_state=42
    )
    model.fit(X_train_unsupervised)
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/rf_model.joblib')
    print("Model saved to models/rf_model.joblib")

    # Supervised Models Task 2
    print("Loading testing dataset...")
    df_test = pd.read_csv(nasa2_path)
    
    # We will predict vibration_rms from max_vibration
    X_train_reg = df_train[['max_vibration']].fillna(0)
    y_train_reg = df_train['vibration_rms'].fillna(0)
    
    X_test = df_test[['max_vibration']].fillna(0)
    y_test = df_test['rms_vibration'].fillna(0)
    
    ml_models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42),
        'SVR': SVR(kernel='rbf'),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=50, random_state=42)
    }
    
    dl_models = {
        'MLP (DNN 1 - Relu)': MLPRegressor(hidden_layer_sizes=(64, 32), activation='relu', max_iter=200, random_state=42),
        'MLP (DNN 2 - Tanh)': MLPRegressor(hidden_layer_sizes=(50, 50), activation='tanh', max_iter=200, random_state=42)
    }
    
    all_models = {**ml_models, **dl_models}
    metrics = []
    predictions_dict = {}
    
    print("Training ML and DL Models...")
    for name, m in all_models.items():
        print(f"Training {name}...")
        m.fit(X_train_reg, y_train_reg)
        y_pred = m.predict(X_test)
        
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        # MAPE
        # Avoiding division by zero by replacing 0 with a small epsilon
        y_test_safe = np.where(y_test == 0, 1e-10, y_test)
        mape = np.mean(np.abs((y_test - y_pred) / y_test_safe)) * 100
        accuracy = max(0, 100 - mape)
        
        metrics.append({
            'Model': name,
            'MSE': mse,
            'MAE': mae,
            'R2': r2,
            'MAPE (%)': mape,
            'Accuracy (%)': accuracy,
            'Type': 'DL' if 'MLP' in name else 'ML'
        })
        
        predictions_dict[name] = y_pred.tolist()
        
    df_metrics = pd.DataFrame(metrics)
    df_metrics.to_csv('models/model_metrics.csv', index=False)
    print("Metrics saved to models/model_metrics.csv")
    
    # Save predictions
    df_preds = pd.DataFrame({'max_vibration': df_test['max_vibration'], 'Actual RMS': y_test})
    for name in predictions_dict:
        df_preds[name] = predictions_dict[name]
    df_preds.to_csv('models/model_predictions.csv', index=False)
    print("Predictions saved to models/model_predictions.csv")

if __name__ == "__main__":
    train_model()
