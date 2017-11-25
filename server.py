from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/new-post', methods = ['POST'])
def newPost():
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()

    author = request.form['author']
    title = request.form['title']
    body = request.form['body']
    likes = 0
    id = request.form['id']

    try:
        cursor.execute('INSERT INTO posts(author, title, body, likes, id) VALUES (?, ?, ?, ?, ?)', (author, title, body, likes, id))
        connection.commit()
        message = 'successfully added'
    except Exception as err:
        print(err)
        connection.rollback()
        message = 'an error occured'
    finally:
        connection.close()
        return message

@app.route('/posts')
def getPosts():
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM posts')
    postsList = cursor.fetchall()
    connection.close()
    return jsonify(postsList)

@app.route('/like', methods = ['POST'])
def likePost():
    post_id = request.get_json()['postId']
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute('UPDATE posts SET likes=likes + 1 WHERE id=?', (post_id))
    connection.commit()
    cursor.execute('SELECT likes FROM posts WHERE id = ?', (post_id))
    current_like_count = cursor.fetchone()[0];
    connection.close()
    return jsonify(likeCount=current_like_count)

app.run(debug = True)
