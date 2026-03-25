import { useEffect, useState } from "react";
import { gameApi } from "../api/gameApi";
import { SubmissionResult } from "../types/game";
import type { GameSnapshot, SubmitPayload } from "../types/game";

export const useGame = () => {
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmissionResult | null>(null);
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
      const incoming = JSON.parse(event.data) as GameSnapshot;
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

  const submit = async (payload: SubmitPayload) => {
    setSubmitLoading(true);
    try {
      const response = await gameApi.submit(payload);
      setSubmitResult(response.result as SubmissionResult);
      const updated = await gameApi.getState();
      setSnapshot(updated);
    } finally {
      setSubmitLoading(false);
    }
  };

  return { snapshot, submit, submitResult, submitLoading };
};

