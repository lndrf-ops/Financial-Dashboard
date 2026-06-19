export function Confetti() {
  const colors = ['#000000', '#374151', '#6B7280', '#10b981', '#f59e0b', '#f43f5e'];
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {[...Array(75)].map((_, i) => {
        const color = colors[i % colors.length];
        const left = `${(i * 137.5) % 100}%`;
        const animDuration = `${3 + (i % 5) * 0.4}s`;
        const animDelay = `${(i % 5) * 0.1}s`;
        const size = i % 2 === 0 ? 'w-2 h-5' : 'w-2.5 h-2.5';
        return (
          <div
            key={i}
            className={`absolute top-[-10%] ${size} rounded-sm opacity-90`}
            style={{
              left,
              backgroundColor: color,
              animation: `fall ${animDuration} linear ${animDelay} forwards`,
              transform: `rotate(${(i * 47) % 360}deg)`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
