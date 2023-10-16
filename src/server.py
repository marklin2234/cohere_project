from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import cohere

app = Flask(__name__)

API_KEY = '0R0GpKWYjaWulTrHEf48MCAkB59AYjZLdHczD21g'
co = cohere.Client(API_KEY)

@app.route('/', methods=['GET'])
def handle_landing_page():
    return "Hello there! I am alive"

@app.route('/get', methods=['GET'])
def handle_get_request():
    # Retrieve query parameters
    link = request.args.get('link')
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }

    response = requests.get(link, headers=headers)
    soup = BeautifulSoup(response.text,'lxml')
    readable_text = soup.body.get_text(' ', strip=True)

    summary = co.summarize(
        text=readable_text
    )

    payload = jsonify({'summary': summary})
    payload.headers.add('Access-Control-Allow-Origin', '*')
    return payload

if __name__ == '__main__':
    app.run()