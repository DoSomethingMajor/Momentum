"use strict";

const STORAGE_KEY = "momentum-app-v1";

const quotes = [

  {

    text: "You do not need more time. You need a clear next step.",

    author: "Momentum"

  },

  {

    text: "Small progress is still progress.",

    author: "Unknown"

  },

  {

    text: "Discipline is choosing what you want most over what you want now.",

    author: "Abraham Lincoln"

  },

  {

    text: "Success is the sum of small efforts repeated day after day.",

    author: "Robert Collier"

  },

  {

    text: "The secret of getting ahead is getting started.",

    author: "Mark Twain"

  },

  {

    text: "Your future is created by what you do today.",

    author: "Momentum"

  },

  {

    text: "Focus on becoming better, not appearing perfect.",

    author: "Momentum"

  },

  {

    text: "A year from now, you will wish you had started today.",

    author: "Karen Lamb"

  },

  {

    text: "Motivation begins the journey. Systems keep it moving.",

    author: "Momentum"

  },

  {

    text: "Do one thing today that your future self will thank you for.",

    author: "Unknown"

  }

];

const achievementDefinitions = [

  {

    id: "first-step",

    icon: "🚀",

    title: "First Step",

    description: "Complete your first task.",

    isUnlocked: (state) => state.totalCompletions >= 1

  },

  {

    id: "three-day-streak",

    icon: "🔥",

    title: "On Fire",

    description: "Reach a 3-day streak.",

    isUnlocked: (state) => state.streak >= 3

  },

  {

    id: "habit-builder",

    icon: "🌱",

    title: "Habit Builder",

    description: "Complete 10 habits.",

    isUnlocked: (state) => state.totalHabitCompletions >= 10

  },

  {

    id: "reflective",

    icon: "🧠",

    title: "Self Aware",

    description: "Save five daily check-ins.",

    isUnlocked: (state) => state.totalCheckIns >= 5

  }

];

const elements = {

  todayLabel: document.querySelector("#todayLabel"),

  greeting: document.querySelector("#greeting"),

  avatarInitial: document.querySelector("#avatarInitial"),

  themeButton: document.querySelector("#themeButton"),

  themeIcon: document.querySelector("#themeIcon"),

  profileButton: document.querySelector("#profileButton"),

  quoteText: document.querySelector("#quoteText"),

  quoteAuthor: document.querySelector("#quoteAuthor"),

  newQuoteButton: document.querySelector("#newQuoteButton"),

  shareQuoteButton: document.querySelector("#shareQuoteButton"),

  streakValue: document.querySelector("#streakValue"),

  todayProgressValue: document.querySelector("#todayProgressValue"),

  focusForm: document.querySelector("#focusForm"),

  focusInput: document.querySelector("#focusInput"),

  focusStatus: document.querySelector("#focusStatus"),

  savedFocus: document.querySelector("#savedFocus"),

  savedFocusText: document.querySelector("#savedFocusText"),

  focusCompletedMessage: document.querySelector("#focusCompletedMessage"),

  completeFocusButton: document.querySelector("#completeFocusButton"),

  editFocusButton: document.querySelector("#editFocusButton"),

  addHabitButton: document.querySelector("#addHabitButton"),

  emptyAddHabitButton: document.querySelector("#emptyAddHabitButton"),

  habitList: document.querySelector("#habitList"),

  habitEmptyState: document.querySelector("#habitEmptyState"),

  habitProgressFill: document.querySelector("#habitProgressFill"),

  habitProgressText: document.querySelector("#habitProgressText"),

  moodButtons: [...document.querySelectorAll(".mood-button")],

  moodStatus: document.querySelector("#moodStatus"),

  reflectionInput: document.querySelector("#reflectionInput"),

  reflectionCount: document.querySelector("#reflectionCount"),

  saveReflectionButton: document.querySelector("#saveReflectionButton"),

  weeklyAverage: document.querySelector("#weeklyAverage"),

  weekChart: document.querySelector("#weekChart"),

  achievementGrid: document.querySelector("#achievementGrid"),

  achievementCount: document.querySelector("#achievementCount"),

  upgradeButton: document.querySelector("#upgradeButton"),

  navItems: [...document.querySelectorAll(".nav-item")],

  habitModal: document.querySelector("#habitModal"),

  habitForm: document.querySelector("#habitForm"),

  habitNameInput: document.querySelector("#habitNameInput"),

  habitEmojiInput: document.querySelector("#habitEmojiInput"),

  closeHabitModalButton: document.querySelector("#closeHabitModalButton"),

  cancelHabitButton: document.querySelector("#cancelHabitButton"),

  profileModal: document.querySelector("#profileModal"),

  profileForm: document.querySelector("#profileForm"),

  nameInput: document.querySelector("#nameInput"),

  goalInput: document.querySelector("#goalInput"),

  closeProfileModalButton: document.querySelector("#closeProfileModalButton"),

  resetDataButton: document.querySelector("#resetDataButton"),

  premiumModal: document.querySelector("#premiumModal"),

  closePremiumModalButton: document.querySelector("#closePremiumModalButton"),

  mockPurchaseButton: document.querySelector("#mockPurchaseButton"),

  toast: document.querySelector("#toast")

};

