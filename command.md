# Run Leukemia Detection Project in VS Code Integrated Terminal

## Prerequisites
- Open VS Code in the project root: `c:/Users/danish/OneDrive/Desktop/Leukemia_Detection-main/Leukemia_Detection-main`.
- Open the integrated terminal: Ctrl+` (backtick) or View > Terminal.
- Use the terminal (default cmd.exe). If using PowerShell terminal, switch via terminal dropdown.
- Ensure Python, pip, Node.js, npm are installed.

## Line-by-Line Setup and Run (Backend First, Then Frontend)
Run these commands one by one in the VS Code integrated terminal (using PowerShell). Start a new terminal tab for each major step if needed (click + in terminal panel).

### 1. Setup Backend (Create venv if missing, install deps)
```
cd api; python -m venv venv; venv\Scripts\activate.bat; pip install -r requirements.txt
```
- Note: If venv already exists and deps are installed, this will show "Requirement already satisfied".

### 2. Start Backend Server (Keep this terminal open)
```
cd api; venv\Scripts\activate.bat; python main.py
```
- Note: If model path error occurs, ensure api/main.py has MODEL = tf.saved_model.load('../models/1') (relative to api folder).
- Output: Server starts on http://localhost:8000. Model loads from ../models/1.
- Test ping: Open browser to http://localhost:8000/ping (should show "Hello, I am alive").

### 3. Install Frontend Dependencies (if not done)
```
cd frontend; npm install --legacy-peer-deps
```
- Note: Use --legacy-peer-deps to resolve peer dependency conflicts.

### 4. Start Frontend (New terminal tab: Click + in terminal panel)
```
cd frontend; $env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
```
- Output: React app starts on http://localhost:3000. Browser opens automatically.
- Keep this terminal open.

### 4. Test API Prediction
- In browser: Go to http://localhost:3000.
- Upload an image (e.g., blood cell JPG from Training folder).
- It should predict (class like 'Benign', confidence score) via backend /predict endpoint—no errors.

## Stop the Project
- Ctrl+C in backend terminal to stop server.
- Ctrl+C in frontend terminal to stop app.

## Troubleshooting
- **Venv activation fails in cmd**: Use `venv\Scripts\activate.bat`. In PowerShell: `venv\Scripts\Activate.ps1` (may need `Set-ExecutionPolicy RemoteSigned`).
- **Prediction error**: Ensure backend runs first and ping works. Check console for errors (e.g., model path).
- **Port busy**: Kill processes: `netstat -ano | findstr :8000` then `taskkill /PID <pid> /F`.
- **Deps fail**: Update pip: `python -m pip install --upgrade pip`.

Use these steps every time to run line by line in VS Code—no external shells needed!
