import axios from 'axios';
import React, { useState } from 'react'
import { FiCopy, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CLIENT_URL, ServerUrl } from '../App';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const THEMES = [
  "light",
  "dark",
  "glass",
  "neon",
];

const TONES = [
  "friendly",
  "professional",
  "sales",
];

function Builder({ user, setUser }) {

  const [editAssistant, setEditAssistant] = useState(!user?.isSetupComplete)

  const [assistantName, setAssistantName] = useState(user?.assistantName || "");

  const [businessName, setBusinessName] = useState(user?.businessName || "")

  const [businessType, setBusinessType] = useState(user?.businessType || "")

  const [businessDescription, setBusinessDescription] = useState(user?.businessDescription || "")

  const [theme, setTheme] = useState(user?.theme || "dark")
  const [tone, setTone] = useState(user?.tone || "friendly")

  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "")

  const [pages, setPages] = useState(user?.pages || []);

  const [pageName, setPageName] = useState("");

  const [pagePath, setPagePath] = useState("");

  const [pageKeywords, setPageKeywords] = useState("");

  const [loading, setLoading] = useState(false)

  const addPage = () => {
    if (!pageName || !pagePath) return;

    const newPage = {
      name: pageName,
      path: pagePath,
      keywords: pageKeywords.split(",").map((k) => k.trim())
    }

    setPages([...pages, newPage])

    setPageName("")
    setPagePath("")
    setPageKeywords("")

  }

  const removePage = (index) => {
    const updatePages = pages.filter((_, i) => i !== index)

    setPages(updatePages)
  }


  const saveAssistant = async () => {
    setLoading(true)
    try {
      const data = {
        assistantName,
        businessName,
        businessType,
        businessDescription,
        tone,
        theme,
        geminiApiKey,
        pages,
      }

      const res = await axios.post(ServerUrl + "/api/user/save-assistant", data, { withCredentials: true })
      console.log(res.data)
      setUser(res.data.user)
      setEditAssistant(false)
      toast.success("Assistant Saved Successfully")
      setLoading(false)
    } catch (error) {
      toast.error("Failed to save assistant")
      console.log(error)
      setLoading(false)
    }

  }

  const remainingMessages =
    Math.max(
      0,
      (user?.requestLimit || 0) -
      (user?.totalMessages || 0)
    );

  const remainingDays =
    user?.proExpiresAt
      ? Math.max(
        0,
        Math.ceil(
          (
            new Date(
              user.proExpiresAt
            ) - new Date()
          ) /
          (1000 * 60 * 60 * 24)
        )
      )
      : 0;



  const embedCode = `<script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}"></script>`;

  return (
    <div className='min-h-screen brand-surface px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-slate-900'>
            Assistant Builder
          </h2>
          <p className='text-slate-500 mt-1'> Customize your virtual
            assistant</p>
        </div>

        {user.isSetupComplete && !editAssistant && (
          <Card className="p-6 mb-6">

            <p className="text-sm text-slate-400">
              Assistant
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {user.assistantName}
            </h2>

            <p className="text-slate-500 mt-3 leading-7">
              Your assistant is ready
              to use on your website.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>

              <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4'>
                <p className='text-sm text-slate-400'>Current Plan</p>
                <h2 className='text-xl font-bold text-slate-900 mt-1 capitalize'>{user?.plan}</h2>
              </div>

              <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4'>
                <p className='text-sm text-slate-400'>Gemini Status</p>
                <h2 className={`text-xl font-bold mt-1 capitalize ${user?.geminiStatus === "active"
                  ? "text-emerald-600"
                  : user?.geminiStatus === "invalid"
                    ? "text-red-500"
                    : "text-amber-500"
                  }`}>{user?.geminiStatus}</h2>
              </div>

              <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4'>
                <p className='text-sm text-slate-400'>{user?.plan === "free"
                  ? "Messages Left"
                  : "Plan Expiry"}</p>
                <h2 className='text-xl font-bold text-slate-900 mt-1 capitalize'>{user?.plan === "free"
                  ? remainingMessages
                  : `${remainingDays} Days`}</h2>
              </div>
            </div>

            <div className='mt-7'>

              <div className='mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4'>
                <p className='text-sm font-semibold text-amber-900'>
                  Where to paste this script?
                </p>
                <p className='text-sm text-amber-700 mt-2 leading-6'>
                  Paste this script before the closing
                  {" "}
                  <span className="font-semibold">
                    {"</body>"}
                  </span>
                  {" "}
                  tag of your website HTML file.
                  <br />
                  <br />
                  Example:
                </p>

                <pre className='mt-3 bg-[#0b0f1e] text-indigo-300 rounded-xl p-3 text-xs font-mono overflow-x-auto'>
                  {`<body>

  Your Website Content

  <script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}"></script>

</body>`}
                </pre>
              </div>

              <p className='text-sm font-medium text-slate-900 mb-3 mt-3'>Embed Code</p>
            </div>

            <div className='relative'>
              <textarea readOnly value={embedCode} className='w-full h-20 bg-[#0b0f1e] text-indigo-300 rounded-2xl p-4 text-sm font-mono resize-none outline-none' />
              <button onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast.success("Copied")
              }} className='absolute top-4 right-4 w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer'><FiCopy /></button>
            </div>

            <Button onClick={() => setEditAssistant(true)} className="mt-6">Edit Assistant</Button>

          </Card>


        )}

        {editAssistant && <div className='space-y-6'>

          <Card className="p-6">
            <h2 className='text-lg font-semibold mb-5 text-slate-900'>Basic Information</h2>

            <div className='space-y-4'>
              <Input type="text"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                placeholder="Assistant Name" />

              <Input type="text"
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
                placeholder="Business Name" />

              <Input type="text"
                onChange={(e) => setBusinessType(e.target.value)}
                value={businessType}
                placeholder="Business Type" />

              <Textarea
                rows={4}
                onChange={(e) => setBusinessDescription(e.target.value)}
                value={businessDescription}
                placeholder="Business Description" />

            </div>
          </Card>

          <Card className="p-6">
            <h2 className='text-lg font-semibold mb-5 text-slate-900'>
              Appearance
            </h2>

            <div>
              <Label>Theme</Label>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {THEMES.map((item) => (
                  <button key={item}
                    onClick={() => setTheme(item)}
                    className={`py-3 rounded-2xl border-2 capitalize text-sm font-medium transition-colors cursor-pointer ${theme === item
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-200"
                      }`}>{item}
                  </button>
                ))}
              </div>
            </div>


            <div className='mt-6'>
              <Label>Assistant Tone</Label>

              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {TONES.map((item) => (
                  <button key={item}
                    onClick={() => setTone(item)}
                    className={`py-3 rounded-2xl border-2 capitalize text-sm font-medium transition-colors cursor-pointer ${tone === item
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-200"
                      }`}>{item}
                  </button>
                ))}
              </div>
            </div>

          </Card>


          <Card className="p-6">
            <div className='flex items-center justify-between mb-5 gap-4 flex-wrap'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>
                  Gemini API KEY
                </h2>
                <p className='text-sm text-slate-400 mt-1'>
                  Add your Gemini API key to power your assistant
                </p>
              </div>

              <Button as="a" href="https://aistudio.google.com/app/apikey"
                target='_blank'
                rel='noopener noreferrer'
                size="sm">
                Get API KEY
              </Button>
            </div>

            <Input type="password"
              placeholder="AIza..."
              onChange={(e) => setGeminiApiKey(e.target.value)}
              value={geminiApiKey} />

            <p className='text-xs text-slate-400 mt-3 leading-6'>
              Your API key is securely stored and only used for generating AI responses.
            </p>
          </Card>

          <Card className="p-6">
            <div className='flex items-center justify-between mb-5 flex-wrap gap-3'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Navigation Pages</h2>
                <p className='text-sm text-slate-400'>
                  Assistant can redirect users
                </p>
              </div>

              <Button onClick={addPage} size="sm">
                <FiPlus />Add
              </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              <Input type="text" placeholder='Page Name'
                onChange={(e) => setPageName(e.target.value)}
                value={pageName} />

              <Input type="text" placeholder='/pricing'
                onChange={(e) => setPagePath(e.target.value)}
                value={pagePath} />

              <Input type="text" placeholder='Pricing  Plan'
                onChange={(e) => setPageKeywords(e.target.value)}
                value={pageKeywords} />
            </div>

            <div className='mt-5 space-y-3'>
              {
                pages.map((page, index) => (
                  <div key={index}
                    className='flex items-center justify-between border border-slate-100 rounded-2xl p-4 bg-slate-50'>

                    <div>
                      <p className='font-medium text-slate-800'>{page.name}</p>
                      <p className='text-sm text-slate-400'>{page.path}</p>
                    </div>
                    <button onClick={() => removePage(index)} className='text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer'>
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              }
            </div>
          </Card>

          <Button onClick={saveAssistant}
            disabled={loading ||
              !assistantName ||
              !businessName ||
              !businessType ||
              !businessDescription ||
              !geminiApiKey}
            size="lg"
            className="w-full">
            {
              loading ? "Saving..." : user.isSetupComplete ? "Update Assistant" : "Save Assistant"
            }
          </Button>

        </div>}

      </div>

    </div>
  )
}

export default Builder
