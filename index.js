import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc8tx0kFGYYtCwmEEBBqW_UoJjosC3L0U",
  authDomain: "to-do-list-16499.firebaseapp.com",
  projectId: "to-do-list-16499",
  storageBucket: "to-do-list-16499.firebasestorage.app",
  messagingSenderId: "541555447516",
  appId: "1:541555447516:web:514700f34e72ba624e0619"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const googleLogin = document.getElementById('google-btn');
if (googleLogin) {
  googleLogin.addEventListener('click', () => {
    signInWithPopup(auth, provider)
    .then(() => window.location.href = 'index2.html')
    .catch((error) => {
      if (error.code === 'auth/popup-closed-by-user') {
        console.error('Пользователь закрыл окно аутентификации');
      } else {
        console.error(error.message);
      }
    });
  
  });
}

const updateUserProfile = (user) => {
  if (document.getElementById('userName')) {
    document.getElementById('userName').textContent = user.displayName || "";
  }
  if (document.getElementById('userProfilePicture')) {
    document.getElementById('userProfilePicture').src = user.photoURL || 'default-avatar.png';
  }
};

onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.includes("index2.html")) {
    if (user) {
      updateUserProfile(user);
    } else {
      window.location.href = 'index.html';
    }
  }
});


const asideBtns = document.querySelectorAll('.aside-btn');
const todoTitle = document.querySelector('.todo-title');
const addTaskBtn = document.querySelector('#add-btn');
const hr = document.querySelector('hr');

let listCurrentName = '';

const createTaskElement = (task) => {
  const li = document.createElement('LI');
  const img = document.createElement('IMG');
  const span = document.createElement('SPAN');

  img.src = task.checked ? './image/checked.png' : './image/unchecked.png';
  img.style.maxWidth = '20px';
  img.style.maxHeight = '20px';
  span.textContent = '\u00d7';
  span.classList = 'task-span'
  li.textContent = task.text;
  li.prepend(img);
  li.appendChild(span);

  if (task.checked) {
    li.classList.add('checked-task');
    img.classList.add('checked');
  }

  li.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      img.classList.toggle('checked');
      img.src = img.classList.contains('checked')
        ? './image/checked.png'
        : './image/unchecked.png';
      li.classList.toggle('checked-task');
    } else if (e.target.tagName === 'SPAN') {
      li.remove();
    }
  });

  return li;
};

todoTitle.textContent = 'Inbox'

if (todoTitle) {
  todoTitle.textContent = listCurrentName;
} else {
  console.error('Элемент todoTitle не найден!');
}

asideBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    listCurrentName = this.textContent.trim();
    todoTitle.textContent = listCurrentName;
    addTaskBtn.classList.remove('hidden');
  });
});

addTaskBtn.addEventListener('click', () => {
  addTaskBtn.classList.add('hidden');

  const div = document.createElement('DIV');
  div.className = 'list-row';

  const input = document.createElement('INPUT');
  input.className = 'input-add';

  const btn = document.createElement('BUTTON');
  btn.className = 'btn-add';

  document.getElementById('list-cont').prepend(div);
  div.append(input, btn);

  btn.addEventListener('click', () => {
    if (!input.value.trim()) return;

    const task = {
      text: input.value.trim(),
      checked: false
    };

    document.getElementById('list-cont').appendChild(createTaskElement(task));
    input.value = '';
    addTaskBtn.classList.remove('hidden');
    div.remove();
  });
});

document.querySelector('.aside-btn-create').addEventListener('click', () => {
  const backdrop = document.createElement('DIV');
  backdrop.className = 'modal-back';

  backdrop.innerHTML = `
        <div class="modal-wrapper">
          <div class="modal">
            <div class="modal-header">
              <h4 class="title">Create a list</h4>
              <button class="cross-btn">X</button>
            </div>
            <div class="modal-main">
              <input class="modal-input" placeholder="List name">
            </div>
            <div class="modal-footer">
              <button class="cancel-btn">Cancel</button>
              <button class="create-btn">Create list</button>
            </div>
          </div>
        </div>
      `;

  document.body.appendChild(backdrop);

  backdrop.querySelector('.cross-btn').addEventListener('click', () => backdrop.remove());
  backdrop.querySelector('.cancel-btn').addEventListener('click', () => backdrop.remove());

  backdrop.querySelector('.create-btn').addEventListener('click', () => {
    const input = backdrop.querySelector('.modal-input');
    const listName = input.value.trim();

    if (!listName) {
      alert('Please enter list name');
      return;
    }

    const newBtn = document.createElement('button');
    newBtn.className = 'aside-btn';
    newBtn.textContent = listName;
    hr.after(newBtn);

    newBtn.addEventListener('click', function () {
      listCurrentName = listName;
      todoTitle.textContent = listCurrentName;
      addTaskBtn.classList.remove('hidden');
    });

    backdrop.remove();
  });
});
