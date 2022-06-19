from flask import Flask, request,jsonify
from flask_cors import CORS, cross_origin
from sklearn.preprocessing import StandardScaler
import pickle
import pandas as pd

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/home")
def home():
    return "Flask API get endpoint running"


@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    Scaler = StandardScaler()
    #df = pd.read_csv('att_raw2.csv')
   # df = df.to_numpy()
   # Scaler.fit(df)
    lr = pickle.load(open('FModel.sav',"rb"))# Load "model.pkl"
    if lr:
        try:
            json_ = request.json
            query = pd.DataFrame(json_)
            query = query.to_numpy()
            Scaler.fit(query)
            query = Scaler.transform(query)
            predictions = list(lr.predict(query))
            return jsonify({'Predictions': str(predictions)})
            
        except:

            return jsonify({'trace': 'Error'})
    else:
        print('Train the model First')
        return ('No model here to use')

if __name__ == '__main__':
    app.debug= True
    app.run()