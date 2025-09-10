from flask import Flask, render_template, request, jsonify
import requests
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key = 'supersecretkey'


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(50))
    score = db.Column(db.Integer)
    date = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return render_template('index.html')  # Serve the main page


@app.route("/solar_system")
def solar_system():
    return render_template("solar-system.html")


@app.route("/planets")
def planets():
    planets = [
        {'name': 'Mercury', 'image': 'mercury.png'},
        {'name': 'Venus', 'image': 'venus.png'},
        {'name': 'Earth', 'image': 'earth.png'},
        {'name': 'Mars', 'image': 'mars.png'},
        {'name': 'Jupiter', 'image': 'jupiter.png'},
        {'name': 'Saturn', 'image': 'saturn.png'},
        {'name': 'Uranus', 'image': 'uranus.png'},
        {'name': 'Neptune', 'image': 'neptune.png'},
        {'name': 'Moon', 'image': 'moon.png'}
    ]
    sun = {'name': 'Sun', 'image': 'sun.png'}
    return render_template("planets-view.html", planets=planets, sun=sun)


@app.route('/planet/<planet_name>')
def planet_detail(planet_name):
    return render_template(f"{planet_name}.html")


@app.route("/comets")
def comets():
    api_link = 'https://data.nasa.gov/resource/b67r-rgxc.json'
    try:
        response = requests.get(api_link)
        # Check if the request was successful
        if response.status_code == 200:
            comets = response.json()  # Parse JSON data
        else:
            comets = []
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        comets = []
    return render_template("comets.html", comets=comets)


@app.route('/asteroids')
def asteroids():
    api_key = 'mZcFWe62XX3f8H4UaPiaDxtWQrRRpvAEtwG0ndaS'
    page = request.args.get('page', 0, type=int)  # Get current page from query parameter
    limit = 50  # Set the number of asteroids per page
    response = requests.get(f'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={api_key}&page={page}&size={limit}')
    asteroids_data = response.json().get('near_earth_objects', [])

    # Determine the total number of pages
    total_count = response.json().get('element_count', 0)
    total_pages = (total_count // limit) + (1 if total_count % limit > 0 else 0)

    return render_template('asteroids.html', asteroids=asteroids_data, page=page, total_pages=total_pages)


@app.route('/hazardous-asteroids')
def hasteroids():
    api_key = 'mZcFWe62XX3f8H4UaPiaDxtWQrRRpvAEtwG0ndaS'
    page = request.args.get('page', 0, type=int)  # Get current page from query parameter
    limit = 50  # Set the number of asteroids per page
    response = requests.get(f'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={api_key}&page={page}&size={limit}')
    asteroids_data = response.json().get('near_earth_objects', [])

    # Determine the total number of pages
    total_count = response.json().get('element_count', 0)
    total_pages = (total_count // limit) + (1 if total_count % limit > 0 else 0)

    return render_template('hasteroids.html', asteroids=asteroids_data, page=page, total_pages=total_pages)


@app.route('/asteroid/<asteroid_id>')
def asteroid_detail(asteroid_id):
    api_key = 'mZcFWe62XX3f8H4UaPiaDxtWQrRRpvAEtwG0ndaS'
    response = requests.get(f'https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}?api_key={api_key}')
    asteroid_data = response.json()
    return render_template('asteroids_details.html', asteroid=asteroid_data)


# Route for the main game page
@app.route('/game')
def game():
    return render_template('game.html')


# Route to submit score at the end of a game
@app.route('/submit-score', methods=['POST'])
def submit_score():
    data = request.json
    player_name = data.get('player_name')
    score = data.get('score')
    new_score = Score(player_name=player_name, score=score)
    db.session.add(new_score)
    db.session.commit()
    return jsonify({"message": "Score submitted successfully!"}), 201

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    # Retrieve top scores from the database (modify this based on your database setup)
    top_scores = db.session.query(Score).order_by(Score.score.desc()).limit(10).all()
    leaderboard_data = [{"name": score.player_name, "score": score.score} for score in top_scores]
    return jsonify(leaderboard_data=leaderboard_data)



# API endpoint for fetching leaderboard data as JSON
@app.route('/leaderboard-data')
def leaderboard_data():
    top_scores = Score.query.order_by(Score.score.desc()).limit(10).all()
    scores_data = [{"player_name": s.player_name, "score": s.score} for s in top_scores]
    return jsonify(scores_data)

def load_questions():
    with open("data/questions.json") as f:
        return json.load(f)

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

# @app.route('/submit_answer', methods=['POST'])
# def submit_answer():
#     return redirect(url_for('result', score=score))

@app.route('/result/<int:score>')
def result(score):
    return render_template('result.html', score=score)


if __name__ == '__main__':
    app.run(debug=True)
