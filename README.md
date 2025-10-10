1. First these commads setup backend
cd api; python -m venv venv; venv\Scripts\activate.bat; pip install -r requirements.txt

2. second start backend server in api terminal
venv\Scripts\activate.bat; python main.py

3. Start frontend in frontend terminal
cd frontend; $env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
