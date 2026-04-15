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
st.markdown("Monitor industrial machines and predict failures using an Isolation Forest model.")

# Load model and sample data
@st.cache_resource
def load_model():
    model_path = 'models/rf_model.joblib'
    if os.path.exists(model_path):
        return joblib.load(model_path)
    return None

@st.cache_data
def load_nasa_data():
    paths = ['../datasets/nasa_test4_features.csv', 'datasets/nasa_test4_features.csv', '../nasa_test4_features.csv', 'nasa_test4_features.csv']
    for p in paths:
        if os.path.exists(p):
            return pd.read_csv(p)
    return None

@st.cache_data
def load_metrics():
    if os.path.exists('models/model_metrics.csv'):
        return pd.read_csv('models/model_metrics.csv')
    return None

@st.cache_data
def load_predictions():
    if os.path.exists('models/model_predictions.csv'):
        return pd.read_csv('models/model_predictions.csv')
    return None

model = load_model()
nasa_data = load_nasa_data()
df_metrics = load_metrics()
df_preds = load_predictions()

if model is None:
    st.warning("Model not found. Please run `python ml_pipeline.py` first to train the model.", icon="⚠️")
    st.stop()

tab_live, tab_eval = st.tabs(["🔴 Live Telemetry Dashboard", "📊 ML & DL Model Evaluation"])

with tab_live:
    # Dashboard controls
    col1, col2 = st.columns([1, 3])
    with col1:
        st.markdown("### Simulation Controls")
        machine_id = st.selectbox("Select Machine", ["Motor-A1 (Extruder)", "Pump-B2 (Cooling)", "Comp-C1 (HVAC)"])
        fault_injection = st.selectbox("Inject Fault Scenario (Simulation)", [
            "Normal Operation", 
            "Inject Inner Race Fault", 
            "Inject Outer Race Fault", 
            "Inject Ball Fault",
            "Stream NASA Run-To-Failure Data (Live)"
        ])
        simulation_speed = st.slider("Simulation Speed (ms)", min_value=100, max_value=2000, value=800, step=100)
        run_simulation = st.checkbox("▶ Start Live Simulation")

    # Placeholders for real-time visualization
    header_col1, header_col2, header_col3, header_col4 = st.columns(4)
    vib_metric = header_col1.empty()
    max_vib_metric = header_col2.empty()
    temp_metric = header_col3.empty()
    pred_metric = header_col4.empty()

    st.markdown("### Live Telemetry Stream")
    chart_placeholder = st.empty()

    # Initialization for simulation state
    if "history" not in st.session_state:
        st.session_state.history = pd.DataFrame(columns=['Time', 'Vibration (RMS)', 'Max Vibration', 'Temperature', 'Prediction'])

    if "time_step" not in st.session_state:
        st.session_state.time_step = 0

    def generate_live_point(scenario, time_step=None, nasa_df=None):
        if scenario == "Stream NASA Run-To-Failure Data (Live)" and nasa_df is not None:
            idx = time_step % len(nasa_df)
            row = nasa_df.iloc[idx]
            return pd.DataFrame([{
                'max_vibration': row['max_vibration_b1'],
                'vibration_rms': row['rms_vibration_b1'],
                'temperature': max(20, np.random.normal(45, 1.5)), 
                'load': np.random.normal(65, 5.0) 
            }])

        # Base normal
        v_mean, v_std = 0.12, 0.02
        m_mean, m_std = 0.25, 0.05
        t_mean, t_std = 45, 1.5
        l_mean = 65
        
        if scenario == "Inject Inner Race Fault":
            v_mean, m_mean, t_mean = 0.68, 1.2, 60
        elif scenario == "Inject Outer Race Fault":
            v_mean, m_mean, t_mean = 0.52, 0.9, 55
        elif scenario == "Inject Ball Fault":
            v_mean, m_mean, t_mean = 0.41, 0.7, 58
            
        point = {
            'max_vibration': max(0.02, np.random.normal(m_mean, m_std)),
            'vibration_rms': max(0.01, np.random.normal(v_mean, v_std)),
            'temperature': max(20, np.random.normal(t_mean, t_std)),
            'load': np.random.normal(l_mean, 5.0)
        }
        return pd.DataFrame([point])

    # Simulation Loop
    if run_simulation:
        while run_simulation:
            # Generate new point
            new_point = generate_live_point(fault_injection, st.session_state.time_step, nasa_data)
            st.session_state.time_step += 1
            
            # Predict using Isolation Forest
            prediction_val = model.predict(new_point[['max_vibration', 'vibration_rms']])[0]
            prediction_str = "Normal" if prediction_val == 1 else "Anomaly Detected"
            
            # Record history
            new_row = {
                'Time': pd.Timestamp.now().strftime('%H:%M:%S'),
                'Vibration (RMS)': new_point['vibration_rms'].values[0],
                'Max Vibration': new_point['max_vibration'].values[0],
                'Temperature': new_point['temperature'].values[0],
                'Prediction': prediction_str
            }
            st.session_state.history.loc[len(st.session_state.history)] = new_row
            
            if len(st.session_state.history) > 50:
                st.session_state.history = st.session_state.history.iloc[-50:]
            
            df_hist = st.session_state.history
            
            status_color = "status-normal" if prediction_str == "Normal" else "status-critical"
            
            vib_metric.markdown(f'<div class="metric-card"><b>Vibration (RMS)</b><br><h2 style="color:#06b6d4">{new_row["Vibration (RMS)"]:.3f} g</h2></div>', unsafe_allow_html=True)
            max_vib_metric.markdown(f'<div class="metric-card"><b>Max Vibration</b><br><h2 style="color:#8b5cf6">{new_row["Max Vibration"]:.3f} g</h2></div>', unsafe_allow_html=True)
            temp_metric.markdown(f'<div class="metric-card"><b>Temperature</b><br><h2 style="color:#f97316">{new_row["Temperature"]:.1f} °C</h2></div>', unsafe_allow_html=True)
            pred_metric.markdown(f'<div class="metric-card"><b>AI Diagnosis</b><br><h2 class="{status_color}">{prediction_str}</h2></div>', unsafe_allow_html=True)
            
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=df_hist['Time'], y=df_hist['Vibration (RMS)'], mode='lines+markers', name='RMS', line=dict(color='#06b6d4', width=2)))
            fig.add_trace(go.Scatter(x=df_hist['Time'], y=df_hist['Max Vibration'], mode='lines+markers', name='Max', line=dict(color='#8b5cf6', width=2)))
            fig.update_layout(
                template="plotly_dark",
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                margin=dict(l=20, r=20, t=30, b=20),
                title="Real-Time Vibration Trend",
                xaxis=dict(showticklabels=False),
                yaxis=dict(range=[0, max(1.0, df_hist['Max Vibration'].max() * 1.2)])
            )
            
            chart_placeholder.plotly_chart(fig, use_container_width=True)
            
            time.sleep(simulation_speed / 1000.0)
    else:
        st.info("ℹ️ Select '**Start Live Simulation**' in the sidebar to begin receiving telemetry.")
        if not st.session_state.history.empty:
            st.dataframe(st.session_state.history.tail(10), use_container_width=True)

