
import { useNavigate } from 'react-router-dom'
import AssistantPreview from '../Components/AssistantPreview'
import Logo from '../Components/Logo'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi'

const STEPS = [
  {
    step: "01",
    title: "Create your account",
    desc: "Sign in with Google and your workspace is ready instantly — no setup forms.",
  },
  {
    step: "02",
    title: "Shape its personality",
    desc: "Pick a name, a tone of voice and a visual theme that matches your brand.",
  },
  {
    step: "03",
    title: "Teach it your business",
    desc: "Feed it the details it needs to answer like a real member of your team.",
  },
  {
    step: "04",
    title: "Go live in one line",
    desc: "Paste a single script tag into your site and it's talking to visitors.",
  },
];

const HIGHLIGHTS = [
  "Understands and speaks naturally in real time",
  "Guides visitors to the right page on command",
  "Trained on your business, not a generic script",
];

function Home({ user }) {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen brand-surface overflow-hidden'>

      <section className='relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 lg:pt-20 pb-24'>

        <div className="absolute top-0 left-1/4 w-[320px] h-[320px] bg-indigo-200/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] bg-blue-200/40 blur-3xl rounded-full" />

        <div className='relative max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center'>

          <div>
            <Badge className="shadow-sm">
              <span className='w-2 h-2 bg-indigo-500 rounded-full' />
              Live voice AI, zero code
            </Badge>

            <h1 className='mt-8 text-[38px] leading-[46px] sm:text-6xl sm:leading-[68px] font-black tracking-[-0.03em] text-slate-900'>
              Turn your website into a{" "}
              <span className="brand-gradient-text">conversation</span>
            </h1>

            <p className='mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl'>
              ChatPlug is a voice-enabled assistant you drop into your site. It listens,
              understands your visitors, and helps them find what they came for —
              without them ever leaving the page.
            </p>

            <ul className="mt-7 space-y-3">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-1 h-5 w-5 rounded-full brand-gradient flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-9'>
              <Button size="lg" onClick={() => navigate("/builder")} className="w-full sm:w-auto">
                <HiOutlineSparkles className="text-lg" />
                Create Your Assistant
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto gap-1.5">
                See how it works <HiOutlineArrowRight />
              </Button>
            </div>

            <p className='mt-5 text-xs sm:text-sm text-slate-400'>
              Starts free — 200 AI responses included, no card required.
            </p>
          </div>

          <AssistantPreview />

        </div>

      </section>

      <section className='px-4 sm:px-6 lg:px-8 py-20 bg-white'>

        <div className='max-w-6xl mx-auto'>

          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14'>
            <div>
              <h2 className='text-3xl sm:text-4xl font-bold text-slate-900'>
                Launch in four simple steps
              </h2>
              <p className='text-slate-500 mt-3 text-sm sm:text-base max-w-md'>
                No code, no dev ticket, no waiting on an integration team.
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
            {STEPS.map((s, i) => (
              <div key={i} className='relative group bg-slate-50 hover:bg-white border border-slate-100 rounded-[28px] p-7 transition-all hover:shadow-[0_15px_50px_rgba(15,20,36,0.06)] hover:border-indigo-100'>
                <div className="flex items-center justify-between">
                  <span className='text-3xl font-black brand-gradient-text'>{s.step}</span>
                  {i < STEPS.length - 1 && (
                    <span className="hidden xl:block text-slate-200 text-xl">—</span>
                  )}
                </div>
                <h3 className='mt-5 text-lg font-semibold text-slate-900'>{s.title}</h3>
                <p className='mt-3 text-sm text-slate-500 leading-relaxed'>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto rounded-[32px] brand-gradient p-10 sm:p-14 text-center shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white relative">
            Your website is missing a voice. Give it one today.
          </h2>
          <p className="text-white/80 mt-3 max-w-xl mx-auto relative text-sm sm:text-base">
            Set it up in minutes, embed it with one script tag, and let ChatPlug handle the rest.
          </p>
          <Button size="lg" variant="white" onClick={() => navigate("/builder")} className="mt-7 relative">
            Get Started Free
          </Button>
        </div>
      </section>

      <footer className='bg-[#0b0f1e] px-6 py-10'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left'>
          <div>
            <button onClick={() => navigate("/")} className="cursor-pointer">
              <Logo dark />
            </button>
            <p className="text-slate-400 text-sm mt-2">
              The voice layer for modern websites.
            </p>
          </div>

          <p className='text-slate-500 text-sm'>
            © {new Date().getFullYear()} ChatPlug. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Home
