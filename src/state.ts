import { StudentState } from "./types";

const STORAGE_KEY = "falfalla-academy-state";

export const initialState: StudentState = {
  isAuthenticated: false,
  role: "student",
  name: "Latte Artist",
  email: "",
  preferredLanguage: "en",
  enrolledCourseIds: [],
  completedLessonIds: [],
  bookmarkedLessonIds: [],
  lessonNotes: {},
  watchedSeconds: 0,
  streakDays: 0,
  lastActivityDate: "",
  lessonPositions: {},
  likedUploadIds: [],
  courseAccess: [],
  deviceId: "",
  sessionToken: "",
};

export function loadState(): StudentState {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialState;

  try {
    return { ...initialState, ...JSON.parse(saved) };
  } catch {
    return initialState;
  }
}

export function saveState(state: StudentState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
