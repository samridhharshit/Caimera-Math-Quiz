import { RoundStatus } from "../types/game";
import type { Round } from "../types/game";

type Props = {
  round?: Round;
};

export const ProblemCard = ({ round }: Props) => {
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

