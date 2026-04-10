export default function SplashScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden relative">
      {/* เอฟเฟกต์เส้นแสงวิ่งเบลอๆ ด้านหลัง (สร้างความรู้สึกเคลื่อนที่) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-1 bg-linear-to-r from-transparent via-lime-400 to-transparent blur-sm animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-0 w-full h-1 bg-linear-to-r from-transparent via-white to-transparent blur-sm animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
        <div className="absolute top-3/4 left-0 w-full h-1 bg-linear-to-r from-transparent via-lime-400 to-transparent blur-sm animate-[pulse_3s_ease-in-out_infinite_1s]" />
      </div>

      {/* โลโก้หลัก: แยกตัวอักษรเพื่อใส่ Animation */}
      <div className="relative flex items-center mb-10 scale-110">
        <span className="text-5xl font-extrabold italic text-lime-400 animate-[slideInLeft_0.5s_ease-out_forwards]">
          Stride
        </span>
        <span className="text-5xl font-extrabold italic text-white ml-1 animate-[slideInRight_0.5s_ease-out_forwards]">
          Pilot
        </span>
        {/* แสงเรืองรองหลังโลโก้ */}
        <div className="absolute inset-0 bg-lime-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
      </div>

      {/* ข้อความ Loading และ Spinner แบบขีดหมุน */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-slate-600 border-t-lime-400 rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-400 tracking-widest uppercase animate-pulse">
          Initializing Session...
        </span>
      </div>
    </div>
  );
}
