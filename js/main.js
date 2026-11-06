// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const navList = document.getElementById("navList");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
}

// ---------- Academic Planner ----------
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const counter = document.getElementById("counter");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // array of {id, text, done}

  function save() { localStorage.setItem("tasks", JSON.stringify(tasks)); }

  function render() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="empty">No tasks yet. Add your first one above.</li>';
    }
    tasks.forEach(task => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = task.done;
      box.setAttribute("aria-label", "Mark complete: " + task.text);
      box.addEventListener("change", () => toggleTask(task.id));

      const text = document.createElement("span");
      text.textContent = task.text;

      const del = document.createElement("button");
      del.className = "del";
      del.innerHTML = "&times;";
      del.setAttribute("aria-label", "Delete task: " + task.text);
      del.addEventListener("click", () => deleteTask(task.id));

      li.append(box, text, del);
      taskList.appendChild(li);
    });
    const left = tasks.filter(t => !t.done).length;
    counter.textContent = left + " of " + tasks.length + " tasks remaining";
  }

  function addTask(text) { tasks.push({ id: Date.now(), text: text, done: false }); save(); render(); }
  function toggleTask(id) { tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); save(); render(); }
  function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); save(); render(); }

  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const value = taskInput.value.trim();
    if (value === "") { taskInput.focus(); return; }
    addTask(value);
    taskInput.value = "";
    taskInput.focus();
  });
  render();
}

// ---------- Contact form validation ----------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const rules = {
    name:    v => v === "" ? "Enter your name." : "",
    email:   v => v === "" ? "Enter your email address." :
                  (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email, like name@example.com." : ""),
    phone:   v => v === "" ? "Enter your phone number." :
                  (!/^\d+$/.test(v) ? "Use digits only, with no spaces or symbols." : ""),
    message: v => v === "" ? "Write a message." : ""
  };

  function validateField(id) {
    const input = document.getElementById(id);
    const msg = rules[id](input.value.trim());
    document.getElementById(id + "Error").textContent = msg;
    input.classList.toggle("invalid", msg !== "");
    return msg === "";
  }

  Object.keys(rules).forEach(id => {
    document.getElementById(id).addEventListener("blur", () => validateField(id));
  });

  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const ok = Object.keys(rules).map(validateField).every(Boolean);
    const box = document.getElementById("formStatus");
    if (ok) {
      box.innerHTML = '<div class="success">Thanks! Your message has been sent.</div>';
      contactForm.reset();
    } else {
      box.innerHTML = "";
    }
  });
}

// ---------- Scroll reveal animation ----------
const revealItems = document.querySelectorAll("main h2, main .card, main table, main video, main form, main .planner, main ul.list, main ol.list, main p");
revealItems.forEach(el => el.classList.add("reveal"));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.querySelectorAll(".bar span").forEach(b => b.style.width = b.dataset.width);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach(el => observer.observe(el));

// ---------- Typing effect on homepage ----------
const typedEl = document.getElementById("typed");
if (typedEl) {
  const roles = ["Computer Science student", "web developer", "problem solver"];
  let r = 0, c = 0, deleting = false;
  function type() {
    const word = roles[r];
    typedEl.textContent = word.substring(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(type, 90); }
    else if (!deleting) { deleting = true; setTimeout(type, 1400); }
    else if (c > 0) { c--; setTimeout(type, 50); }
    else { deleting = false; r = (r + 1) % roles.length; setTimeout(type, 300); }
  }
  type();
}
