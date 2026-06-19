interface LogoutConfirmSheetProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmSheet({ onCancel, onConfirm }: LogoutConfirmSheetProps) {
  return (
    <div className="fixed inset-0 z-[110] flex flex-col justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-t-3xl px-6 pt-7 pb-10 animate-in slide-in-from-bottom-4 duration-300 max-w-[430px] mx-auto w-full">
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />
        <h3 className="text-[20px] font-black text-black mb-2">Fortschritt geht verloren.</h3>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
          Du hast noch keinen Account — wenn du jetzt zurückgehst, sind alle eingegebenen Daten weg.
        </p>
        <div className="space-y-3">
          <button
            onClick={onCancel}
            className="w-full bg-black text-white font-extrabold text-[15px] py-4 rounded-xl cursor-pointer"
          >
            Weitermachen
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-[#F4F4F5] text-gray-500 font-bold text-[15px] py-4 rounded-xl cursor-pointer"
          >
            Trotzdem abmelden
          </button>
        </div>
      </div>
    </div>
  );
}
