from datetime import timedelta
from flask import make_response, request, current_app, Flask, Response, jsonify
from functools import update_wrapper
import os
import MySQLdb
from models import teams, players, coaches, divisions

# To get the sql dump in appropriate format
# mysqldump --databases gamedayballersdb -uroot -p --hex-blob --skip-triggers --set-gtid-purged=OFF --default-character-set=utf8 > ballersexport_v2.sql

app = Flask(__name__)

# Snippet copied from http://flask.pocoo.org/snippets/56/
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

@app.route('/', methods=['GET'])
@crossdomain(origin='*')
def home():
    resp = Response("GamedayBallers API is up and running!")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/search/<keyword>', methods=['GET'])
@crossdomain(origin='*')
def search_db(keyword):
    keyword.replace("_", " ")
    return jsonify({
        "players": players.search_players(keyword),
        "teams": teams.search_teams(keyword),
        "coaches": coaches.search_coaches(keyword),
        "divisions": divisions.search_divisions(keyword)
    })

@app.route('/players/', methods=['GET'])
@crossdomain(origin='*')
def list_players():
    return jsonify(players.list_players())

@app.route('/players_full/', methods=['GET'])
@crossdomain(origin='*')
def list_players_full():
    return jsonify(players.list_players_full())

@app.route('/players/<player_id>', methods=['GET'])
@crossdomain(origin='*')
def get_player_by_id(player_id):
    return jsonify(players.get_player_info(player_id))

@app.route('/coaches/', methods=['GET'])
@crossdomain(origin='*')
def list_coaches():
    return jsonify(coaches.list_coaches())

@app.route('/coaches_full/', methods=['GET'])
@crossdomain(origin='*')
def list_coaches_full():
    return jsonify(coaches.list_coaches_full())

@app.route('/coaches/<coach_id>', methods=['GET'])
@crossdomain(origin='*')
def get_coach_by_id(coach_id):
    return jsonify(coaches.get_coach_info(coach_id))

@app.route('/teams/', methods=['GET'])
@crossdomain(origin='*')
def list_teams():
    return jsonify(teams.list_teams())

@app.route('/teams_full/', methods=['GET'])
@crossdomain(origin='*')
def list_teams_full():
    return jsonify(teams.list_teams_full())

@app.route('/teams/<team_id>', methods=['GET'])
@crossdomain(origin='*')
def get_team_by_id(team_id):
    return jsonify(teams.get_team_info(team_id))

@app.route('/divisions/', methods=['GET'])
@crossdomain(origin='*')
def list_divisions():
    return jsonify(divisions.list_divisions())

@app.route('/divisions_full/', methods=['GET'])
@crossdomain(origin='*')
def list_divisions_full():
    return jsonify(divisions.list_divisions_full())

@app.route('/divisions/<division_id>', methods=['GET'])
@crossdomain(origin='*')
def get_division_by_id(division_id):
    return jsonify(divisions.get_division_info(division_id))

