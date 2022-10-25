from flask import Flask,render_template,request,jsonify
import pickle
import joblib
from PIL import Image
import numpy as np
model = pickle.load(open("model.pkl", "rb"))
app=Flask(__name__)

@app.route('/',methods=['GET'])
def Hi():
    return render_template('index.html')

@app.route('/',methods=['POST'])
def Render():
    image=request.files['imageFile']
    path="./images/" + image.filename
    image.save(path)
    img_pil = Image.open(path).convert('L')
    img_28x28 = np.array(img_pil.resize((28, 28), Image.Resampling.LANCZOS))
    img_array = (img_28x28.flatten())
    img_array  = img_array.reshape(-1,1).T
    print(np.array(img_array[0]))
    ans=model.predict(np.array(img_array))
    print(int(ans[0]))
    return jsonify(int(ans[0]))
    # return render_template('index.html')

# @app.route('/predict',methods=['POST'])
# def Predict():
#     image=request.files['imageFile']
#     path="./images/" + image.filename
#     image.save(path)
#     img_pil = Image.open(path).convert('L')
#     img_28x28 = np.array(img_pil.resize((28, 28), Image.Resampling.LANCZOS))
#     img_array = (img_28x28.flatten())
#     img_array  = img_array.reshape(-1,1).T
#     ans=modl.predict(np.array(img_array))
#     return jsonify(int(ans[0]))

if __name__ == '__main__':
    app.run(debug=True)
