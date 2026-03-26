export const Leaderboard = ({ entries }) => (
  <aside className="panel">
    <h2>Leaderboard</h2>
    {entries.length === 0 ? <p className="subtle">No winners yet.</p> : null}
    <ol className="list">
      {entries.map((entry) => (
        <li key={entry.username} className="listItem">
          <span>{entry.username}</span>
          <strong>{entry.wins}</strong>
        </li>
      ))}
    </ol>
  </aside>
);

