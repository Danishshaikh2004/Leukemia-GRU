1. First these commads
 cd api; venv\Scripts\Activate.ps1; pip install -r requirements.txt; python main.py;

2. Second Commands
cd frontend; 
$env:NODE_OPTIONS="--openssl-legacy-provider"; 
npm start
