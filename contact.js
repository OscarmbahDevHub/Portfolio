import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTPZ5CRsQ3C4SmtLbWU4lBXPzFHbWElP4",
    authDomain: "oscar-portfolio-8a1f0.firebaseapp.com",
    projectId: "oscar-portfolio-8a1f0",
    storageBucket: "oscar-portfolio-8a1f0.firebasestorage.app",
    messagingSenderId: "756522808094",
    appId: "1:756522808094:web:9c99df5877d947c7648f0f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const button = form.querySelector('button[type="submit"]');

function show(text, type) {
    status.textContent = text;
    status.className = type;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (form.website.value) return;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
        show('Please fill in every field.', 'error');
        return;
    }

    button.disabled = true;
    show('Sending...', '');

    try {
        await addDoc(collection(db, 'messages'), {
            name,
            email,
            message,
            read: false,
            createdAt: serverTimestamp()
        });
        form.reset();
        show('Message sent. Thank you, I will reply soon.', 'ok');
    } catch (error) {
        console.error(error);
        show('Could not send your message. Please email me directly instead.', 'error');
    } finally {
        button.disabled = false;
    }
});