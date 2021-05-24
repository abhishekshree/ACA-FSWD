import os
from flask import Flask, request, jsonify, make_response

app = Flask(__name__)

tokens = []
user_data = {}

help_info = '''
<pre>
This application has following endpoints:
/           -->   Returns information about different endpoints
/get_token  -->   A GET request at this endpoint return a token. Return format:
                  {
                      "token" : "<generated token value>"
                  }
/register   -->   A POST request at this endpoint saves user data. The request data should be in following format:
                  {
                      "username" : "<username of the user being registered>",
                      "data" : "<data to be saved>",
                      "token" : "<token value generated earlier>"
                  }
                  This endpoint does not return any data on successful completion.
/get_data   -->   A POST request at this endpoint return user data corresponding to a token. The request format is:
                  {
                      "token" : "<token value>"
                  }
                  On successful completion, the return data is in following format:
                  {
                      "username" : "<username of the registered user>"
                      "data" : "<data of the user>"
                  }

On succcessful completion, the response code is set to be 200.
For /register and /get_data endpoints, if there is some error(i.e. response code is not 200) then the format of return data is:
                   {
                       "error" : "<error description>"
                   }
</pre>
'''


def add_header(inp):
    resp = make_response(inp)
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp


@app.route("/")
def index():
    return add_header(help_info), 200


@app.route("/get_token", methods=['GET'])
def generate_token():
    global tokens
    token = os.urandom(8).hex()
    tokens.append(token)
    return add_header(jsonify(token=token)), 200


@app.route("/register", methods=['POST', 'OPTIONS'])
def save_data():
    global user_data
    if request.method == 'OPTIONS':
        resp = make_response()
        resp.headers['Access-Control-Allow-Origin'] = "*"
        resp.headers['Access-Control-Allow-Methods'] = "POST, OPTIONS"
        resp.headers['Access-Control-Allow-Headers'] = "*"
        return resp, 204

    if request.content_type != 'application/json':
        return add_header(jsonify(error="json format required")), 400
    json_data = request.json
    if "token" not in json_data:
        return add_header(jsonify(error="token value missing")), 400
    if "username" not in json_data:
        return add_header(jsonify(error="username field missing")), 400
    if "data" not in json_data:
        return add_header(jsonify(error="data field missing")), 400
    if not json_data["token"] in tokens:
        return add_header(jsonify(error="invalid token value")), 404
    if json_data["token"] in user_data.keys():
        return add_header(jsonify(error="a user already registered for this token value")), 400
    user_data[json_data["token"]] = {
        "username": json_data["username"], "data": json_data["data"]}
    return add_header("User added successfully"), 200


@app.route("/get_data", methods=['POST', 'OPTIONS'])
def send_data():
    if request.method == 'OPTIONS':
        resp = make_response()
        resp.headers['Access-Control-Allow-Origin'] = "*"
        resp.headers['Access-Control-Allow-Methods'] = "POST, OPTIONS"
        resp.headers['Access-Control-Allow-Headers'] = "*"
        return resp, 204

    if request.content_type != 'application/json':
        return add_header(jsonify(error="json format required")), 400
    json_data = request.json
    if "token" not in json_data:
        return add_header(jsonify(error="token value missing")), 400
    if not json_data["token"] in tokens:
        return add_header(jsonify(error="invalid token")), 404
    if not json_data["token"] in user_data.keys():
        return add_header(jsonify(error="no user registered with this token")), 404
    return add_header(jsonify(**user_data[json_data["token"]])), 200


if __name__ == "__main__":
    app.run(debug=True, port=12345)
