export default function Pomodoro() {
  return (
    <div className="mt-[60px]">
      <h2>Pomodoro</h2>

      {Array.from({ length: 100 }).map((v, i) => (
        <div
          key={i}
          className="my-3 rounded-md w-full h-[100px] bg-[#f3f3f3]"
        ></div>
      ))}
    </div>
  );
}
