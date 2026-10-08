import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTPZ5CRsQ3C4SmtLbWU4lBXPzFHbWElP4",
    authDomain: "oscar-portfolio-8a1f0.firebaseapp.com",
    projectId: "oscar-portfolio-8a1f0",
    storageBucket: "oscar-portfolio-8a1f0.firebasestorage.app",
    messagingSenderId: "756522808094",
    appId: "1:756522808094:web:9c99df5877d947c7648f0f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginView = document.getElementById('login-view');
const inboxView = document.getElementById('inbox-view');
const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
const list = document.getElementById('messages');
const count = document.getElementById('count');
let stopListening = null;

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginStatus.textContent = 'Logging in...';
    try {
        await signInWithEmailAndPassword(auth, loginForm.email.value.trim(), loginForm.password.value);
        loginForm.reset();
        loginStatus.textContent = '';
    } catch (error) {
        loginStatus.textContent = 'Wrong email or password.';
    }
});

document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
    if (stopListening) { stopListening(); stopListening = null; }
    if (user) {
        loginView.classList.add('hidden');
        inboxView.classList.remove('hidden');
        listen();
    } else {
        inboxView.classList.add('hidden');
        loginView.classList.remove('hidden');
        list.textContent = '';
    }
});

function listen() {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    stopListening = onSnapshot(q, (snapshot) => {
        list.textContent = '';
        let unread = 0;
        if (snapshot.empty) {
            const p = document.createElement('p');
            p.className = 'empty';
            p.textContent = 'No messages yet.';
            list.appendChild(p);
        }
        snapshot.forEach((d) => {
            const data = d.data();
            if (!data.read) unread++;
            list.appendChild(renderMessage(d.id, data));
        });
        count.textContent = unread ? '(' + unread + ' new)' : '';
    }, () => {
        list.textContent = 'You do not have permission to view messages.';
    });
}

function renderMessage(id, data) {
    const card = document.createElement('article');
    card.className = 'msg' + (data.read ? '' : ' unread');

    const head = document.createElement('div');
    head.className = 'msg-head';
    const name = document.createElement('span');
    name.textContent = data.name;
    const when = document.createElement('span');
    when.className = 'msg-meta';
    when.textContent = data.createdAt ? data.createdAt.toDate().toLocaleString() : '';
    head.append(name, when);

    const email = document.createElement('a');
    email.className = 'msg-meta';
    email.href = 'mailto:' + encodeURIComponent(data.email);
    email.textContent = data.email;

    const body = document.createElement('p');
    body.className = 'msg-body';
    body.textContent = data.message;

    const actions = document.createElement('div');
    actions.className = 'msg-actions';

    const toggle = document.createElement('button');
    toggle.className = 'btn';
    toggle.type = 'button';
    toggle.textContent = data.read ? 'Mark as unread' : 'Mark as read';
    toggle.addEventListener('click', () => updateDoc(doc(db, 'messages', id), { read: !data.read }));

    const del = document.createElement('button');
    del.className = 'btn';
    del.type = 'button';
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
        if (confirm('Delete this message?')) deleteDoc(doc(db, 'messages', id));
    });

    actions.append(toggle, del);
    card.append(head, email, body, actions);
    return card;
}