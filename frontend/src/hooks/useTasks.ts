import { useCallback, useEffect, useState } from "react";
import { listTasks, type Task } from "../api/tasks";
import { useAuth } from "../auth/AuthProvider";
import { getFriendlyErrorMessage } from "../utils/errorMessages";

export function useTasks() {
  const { idToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!idToken) {
      setTasks([]);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      setTasks(await listTasks(idToken));
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to load your tasks. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { idToken, tasks, loading, error, refresh };
}
