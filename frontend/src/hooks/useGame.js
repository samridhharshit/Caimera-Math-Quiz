import { useEffect, useState } from "react";
import { gameApi } from "../api/gameApi";
import { SubmissionResult } from "../types/game.js";

export const useGame = () => {
  const [snapshot, setSnapshot] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    const eventSource = new EventSource(gameApi.streamUrl);

    gameApi
      .getState()
      .then((data) => {
        if (alive) {
          setSnapshot(data);
        }
      })
      .catch(() => undefined);

    eventSource.onmessage = (event) => {
      if (!alive) {
        return;
      }
      const incoming = JSON.parse(event.data);
      setSnapshot(incoming);
    };

    eventSource.onerror = () => {
      eventSource.close();
      gameApi
        .getState()
        .then((data) => {
          if (alive) {
            setSnapshot(data);
          }
        })
        .catch(() => undefined);
    };

    return () => {
      alive = false;
      eventSource.close();
    };
  }, []);

  const submit = async (payload) => {
    setSubmitLoading(true);
    try {
      const response = await gameApi.submit(payload);
      const result = response.result;
      setSubmitResult(Object.values(SubmissionResult).includes(result) ? result : null);
      const updated = await gameApi.getState();
      setSnapshot(updated);
    } finally {
      setSubmitLoading(false);
    }
  };

  return { snapshot, submit, submitResult, submitLoading };
};

