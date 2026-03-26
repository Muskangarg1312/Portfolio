// 🔥 FIREBASE IMPORT (latest version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 YOUR FIREBASE CONFIG (paste from Firebase)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_WIGH8Kxxf7i8cDO4BKlDLdEEQ_tlif4",
  authDomain: "portfolio-3f3f8.firebaseapp.com",
  projectId: "portfolio-3f3f8",
  storageBucket: "portfolio-3f3f8.firebasestorage.app",
  messagingSenderId: "746955670905",
  appId: "1:746955670905:web:c75d85eb842dfde46edba8",
  measurementId: "G-67QG885C4C",
};
// 🚀 INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const input = document.getElementById("commentInput");
const btn = document.getElementById("postBtn");
const list = document.getElementById("commentList");
// const toast = document.getElementById("toast");

// POST COMMENT
btn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  await addDoc(collection(db, "comments"), {
    text,
    time: new Date(),
  });

  input.value = "";

  showToast("✅ Comment posted");
};

// REALTIME COMMENTS

const q = query(collection(db, "comments"), orderBy("time", "desc"));

onSnapshot(q, (snapshot) => {
  list.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "comment-item";

    div.innerHTML = `
      <div>
        <div class="comment-text">${data.text}</div>
        <div class="comment-time">
          ${new Date(data.time.seconds * 1000).toLocaleString()}
        </div>
      </div>

      <button class="delete-btn" onclick="deleteComment('${docSnap.id}', this)">
        Delete
      </button>
    `;

    list.appendChild(div);
  });
});

// TOAST
function showToast(msg) {
  let t = document.getElementById("toast");

  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }

  t.innerText = msg;
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2000);
}

// DELETE (ADMIN)
window.deleteComment = async function (id, el) {
  if (!confirm("Delete this comment?")) return;

  try {
    const card = el.closest(".comment-item");

    // ✨ animation
    if (card) card.classList.add("delete-anim");

    // ✅ FIRST delete from DB (important)
    await deleteDoc(doc(db, "comments", id));

    // toast
    showToast("🗑️ Comment deleted");
  } catch (e) {
    console.error(e);
    showToast("❌ Failed to delete");
  }
};

// MODAL DUNCTIONS FOR COMMENTS POPUP VIEW

window.openComments = function () {
  document.getElementById("commentModal").classList.add("active");
};

window.closeComments = function () {
  document.getElementById("commentModal").classList.remove("active");
};
