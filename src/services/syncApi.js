import api from "./api";

const SYNC_QUEUE_KEY = "medipath_sync_queue";
const SYNC_CURSOR_KEY = "medipath_sync_cursor";

// Save a triage action locally
export const queueTriageForSync = (payload) => {
  const queue = JSON.parse(
    localStorage.getItem(SYNC_QUEUE_KEY) || "[]"
  );

  const syncAction = {
    client_event_id: crypto.randomUUID(),
    entity_type: "TRIAGE",
    operation: "CREATE",
    payload,
  };

  queue.push(syncAction);

  localStorage.setItem(
    SYNC_QUEUE_KEY,
    JSON.stringify(queue)
  );

  return syncAction;
};

// Push offline triage actions to backend
export const pushPendingSync = async () => {
  const queue = JSON.parse(
    localStorage.getItem(SYNC_QUEUE_KEY) || "[]"
  );

  if (queue.length === 0) {
    return [];
  }

  const remaining = [];
  const processed = [];

  for (const action of queue) {
    try {
      const response = await api.post(
        "/sync/push",
        action
      );

      processed.push(response.data);
    } catch (error) {
      remaining.push(action);
    }
  }

  localStorage.setItem(
    SYNC_QUEUE_KEY,
    JSON.stringify(remaining)
  );

  return processed;
};

// Pull processed sync actions
export const pullSync = async () => {
  const afterId = Number(
    localStorage.getItem(SYNC_CURSOR_KEY) || 0
  );

  const response = await api.get("/sync/pull", {
    params: {
      after_id: afterId,
      limit: 50,
    },
  });

  const data = response.data;

  if (data.next_cursor !== undefined) {
    localStorage.setItem(
      SYNC_CURSOR_KEY,
      String(data.next_cursor)
    );
  }

  return data;
};

// Number of pending offline actions
export const getPendingSyncCount = () => {
  const queue = JSON.parse(
    localStorage.getItem(SYNC_QUEUE_KEY) || "[]"
  );

  return queue.length;
};