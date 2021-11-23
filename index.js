// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {getAuth, 
  EmailAuthProvider,
  signOut,
  onAuthStateChanged} from 'firebase/auth';
import {
 getFirestore,
 addDoc, 
 collection,
 query,
 orderBy,
 onSnapshot} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: "AIzaSyBm5dX_2YzPzqLLla-Ilh-Hea4wfE97zkg",
    authDomain: "gdsc-hufs-9a49d.firebaseapp.com",
    projectId: "gdsc-hufs-9a49d",
    storageBucket: "gdsc-hufs-9a49d.appspot.com",
    messagingSenderId: "970926834016",
    appId: "1:970926834016:web:bc5d222eba8d73f3025e05"
  };

  initializeApp(firebaseConfig);
  auth = getAuth ();
  db = getFirestore ();

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(auth);
  startRsvpButton.addEventListener("click",
   () => { 
        ui.start("#firebaseui-auth-container", uiConfig); 
  });
  onAuthStateChanged(auth, user => {
   if (user) {
     startRsvpButton.textContent = 'LOGOUT';
    } else { 
      startRsvpButton.textContent = 'RSVP'; 
    } 
  });
  startRsvpButton.addEventListener('click', () => { 
    if (auth.currentUser) { 
      signOut(auth); 
    } else { 
      ui.start('#firebaseui-auth-container', uiConfig); 
    } 
  });
  form.addEventListener('submit', async e => { 
    e.preventDefault();
    addDoc(collection(db, 'guestbook'), {
      text: input.value,
      timestamp: Date.now(),
      name: auth.currentUser.displayName,
      userId: auth.currentUser.uid
    }); 
    input.value = '';
    return false;
 });

 const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc')); onSnapshot(q, snaps => {
  guestbook.innerHTML = '';
  snaps.forEach(doc => {
    const entry = document.createElement('p');
    entry.textContent = doc.data().name + ': ' + doc.data()
    .text;
    guestbook.appendChild(entry);
  });
});
}
main();