with tab_eval:
    st.markdown("### Machine Learning & Deep Learning Performance Assessment")
    st.markdown("Comparative analysis of 4 ML models and 2 DL models predicting `RMS Vibration` from `Max Vibration` on continuous `nasa_test2_features` dataset.")
    
    if df_metrics is not None and df_preds is not None:
        col_m1, col_m2 = st.columns(2)
        
        with col_m1:
            st.markdown("#### Evaluation Metrics")
            st.dataframe(df_metrics.style.format({
                'MSE': '{:.5f}',
                'MAE': '{:.5f}',
                'R2': '{:.4f}',
                'MAPE (%)': '{:.2f}%',
                'Accuracy (%)': '{:.2f}%'
            }), use_container_width=True)
            
            fig_bar = px.bar(df_metrics, x='Model', y=['Accuracy (%)', 'R2'], barmode='group', 
                             title="Model Performance Comparison",
                             color_discrete_sequence=['#10b981', '#3b82f6'])
            fig_bar.update_layout(template="plotly_dark", paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
            st.plotly_chart(fig_bar, use_container_width=True)
            
        with col_m2:
            st.markdown("#### Continuous Data Predictions (vs Actual)")
            
            # Select model to view
            model_to_view = st.selectbox("Select Model for Detailed Prediction View", df_metrics['Model'].tolist())
            
            fig_pred = go.Figure()
            # Plot only 200 points for clearer visualization
            view_subset = df_preds.head(200)
            
            fig_pred.add_trace(go.Scatter(y=view_subset['Actual RMS'], mode='lines', name='Actual RMS', line=dict(color='white', width=2)))
            fig_pred.add_trace(go.Scatter(y=view_subset[model_to_view], mode='lines', name=f'Predicted ({model_to_view})', line=dict(color='#f43f5e', dash='dot')))
            
            fig_pred.update_layout(
                template="plotly_dark",
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                title=f"Sample Prediction Alignment: {model_to_view}",
                xaxis_title="Time Steps (Continuous)",
                yaxis_title="RMS Vibration"
            )
            st.plotly_chart(fig_pred, use_container_width=True)
            
    else:
        st.warning("Metrics not found. Please ensure `ml_pipeline.py` has completed processing Task 2.")
