import {
  pushPendingSync,
  pullSync,
} from "./syncApi";

export const syncWhenOnline = async () => {
  if (!navigator.onLine) {
    return;
  }

  try {
    await pushPendingSync();
    await pullSync();

    console.log("MediPath sync completed.");
  } catch (error) {
    console.error("MediPath sync failed:", error);
  }
};

export const startSyncManager = () => {
  const handleOnline = () => {
    syncWhenOnline();
  };

  window.addEventListener("online", handleOnline);

  // Try to sync once when the application starts
  if (navigator.onLine) {
    syncWhenOnline();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
  };
};