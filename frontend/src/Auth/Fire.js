// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// import firebase from 'firebase';
// const auth =firebase.auth();

// const firebaseConfig = {
//   apiKey: "AIzaSyDSNQnibOlFmbeUozrt9MClO4LdYtunMms",
//   authDomain: "btpf-fdea3.firebaseapp.com",
//   projectId: "btpf-fdea3",
//   storageBucket: "btpf-fdea3.appspot.com",
//   messagingSenderId: "868845433595",
//   appId: "1:868845433595:web:beadde7cced504c521765e"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



const firebaseConfig = {
     apiKey: "AIzaSyDSNQnibOlFmbeUozrt9MClO4LdYtunMms",
     authDomain: "btpf-fdea3.firebaseapp.com",
     projectId: "btpf-fdea3",
     storageBucket: "btpf-fdea3.appspot.com",
     messagingSenderId: "868845433595",
     appId: "1:868845433595:web:beadde7cced504c521765e"
   };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 const db = firebase.firestore();
 const auth = firebase.auth();
 export {auth,firebase};
 export default db;


 