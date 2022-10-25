import React, {useState, useRef, useMemo,useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Sketchpad, {HardBrush} from 'react-native-sketchpad';
import SplashScreen from 'react-native-splash-screen'
const App = () => {
  const [ans, setAns] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    SplashScreen.hide();
  },[])
  const pad = useRef();
  const saveImage = async base64 => {
    sendImages(base64);
  };
  const onClear = () => {
    setAns(null)
    pad.current?.clear();
  };
  const onSave = () => {
    setLoading(true)
    pad.current?.toDataURL(saveImage);
  };
  const brush = useMemo(() => {
    return new HardBrush('white', 30);
  });
  const sendImages = async image => {
    const url = 'https://webdigit.azurewebsites.net/';
    // const url = 'https://digitrecognitionweb.azurewebsites.net/';
    const files = {
      uri: `data:image/png;base64,${image}`,
      name: 'imageFile',
      type: 'image/png',
    };
    const body = new FormData();
    body.append('imageFile', files);
    fetch(url, {
      method: 'POST',
      body,
    })
      .then(response => response.json()) // returns promise
      .then(responseJson => {
        console.log(responseJson.result);
        setAns(responseJson.result);
        setLoading(false)
      });
  };
  return (
    <View style={styles.main}>
      <View style={styles.header}>
      <Text style={styles.head}>Digit Recognizer</Text>
      </View>
      {loading && <Text style={styles.answer}>Processing . . .</Text>}
      {ans != null && !loading && <Text style={styles.answer}>The Digit is {ans}</Text>}
      <Sketchpad ref={pad} style={styles.pad} brush={brush} />
      <TouchableOpacity onPress={onClear} style={styles.reset}>
        <Text style={styles.button}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSave} style={styles.submit}>
        <Text style={styles.button}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    textAlign: 'center',
    alignItems: 'center',
  },
  head: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',
    position: 'absolute',
    top: 20,
  },
  button: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
    padding: 10,
    borderRadius: 50,
    fontSize: 23,
    color: 'white',
    textAlign: 'center',
  },
  submit: {
    position: 'absolute',
    bottom: 40,
    right: 40,
  },
  reset: {
    position: 'absolute',
    bottom: 40,
    left: 40,
  },
  answer: {
    color: 'black',
    fontSize: 20,
    position: 'absolute',
    bottom: 150,
  },
  pad: {
    position: 'absolute',
    backgroundColor: 'black',
    width: 350,
    height: 400,
    top: 160,
    flex: 1,
  },
  header:{
    backgroundColor:'#ADD8E6',
    width:'100%',
    height:100,
    alignItems:'center'
  }
});

export default App;
