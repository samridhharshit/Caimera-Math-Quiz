export const AnswerForm = ({
  username,
  answer,
  onUsernameChange,
  onAnswerChange,
  onSubmit,
  disabled,
}) => (
  <div className="form">
    <input
      className="input"
      placeholder="Username"
      value={username}
      onChange={(event) => onUsernameChange(event.target.value)}
    />
    <input
      className="input"
      placeholder="Answer"
      value={answer}
      onChange={(event) => onAnswerChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSubmit();
        }
      }}
    />
    <button className="button" disabled={disabled} onClick={onSubmit}>
      Submit
    </button>
  </div>
);

