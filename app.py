from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def starter():
    return render_template('starter.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/index.html')
def index_page():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)