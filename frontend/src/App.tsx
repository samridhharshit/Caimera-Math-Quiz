import { useState } from "react";
import { AnswerForm } from "./components/AnswerForm";
import { Leaderboard } from "./components/Leaderboard";
import { ProblemCard } from "./components/ProblemCard";
import { useGame } from "./hooks/useGame";
import { SubmissionResult } from "./types/game";

const resultLabel: Record<SubmissionResult, string> = {
  WON: "You won this round.",
  CORRECT_BUT_LATE: "Correct, but someone was faster.",
  WRONG: "Wrong answer. Try again.",
  INVALID_ROUND: "Round changed. Submit on the active question.",
  EMPTY_ANSWER: "Enter an answer before submitting.",
};

function App() {
  const [username, setUsername] = useState("");
  const [answer, setAnswer] = useState("");
  const { snapshot, submit, submitResult, submitLoading } = useGame();

  const onSubmit = async () => {
    if (!snapshot) {
      return;
    }
    await submit({ username, answer, roundId: snapshot.round.id });
    setAnswer("");
  };

  return (
    <main className="page">
      <section className="panel">
        <h1>Competitive Math Quiz</h1>
        <p className="subtle">First correct answer wins. New rounds start automatically.</p>
        <ProblemCard round={snapshot?.round} />
        <AnswerForm
          username={username}
          answer={answer}
          onUsernameChange={setUsername}
          onAnswerChange={setAnswer}
          onSubmit={onSubmit}
          disabled={!snapshot || submitLoading}
        />
        {submitResult ? <p className="status">{resultLabel[submitResult]}</p> : null}
      </section>
      <Leaderboard entries={snapshot?.leaderboard ?? []} />
    </main>
  );
}

export default App;