let state = loadState();

let toastTimer = null;

function createDefaultState() {

  return {

    profile: {

      name: "",

      mainGoal: ""

    },

    theme: "light",

    quoteIndex: getDailyQuoteIndex(),

    focusByDate: {},

    habits: [

      {

        id: cryptoRandomId(),

        name: "Drink enough water",

        emoji: "💧",

        createdAt: new Date().toISOString()

      },

      {

        id: cryptoRandomId(),

        name: "Move for 20 minutes",

        emoji: "🏃",

        createdAt: new Date().toISOString()

      },

      {

        id: cryptoRandomId(),

        name: "Read for 10 minutes",

        emoji: "📚",

        createdAt: new Date().toISOString()

      }

    ],

    habitCompletionsByDate: {},

    checkInsByDate: {},

    progressByDate: {},

    streak: 0,

    longestStreak: 0,

    lastSuccessfulDate: null,

    totalCompletions: 0,

    totalHabitCompletions: 0,

    totalCheckIns: 0,

    unlockedAchievements: []

  };

}

function loadState() {

  const defaultState = createDefaultState();

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {

      return defaultState;

    }

    const parsed = JSON.parse(saved);

    return {

      ...defaultState,

      ...parsed,

      profile: {

        ...defaultState.profile,

        ...parsed.profile

      },

      focusByDate: parsed.focusByDate ?? {},

      habitCompletionsByDate: parsed.habitCompletionsByDate ?? {},

      checkInsByDate: parsed.checkInsByDate ?? {},

      progressByDate: parsed.progressByDate ?? {},

      unlockedAchievements: parsed.unlockedAchievements ?? []

    };

  } catch (error) {

    console.error("Unable to load saved data:", error);

    return defaultState;

  }

}

function saveState() {

  try {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  } catch (error) {

    console.error("Unable to save data:", error);

    showToast("Your browser could not save the latest changes.");

  }

}

