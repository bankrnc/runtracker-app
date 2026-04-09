import creatorPhoto from "../assets/MyDeveloper.jpg";

export default function AboutUsPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-24">
      {/* ===== HERO ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-lime-400 mb-4">
              About Us
            </p>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
              Built by runners,
              <br />
              for runners.
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed max-w-lg font-['Inter']">
              We are developers who train while we build. Not experts with
              medals on the wall — just people who understand what it feels like
              to not know where to start.
            </p>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-lime-400/5 border border-lime-400/10" />
              <p className="relative text-zinc-600 text-sm leading-relaxed max-w-xs italic border-l-2 border-lime-400/40 pl-5 font-['Inter']">
                "If you have ever stared at a training plan and had no idea if
                it was right for you — you already know the problems we are
                trying to solve."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Label col */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
              Our Story
            </p>
            <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter">
              I used to hate
              <br />
              running.
            </h2>
          </div>
          {/* Story col */}
          <div className="lg:col-span-2 space-y-4 text-zinc-400 text-sm leading-relaxed font-['Inter']">
            <p>
              I tried many times and failed every time. It felt exhausting,
              painful, and pointless. I never understood why people loved it.
            </p>
            <p>
              In late 2025, I tried something different. Instead of copying a
              generic plan, I described my situation to an AI and asked it to
              design something specifically for me. The plan started slow —
              almost embarrassingly slow. But I trusted it.
            </p>
            <p className="text-zinc-300 font-medium text-base">
              A few days in, something shifted.
            </p>
            <p>
              I was not exhausted. I was not injured. I felt more energized than
              I had in months. For the first time, I began to understand running
              — and I actually wanted to keep going.
            </p>
            <p>
              But the process was still broken. I had to manually organize every
              session. Tracking progress meant nothing. And every time I talked
              to AI, I had to re-explain everything from scratch.
            </p>
            <p className="text-white font-bold text-sm">
              That frustration is what became this app.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-8">
            Mission & Vision
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-3">
                Mission
              </p>
              <p className="text-zinc-300 text-base leading-relaxed font-['Inter']">
                Help people run better, enjoy running more, and understand
                themselves more deeply through training.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-3">
                Vision
              </p>
              <p className="text-zinc-300 text-base leading-relaxed font-['Inter']">
                Build a platform that truly adapts to each person — and reaches
                the people who have struggled with running the most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT MAKES THIS DIFFERENT ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                What Makes This Different
              </p>
              <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter">
                Not just another
                <br />
                fitness app.
              </h2>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Plans built around you",
                  desc: "AI generates a training plan based on your actual data — not a template someone else followed.",
                  accent: "text-lime-400",
                },
                {
                  title: "Progress that actually means something",
                  desc: "Every session is scored on how well you followed the plan, so you always know where you stand.",
                  accent: "text-lime-400",
                },
                {
                  title: "Deeper insights",
                  desc: "Heart rate zones, nutrition context, and recovery awareness — not just distance and time.",
                  accent: "text-violet-400",
                },
                {
                  title: "Gets smarter over time",
                  desc: "Your data builds up automatically. No more repeating yourself every time you ask for guidance.",
                  accent: "text-violet-400",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-current ${item.accent}`}
                  />
                  <p className="text-white text-sm font-black leading-snug">
                    {item.title}
                  </p>
                  <p className="text-zinc-500 text-xs leading-relaxed font-['Inter']">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT THE CREATOR ===== */}
      <section className="w-full border-b border-zinc-800 px-6 lg:px-16 xl:px-24 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-8">
            About the Creator
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Photo + name */}
            <div className="flex flex-col items-start gap-4">
              <img
                src={creatorPhoto}
                alt="Ronnachai Mitkhun"
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-2 border-zinc-700"
              />
              <div>
                <p className="text-white font-black text-xl leading-tight">
                  Ronnachai Mitkhun
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  Fullstack Developer
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fullstack Developer",
                  "Former PM — AI Lab",
                  "Tech Consultant",
                  "Cybersecurity",
                ].map((role) => (
                  <span
                    key={role}
                    className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            {/* Bio */}
            <div className="lg:col-span-2 space-y-4 text-zinc-400 text-sm leading-relaxed font-['Inter']">
              <p>
                Before building this, I spent years working across AI,
                technology consulting, and cybersecurity. I have seen how
                powerful the right tools can be — and how rarely those tools are
                designed for real people with real problems.
              </p>
              <p>
                This app is not a side project born from a hackathon. It came
                from a real problem I had, a process that actually worked, and a
                frustration with having to do everything manually. I built it
                because I needed it — and I think a lot of other people do too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="w-full px-6 lg:px-16 xl:px-24 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-3">
              Start where you are.
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md font-['Inter']">
              You do not need to be a runner. You just need to be willing to try
              — and this time, you will not be doing it alone.
            </p>
          </div>
          <a
            href="/register"
            className="shrink-0 inline-block bg-lime-400 text-black font-black text-sm uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-lime-300 transition-all active:scale-95 shadow-[0_20px_40px_-15px_rgba(163,230,53,0.3)]"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
