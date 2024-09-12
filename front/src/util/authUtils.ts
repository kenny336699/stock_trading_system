import { AppDispatch } from "@/store";
import { logout, setUser, updateLastActivity } from "@/store/userSlice";

const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

export const initializeAuth = (dispatch: AppDispatch) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    dispatch(setUser(JSON.parse(storedUser)));
  }

  // Set up activity listeners
  ["mousedown", "keydown", "touchstart", "scroll"].forEach((eventType) => {
    window.addEventListener(eventType, () => dispatch(updateLastActivity()));
  });

  // Start the inactivity check
  setInterval(() => checkInactivity(dispatch), 1200000); // Check every minute
};

const checkInactivity = (dispatch: AppDispatch) => {
  const lastActivity = new Date(
    JSON.parse(localStorage.getItem("user") || "{}").lastActivity || 0
  );
  if (Date.now() - lastActivity.getTime() > INACTIVITY_TIMEOUT) {
    dispatch(logout());
  }
};