function cryptoRandomId() {

  if (window.crypto?.randomUUID) {

    return window.crypto.randomUUID();

  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;

}

function getDateKey(date = new Date()) {

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

function getYesterdayKey() {

  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  return getDateKey(yesterday);

}

function getDailyQuoteIndex() {

  const now = new Date();

  const seed = Number(

    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(

      now.getDate()

    ).padStart(2, "0")}`

  );

  return seed % quotes.length;

}

function getTodayFocus() {

  return state.focusByDate[getDateKey()] ?? null;

}

function getTodayHabitCompletions() {

  const today = getDateKey();

  if (!state.habitCompletionsByDate[today]) {

    state.habitCompletionsByDate[today] = {};

  }

  return state.habitCompletionsByDate[today];

}

function getTodayCheckIn() {

  return state.checkInsByDate[getDateKey()] ?? null;

}

function initializeApp() {

  applyTheme();

  renderHeader();

  renderQuote();

  renderFocus();

  renderHabits();

  renderCheckIn();

  updateProgress();

  renderWeeklyChart();

  updateAchievements();

  bindEvents();

}

function bindEvents() {

  elements.themeButton.addEventListener("click", toggleTheme);

  elements.profileButton.addEventListener("click", openProfileModal);

  elements.newQuoteButton.addEventListener("click", showNextQuote);

  elements.shareQuoteButton.addEventListener("click", shareCurrentQuote);

  elements.focusForm.addEventListener("submit", saveFocus);

  elements.completeFocusButton.addEventListener("click", toggleFocusCompletion);

  elements.editFocusButton.addEventListener("click", editFocus);

  elements.addHabitButton.addEventListener("click", openHabitModal);

  elements.emptyAddHabitButton.addEventListener("click", openHabitModal);

  elements.habitForm.addEventListener("submit", addHabit);

  elements.closeHabitModalButton.addEventListener("click", closeHabitModal);

  elements.cancelHabitButton.addEventListener("click", closeHabitModal);

  elements.moodButtons.forEach((button) => {

    button.addEventListener("click", () => {

      selectMood(Number(button.dataset.mood));

    });

  });

  elements.reflectionInput.addEventListener("input", updateReflectionCount);

  elements.saveReflectionButton.addEventListener("click", saveCheckIn);

  elements.upgradeButton.addEventListener("click", openPremiumModal);

  elements.closePremiumModalButton.addEventListener("click", closePremiumModal);

  elements.mockPurchaseButton.addEventListener("click", handleMockPurchase);

  elements.profileForm.addEventListener("submit", saveProfile);

  elements.closeProfileModalButton.addEventListener("click", closeProfileModal);

  elements.resetDataButton.addEventListener("click", resetAllData);

  elements.navItems.forEach((item) => {

    item.addEventListener("click", () => handleNavigation(item));

  });

  [elements.habitModal, elements.profileModal, elements.premiumModal].forEach(

    (backdrop) => {

      backdrop.addEventListener("click", (event) => {

        if (event.target === backdrop) {

          closeAllModals();

        }

      });

    }

  );

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      closeAllModals();

    }

  });

}

function renderHeader() {

  const now = new Date();

  const hour = now.getHours();

  let greetingText = "Good evening";

  if (hour < 12) {

    greetingText = "Good morning";

  } else if (hour < 17) {

    greetingText = "Good afternoon";

  }

  const name = state.profile.name.trim();

  elements.greeting.textContent = name

    ? `${greetingText}, ${name}`

    : greetingText;

  elements.avatarInitial.textContent = name

    ? name.charAt(0).toUpperCase()

    : "M";

  elements.todayLabel.textContent = new Intl.DateTimeFormat("en-US", {

    weekday: "long",

    month: "short",

    day: "numeric"

  }).format(now);

}

function applyTheme() {

  const isDark = state.theme === "dark";

  document.body.classList.toggle("dark", isDark);

  elements.themeIcon.textContent = isDark ? "🌙" : "☀️";

  elements.themeButton.setAttribute(

    "aria-label",

    isDark ? "Switch to light theme" : "Switch to dark theme"

  );

}

function toggleTheme() {

  state.theme = state.theme === "dark" ? "light" : "dark";

  saveState();

  applyTheme();

}

function renderQuote() {

  const quote = quotes[state.quoteIndex % quotes.length];

  elements.quoteText.textContent = quote.text;

  elements.quoteAuthor.textContent = quote.author;

}

function showNextQuote() {

  state.quoteIndex = (state.quoteIndex + 1) % quotes.length;

  saveState();

  renderQuote();

}

async function shareCurrentQuote() {

  const quote = quotes[state.quoteIndex % quotes.length];

  const text = `"${quote.text}" — ${quote.author}`;

  try {

    if (navigator.share) {

      await navigator.share({

        title: "Daily Momentum",

        text

      });

      return;

    }

    await navigator.clipboard.writeText(text);

    showToast("Quote copied to your clipboard.");

  } catch (error) {

    if (error.name !== "AbortError") {

      showToast("Unable to share this quote.");

    }

  }

}

function saveFocus(event) {

  event.preventDefault();

  const value = elements.focusInput.value.trim();

  if (!value) {

    showToast("Enter your main priority first.");

    elements.focusInput.focus();

    return;

  }

  state.focusByDate[getDateKey()] = {

    text: value,

    completed: false,

    createdAt: new Date().toISOString()

  };

  saveState();

  renderFocus();

  updateProgress();

  showToast("Today's focus was saved.");

}

function renderFocus() {

  const focus = getTodayFocus();

  if (!focus) {

    elements.focusForm.classList.remove("hidden");

    elements.savedFocus.classList.add("hidden");

    elements.focusStatus.textContent = "Not started";

    elements.focusStatus.classList.remove("complete");

    elements.focusInput.value = "";

    return;

  }

  elements.focusForm.classList.add("hidden");

  elements.savedFocus.classList.remove("hidden");

  elements.savedFocus.classList.toggle("completed", focus.completed);

  elements.savedFocusText.textContent = focus.text;

  elements.focusStatus.textContent = focus.completed ? "Completed" : "In progress";

  elements.focusStatus.classList.toggle("complete", focus.completed);

  elements.focusCompletedMessage.textContent = focus.completed

    ? "Completed today"

    : "Tap the check when completed";

}

function toggleFocusCompletion() {

  const focus = getTodayFocus();

  if (!focus) {

    return;

  }

  const wasCompleted = focus.completed;

  focus.completed = !focus.completed;

  if (!wasCompleted && focus.completed) {

    state.totalCompletions += 1;

    showToast("Priority completed. Great work.");

  } else if (wasCompleted && !focus.completed) {

    state.totalCompletions = Math.max(0, state.totalCompletions - 1);

  }

  saveState();

  renderFocus();

  updateProgress();

  updateAchievements();

}

function editFocus() {

  const focus = getTodayFocus();

  if (!focus) {

    return;

  }

  elements.focusInput.value = focus.text;

  elements.focusForm.classList.remove("hidden");

  elements.savedFocus.classList.add("hidden");

  elements.focusInput.focus();

}

function openHabitModal() {

  if (state.habits.length >= 5) {

    showToast("The free version supports up to five habits.");

    openPremiumModal();

    return;

  }

  elements.habitModal.classList.remove("hidden");

  elements.habitNameInput.value = "";

  elements.habitEmojiInput.value = "💧";

  setTimeout(() => {

    elements.habitNameInput.focus();

  }, 100);

}

function closeHabitModal() {

  elements.habitModal.classList.add("hidden");

}

function addHabit(event) {

  event.preventDefault();

  const name = elements.habitNameInput.value.trim();

  const emoji = elements.habitEmojiInput.value;

  if (!name) {

    showToast("Enter a habit name.");

    return;

  }

  const duplicate = state.habits.some(

    (habit) => habit.name.toLowerCase() === name.toLowerCase()

  );

  if (duplicate) {

    showToast("That habit already exists.");

    return;

  }

  state.habits.push({

    id: cryptoRandomId(),

    name,

    emoji,

    createdAt: new Date().toISOString()

  });

  saveState();

  closeHabitModal();

  renderHabits();

  updateProgress();

  showToast("New habit added.");

}

function renderHabits() {

  const completions = getTodayHabitCompletions();

  elements.habitList.innerHTML = "";

  elements.habitEmptyState.classList.toggle("hidden", state.habits.length > 0);

  state.habits.forEach((habit) => {

    const isCompleted = Boolean(completions[habit.id]);

    const item = document.createElement("li");

    item.className = `habit-item${isCompleted ? " completed" : ""}`;

    const toggleButton = document.createElement("button");

    toggleButton.className = "habit-toggle";

    toggleButton.type = "button";

    toggleButton.setAttribute(

      "aria-label",

      `${isCompleted ? "Uncheck" : "Complete"} ${habit.name}`

    );

    toggleButton.textContent = isCompleted ? "✓" : habit.emoji;

    toggleButton.addEventListener("click", () => {

      toggleHabit(habit.id);

    });

    const details = document.createElement("div");

    details.className = "habit-details";

    const habitName = document.createElement("p");

    habitName.className = "habit-name";

    habitName.textContent = habit.name;

    const habitMeta = document.createElement("p");

    habitMeta.className = "habit-meta";

    habitMeta.textContent = isCompleted

      ? "Completed today"

      : "Tap the icon when finished";

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-habit-button";

    deleteButton.type = "button";

    deleteButton.setAttribute("aria-label", `Delete ${habit.name}`);

    deleteButton.textContent = "×";

    deleteButton.addEventListener("click", () => {

      deleteHabit(habit.id);

    });

    details.append(habitName, habitMeta);

    item.append(toggleButton, details, deleteButton);

    elements.habitList.append(item);

  });

  renderHabitProgress();

}

function toggleHabit(habitId) {

  const completions = getTodayHabitCompletions();

  const wasCompleted = Boolean(completions[habitId]);

  completions[habitId] = !wasCompleted;

  if (!wasCompleted) {

    state.totalHabitCompletions += 1;

    state.totalCompletions += 1;

  } else {

    state.totalHabitCompletions = Math.max(

      0,

      state.totalHabitCompletions - 1

    );

    state.totalCompletions = Math.max(0, state.totalCompletions - 1);

  }

  saveState();

  renderHabits();

  updateProgress();

  updateAchievements();

  if (!wasCompleted) {

    showToast("Habit completed.");

  }

}

function deleteHabit(habitId) {

  const habit = state.habits.find((item) => item.id === habitId);

  if (!habit) {

    return;

  }

  const confirmed = window.confirm(`Delete "${habit.name}"?`);

  if (!confirmed) {

    return;

  }

  const todayCompletions = getTodayHabitCompletions();

  if (todayCompletions[habitId]) {

    state.totalHabitCompletions = Math.max(

      0,

      state.totalHabitCompletions - 1

    );

    state.totalCompletions = Math.max(0, state.totalCompletions - 1);

  }

  state.habits = state.habits.filter((item) => item.id !== habitId);

  Object.values(state.habitCompletionsByDate).forEach((dateCompletions) => {

    delete dateCompletions[habitId];

  });

  saveState();

  renderHabits();

  updateProgress();

  updateAchievements();

  showToast("Habit deleted.");

}

function renderHabitProgress() {

  const completions = getTodayHabitCompletions();

  const completedCount = state.habits.filter(

    (habit) => completions[habit.id]

  ).length;

  const total = state.habits.length;

  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  elements.habitProgressFill.style.width = `${percentage}%`;

  elements.habitProgressText.textContent =

    `${completedCount} of ${total} habit${total === 1 ? "" : "s"} completed`;

}

function selectMood(mood) {

  elements.moodButtons.forEach((button) => {

    const isSelected = Number(button.dataset.mood) === mood;

    button.classList.toggle("selected", isSelected);

  });

  elements.moodStatus.dataset.selectedMood = String(mood);

  elements.moodStatus.textContent = "Selected";

  elements.moodStatus.classList.add("complete");

}

function renderCheckIn() {

  const checkIn = getTodayCheckIn();

  elements.moodButtons.forEach((button) => {

    const isSelected = Number(button.dataset.mood) === checkIn?.mood;

    button.classList.toggle("selected", isSelected);

  });

  elements.reflectionInput.value = checkIn?.reflection ?? "";

  elements.moodStatus.dataset.selectedMood = checkIn?.mood

    ? String(checkIn.mood)

    : "";

  elements.moodStatus.textContent = checkIn ? "Saved" : "Not checked in";

  elements.moodStatus.classList.toggle("complete", Boolean(checkIn));

  updateReflectionCount();

}

function updateReflectionCount() {

  const length = elements.reflectionInput.value.length;

  elements.reflectionCount.textContent = `${length} / 240`;

}

function saveCheckIn() {

  const mood = Number(elements.moodStatus.dataset.selectedMood);

  const reflection = elements.reflectionInput.value.trim();

  const today = getDateKey();

  const existing = state.checkInsByDate[today];

  if (!mood) {

    showToast("Choose a mood before saving.");

    return;

  }

  state.checkInsByDate[today] = {

    mood,

    reflection,

    savedAt: new Date().toISOString()

  };

  if (!existing) {

    state.totalCheckIns += 1;

  }

  saveState();

  renderCheckIn();

  updateProgress();

  updateAchievements();

  showToast("Daily check-in saved.");

}

function calculateTodayProgress() {

  const focus = getTodayFocus();

  const completions = getTodayHabitCompletions();

  const checkIn = getTodayCheckIn();

  const focusScore = focus?.completed ? 35 : 0;

  const habitScore =

    state.habits.length === 0

      ? 0

      : Math.round(

          (state.habits.filter((habit) => completions[habit.id]).length /

            state.habits.length) *

            45

        );

  const checkInScore = checkIn ? 20 : 0;

  return Math.min(100, focusScore + habitScore + checkInScore);

}

function updateProgress() {

  const today = getDateKey();

  const progress = calculateTodayProgress();

  state.progressByDate[today] = progress;

  elements.todayProgressValue.textContent = String(progress);

  updateStreak(progress);

  saveState();

  renderWeeklyChart();

}

function updateStreak(todayProgress) {

  const today = getDateKey();

  const yesterday = getYesterdayKey();

  const qualifies = todayProgress >= 60;

  if (qualifies) {

    if (state.lastSuccessfulDate === today) {

      elements.streakValue.textContent = String(state.streak);

      return;

    }

    state.streak =

      state.lastSuccessfulDate === yesterday

        ? state.streak + 1

        : 1;

    state.lastSuccessfulDate = today;

    state.longestStreak = Math.max(state.longestStreak, state.streak);

  } else if (

    state.lastSuccessfulDate !== today &&

    state.lastSuccessfulDate !== yesterday

  ) {

    state.streak = 0;

  }

  elements.streakValue.textContent = String(state.streak);

}

function renderWeeklyChart() {

  const days = [];

  const formatter = new Intl.DateTimeFormat("en-US", {

    weekday: "short"

  });

  for (let offset = 6; offset >= 0; offset -= 1) {

    const date = new Date();

    date.setDate(date.getDate() - offset);

    const key = getDateKey(date);

    days.push({

      key,

      label: formatter.format(date).slice(0, 2),

      progress: state.progressByDate[key] ?? 0,

      isToday: offset === 0

    });

  }

  elements.weekChart.innerHTML = "";

  days.forEach((day) => {

    const column = document.createElement("div");

    column.className = `day-column${day.isToday ? " today" : ""}`;

    const track = document.createElement("div");

    track.className = "bar-track";

    track.title = `${day.progress}%`;

    const fill = document.createElement("div");

    fill.className = "bar-fill";

    fill.style.height = `${Math.max(day.progress, 4)}%`;

    const label = document.createElement("span");

    label.className = "day-label";

    label.textContent = day.label;

    track.append(fill);

    column.append(track, label);

    elements.weekChart.append(column);

  });

  const average = Math.round(

    days.reduce((total, day) => total + day.progress, 0) / days.length

  );

  elements.weeklyAverage.textContent = `${average}%`;

}

function updateAchievements() {

  const newlyUnlocked = [];

  achievementDefinitions.forEach((achievement) => {

    const unlocked = achievement.isUnlocked(state);

    const wasRecorded = state.unlockedAchievements.includes(achievement.id);

    if (unlocked && !wasRecorded) {

      state.unlockedAchievements.push(achievement.id);

      newlyUnlocked.push(achievement.title);

    }

  });

  saveState();

  renderAchievements();

  if (newlyUnlocked.length > 0) {

    showToast(`Achievement unlocked: ${newlyUnlocked[0]}`);

  }

}

function renderAchievements() {

  elements.achievementGrid.innerHTML = "";

  achievementDefinitions.forEach((achievement) => {

    const unlocked = state.unlockedAchievements.includes(achievement.id);

    const card = document.createElement("article");

    card.className = `achievement-card${unlocked ? "" : " locked"}`;

    const icon = document.createElement("div");

    icon.className = "achievement-icon";

    icon.textContent = achievement.icon;

    const title = document.createElement("h3");

    title.textContent = achievement.title;

    const description = document.createElement("p");

    description.textContent = unlocked

      ? achievement.description

      : "Keep building momentum to unlock.";

    card.append(icon, title, description);

    elements.achievementGrid.append(card);

  });

  elements.achievementCount.textContent =

    `${state.unlockedAchievements.length} / ${achievementDefinitions.length}`;

}

function openProfileModal() {

  elements.nameInput.value = state.profile.name;

  elements.goalInput.value = state.profile.mainGoal;

  elements.profileModal.classList.remove("hidden");

}

function closeProfileModal() {

  elements.profileModal.classList.add("hidden");

}

function saveProfile(event) {

  event.preventDefault();

  state.profile.name = elements.nameInput.value.trim();

  state.profile.mainGoal = elements.goalInput.value.trim();

  saveState();

  renderHeader();

  closeProfileModal();

  showToast("Profile updated.");

}

function resetAllData() {

  const confirmed = window.confirm(

    "Reset all Momentum data? This cannot be undone."

  );

  if (!confirmed) {

    return;

  }

  localStorage.removeItem(STORAGE_KEY);

  state = createDefaultState();

  closeAllModals();

  applyTheme();

  renderHeader();

  renderQuote();

  renderFocus();

  renderHabits();

  renderCheckIn();

  updateProgress();

  renderWeeklyChart();

  updateAchievements();

  showToast("All app data was reset.");

}

function openPremiumModal() {

  elements.premiumModal.classList.remove("hidden");

}

function closePremiumModal() {

  elements.premiumModal.classList.add("hidden");

}

function handleMockPurchase() {

  closePremiumModal();

  showToast("Demo checkout only. No payment was collected.");

}

function closeAllModals() {

  closeHabitModal();

  closeProfileModal();

  closePremiumModal();

}

function handleNavigation(selectedItem) {

  elements.navItems.forEach((item) => {

    item.classList.toggle("active", item === selectedItem);

  });

  const section = selectedItem.dataset.section;

  const targets = {

    today: document.querySelector(".hero-card"),

    progress: elements.weekChart.closest(".section-card"),

    achievements: elements.achievementGrid.closest(".section-card"),

    profile: null

  };

  if (section === "profile") {

    openProfileModal();

    return;

  }

  targets[section]?.scrollIntoView({

    behavior: "smooth",

    block: "start"

  });

}

function showToast(message) {

  window.clearTimeout(toastTimer);

  elements.toast.textContent = message;

  elements.toast.classList.remove("hidden");

  toastTimer = window.setTimeout(() => {

    elements.toast.classList.add("hidden");

  }, 2600);

}

initializeApp()
