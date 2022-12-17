import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

let firebaseConfig = {
  apiKey: "AIzaSyCMxTjjtfoD6rjcldHu55caDLf0XHbylwg",
  authDomain: "meuapp-ef9ef.firebaseapp.com",
  databaseURL: "https://meuapp-ef9ef-default-rtdb.firebaseio.com",
  projectId: "meuapp-ef9ef",
  storageBucket: "meuapp-ef9ef.appspot.com",
  messagingSenderId: "419761452905",
  appId: "1:419761452905:web:b6531f87a7ba79a98a6ff8",
  measurementId: "G-2Z4TWECWNY",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
