from flask import Flask, render_template, request, redirect, url_for
import json
import surveyFilesProcess as sfp

# initialize Flask app
app = Flask(__name__)

# survey files
sourcePath = 'survey.json'
targetPath = 'surveys_answers.json'

# read survey.json and obtain given surveys
surveys = sfp.parse_survey(sourcePath)

# define routing
@app.route('/', methods = ['GET'])
def main():
    return "Main page! Go to the desired survey by addind /id={desired id} to the URL"

@app.route('/id=<idx>', methods = ['GET', 'POST'])
def get_survey(idx):
    if request.method == 'GET':
        if idx not in surveys.keys():
            return "Данный опрос не существует!"
        return render_template('index.html', survey = surveys[idx])
    else:
        sfp.save_answers_file(targetPath, request.json)
        return redirect(url_for('answer'))

@app.route('/answer', methods=["GET"])
def answer():
    new_answers = sfp.parse_answers(targetPath)
    return new_answers

# start app
if __name__ == '__main__':
    app.run(debug = True)
