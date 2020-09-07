import json

# function to load surveys from input file
def parse_survey(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    key = list(data.keys())[0]
    surveys_list = data[key]
    surveys = dict()
    for elem in surveys_list:
        surveys[elem['id']] = json.dumps(elem).replace("'", '"')
        # surveys[elem['id']] = elem
    return surveys

# function to normalize and update file with answers to surveys
def save_answers_file(path, newData):
    with open(path, 'r', encoding="utf-8") as f:
        data = json.load(f)
    recent_answers = data['surveys']

    data = newData
    new_answers = dict()
    new_answers['user'] = data['user']
    new_answers['items'] = data['items']
    new_surveyID = data['surveyId']

    target_answers_total = []
    survey_ids = [elem['surveyId'] for elem in recent_answers]

    for idx in survey_ids:
        elem = list(filter(lambda x: x['surveyId'] == idx, recent_answers))[0]
        if idx == new_surveyID:
            answers_for_current_survey = elem['answers']
            target_answers = []
            for item in answers_for_current_survey:
                if item['user'] == new_answers['user']:
                    target_answers.append(new_answers)
                else:
                    target_answers.append(item)
            if new_answers['user'] not in set(map(lambda x: x['user'], target_answers)):        
                target_answers.append(new_answers)
            target_answers_total.append({
                'surveyId': idx,
                'answers': target_answers
            })
        else:
            target_answers_total.append({
                'surveyId': idx,
                'answers': elem['answers']
            })
        
    with open(path, 'w', encoding="utf-8") as f2:
        json.dump({'surveys': target_answers_total}, f2, indent=4)

def parse_answers(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data
