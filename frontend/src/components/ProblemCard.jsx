import { RoundStatus } from "../types/game.js";

export const ProblemCard = ({ round }) => {
  if (!round) {
    return <div className="card">Loading current question...</div>;
  }

  return (
    <div className="card">
      <p className="label">Round ID: {round.id}</p>
      <p className="question">{round.text}</p>
      <p className="label">
        Status:{" "}
        {round.status === RoundStatus.OPEN
          ? "Open"
          : `Solved by ${round.winner ?? "Unknown"}`}
      </p>
    </div>
  );
};

