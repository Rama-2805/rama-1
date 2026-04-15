import streamlit as st
import pandas as pd
import numpy as np
import joblib
import time
import plotly.express as px
import plotly.graph_objects as go
import os

st.set_page_config(page_title="Predictive Maintenance Dashboard", page_icon="🏭", layout="wide")

# Custom dark theme aesthetics
st.markdown("""
<style>
    .stApp {
        background-color: #0f1420;
        color: #e2e8f0;
    }
    .metric-card {
        background: rgba(15, 20, 35, 0.7);
        border: 1px solid rgba(56, 72, 104, 0.3);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
    }
    .status-normal { color: #10b981; font-weight: bold; }
    .status-warning { color: #f59e0b; font-weight: bold; }
    .status-critical { color: #ef4444; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

st.title("🏭 Real-Time Predictive Maintenance Simulation")
st.markdown("Monitor industrial machines and predict failures using a Random Forest model.")

# Load model and sample data
@st.cache_resource
def load_model():
    model_path = 'models/rf_model.joblib'
    if os.path.exists(model_path):
        return joblib.load(model_path)
    return None

@st.cache_data
def load_sample_data():
    data_path = 'models/sample_data.csv'
    if os.path.exists(data_path):
        return pd.read_csv(data_path).drop(columns=['fault_type'])
    return pd.DataFrame()

model = load_model()
sample_data = load_sample_data()

if model is None:
    st.warning("Model not found. Please run `python ml_pipeline.py` first to train the model.", icon="⚠️")
    st.stop()

# Dashboard controls
col1, col2 = st.columns([1, 3])
with col1:
    st.markdown("### Simulation Controls")
    machine_id = st.selectbox("Select Machine", ["Motor-A1 (Extruder)", "Pump-B2 (Cooling)", "Comp-C1 (HVAC)"])
    fault_injection = st.selectbox("Inject Fault Scenario (Simulation)", ["Normal Operation", "Inject Inner Race Fault", "Inject Outer Race Fault", "Inject Ball Fault"])
    simulation_speed = st.slider("Simulation Speed (ms)", min_value=100, max_value=2000, value=800, step=100)
    run_simulation = st.checkbox("▶ Start Live Simulation")

# Placeholders for real-time visualization
header_col1, header_col2, header_col3, header_col4 = st.columns(4)
vib_metric = header_col1.empty()
temp_metric = header_col2.empty()
kurt_metric = header_col3.empty()
pred_metric = header_col4.empty()

st.markdown("### Live Telemetry Stream")
chart_placeholder = st.empty()

# Initialization for simulation state
if "history" not in st.session_state:
    st.session_state.history = pd.DataFrame(columns=['Time', 'Vibration (RMS)', 'Temperature', 'Kurtosis', 'Prediction'])

if "time_step" not in st.session_state:
    st.session_state.time_step = 0

def generate_live_point(scenario):
    # Base normal
    v_mean, v_std = 0.12, 0.02
    k_mean, k_std = 3.1, 0.1
    t_mean, t_std = 45, 1.5
    l_mean = 65
    
    if scenario == "Inject Inner Race Fault":
        v_mean, k_mean, t_mean = 0.68, 7.2, 60
    elif scenario == "Inject Outer Race Fault":
        v_mean, k_mean, t_mean = 0.52, 5.8, 55
    elif scenario == "Inject Ball Fault":
        v_mean, k_mean, t_mean = 0.41, 6.1, 58
        
    point = {
        'vibration_rms': max(0.01, np.random.normal(v_mean, v_std)),
        'kurtosis': max(1.0, np.random.normal(k_mean, k_std)),
        'temperature': max(20, np.random.normal(t_mean, t_std)),
        'load': np.random.normal(l_mean, 5.0)
    }
    return pd.DataFrame([point])

# Simulation Loop
if run_simulation:
    while run_simulation:
        # Generate new point based on selected scenario
        new_point = generate_live_point(fault_injection)
        
        # Predict
        prediction = model.predict(new_point)[0]
        
        # Record history
        new_row = {
            'Time': pd.Timestamp.now().strftime('%H:%M:%S'),
            'Vibration (RMS)': new_point['vibration_rms'].values[0],
            'Temperature': new_point['temperature'].values[0],
            'Kurtosis': new_point['kurtosis'].values[0],
            'Prediction': prediction
        }
        st.session_state.history.loc[len(st.session_state.history)] = new_row
        
        # Keep only last 50 points
        if len(st.session_state.history) > 50:
            st.session_state.history = st.session_state.history.iloc[-50:]
        
        df_hist = st.session_state.history
        
        # Update Metrics
        status_color = "status-normal" if prediction == "Normal" else "status-critical"
        
        vib_metric.markdown(f'<div class="metric-card"><b>Vibration (RMS)</b><br><h2 style="color:#06b6d4">{new_row["Vibration (RMS)"]:.3f} g</h2></div>', unsafe_allow_html=True)
        temp_metric.markdown(f'<div class="metric-card"><b>Temperature</b><br><h2 style="color:#f97316">{new_row["Temperature"]:.1f} °C</h2></div>', unsafe_allow_html=True)
        kurt_metric.markdown(f'<div class="metric-card"><b>Kurtosis</b><br><h2 style="color:#8b5cf6">{new_row["Kurtosis"]:.2f}</h2></div>', unsafe_allow_html=True)
        pred_metric.markdown(f'<div class="metric-card"><b>AI Diagnosis</b><br><h2 class="{status_color}">{prediction}</h2></div>', unsafe_allow_html=True)
        
        # Update Charts
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df_hist['Time'], y=df_hist['Vibration (RMS)'], mode='lines+markers', name='Vibration', line=dict(color='#06b6d4', width=2)))
        fig.update_layout(
            template="plotly_dark",
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            margin=dict(l=20, r=20, t=30, b=20),
            title="Real-Time Vibration Trend",
            xaxis=dict(showticklabels=False),
            yaxis=dict(range=[0, 1.0])
        )
        
        chart_placeholder.plotly_chart(fig, use_container_width=True)
        
        time.sleep(simulation_speed / 1000.0)
else:
    st.info("ℹ️ Select '**Start Live Simulation**' in the sidebar to begin receiving telemetry.")
    if not st.session_state.history.empty:
        st.dataframe(st.session_state.history.tail(10), use_container_width=True)
