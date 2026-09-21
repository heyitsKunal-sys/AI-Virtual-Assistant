import axios from 'axios';
import React, { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (user?.theme) setTheme(user.theme)
    if (user?.tone) setTone(user.tone)
  }, [user?.theme, user?.tone])

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme)
    setUser((prev) => prev ? { ...prev, theme: nextTheme } : prev)
  }

  const [provider, setProvider] = useState(user?.provider || "gemini")

  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "")

  const [openAiApiKey, setOpenAiApiKey] = useState(user?.openAiApiKey || "")

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
        provider,
        geminiApiKey,
        openAiApiKey,
        pages,
      }

      const res = await axios.post(
        ServerUrl + "/api/user/save-assistant",
        data,
        { withCredentials: true }
      )

      console.log(res.data)
      setUser(res.data.user)
      setTheme(res.data.user.theme || theme)
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


  const embedCode =
    `<script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}" data-backend-url="${ServerUrl}"></script>`;


  return (
    <div className='min-h-screen bg-[#F7F4EE] px-4 py-8'>

      <div className='max-w-4xl mx-auto'>

        {/* HEADER */}

        <div className='mb-8'>

          <h2 className='text-3xl font-bold text-[#292722]'>
            Assistant Builder
          </h2>

          <p className='text-[#746F67] mt-1'>
            Customize your virtual assistant
          </p>

        </div>


        {/* EXISTING ASSISTANT */}

        {user.isSetupComplete && !editAssistant && (

          <Card className="
            p-6 mb-6
            bg-[#FFFCF7]
            border-[#DDD7CE]
            shadow-[0_8px_25px_rgba(72,58,45,0.05)]
          ">

            <p className="text-sm text-[#918A80]">
              Assistant
            </p>

            <h2 className="text-3xl font-bold text-[#292722] mt-1">
              {user.assistantName}
            </h2>

            <p className="text-[#746F67] mt-3 leading-7">
              Your assistant is ready
              to use on your website.
            </p>


            {/* STATS */}

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>

              <div className='rounded-2xl border border-[#E2DCD3] bg-[#F5F1EA] p-4'>

                <p className='text-sm text-[#918A80]'>
                  Current Plan
                </p>

                <h2 className='text-xl font-bold text-[#292722] mt-1 capitalize'>
                  {user?.plan}
                </h2>

              </div>


              <div className='rounded-2xl border border-[#E2DCD3] bg-[#F5F1EA] p-4'>

                <p className='text-sm text-[#918A80]'>
                  Gemini Status
                </p>

                <h2
                  className={`text-xl font-bold mt-1 capitalize ${
                    user?.geminiStatus === "active"
                      ? "text-[#5B8C65]"
                      : user?.geminiStatus === "invalid"
                        ? "text-[#C85D3F]"
                        : "text-[#B77A32]"
                  }`}
                >
                  {user?.geminiStatus}
                </h2>

              </div>


              <div className='rounded-2xl border border-[#E2DCD3] bg-[#F5F1EA] p-4'>

                <p className='text-sm text-[#918A80]'>

                  {user?.plan === "free"
                    ? "Messages Left"
                    : "Plan Expiry"}

                </p>

                <h2 className='text-xl font-bold text-[#292722] mt-1 capitalize'>

                  {user?.plan === "free"
                    ? remainingMessages
                    : `${remainingDays} Days`}

                </h2>

              </div>

            </div>


            {/* EMBED INFORMATION */}

            <div className='mt-7'>

              <div className='mt-4 rounded-2xl bg-[#F8EDE7] border border-[#E5C9BC] p-4'>

                <p className='text-sm font-semibold text-[#6B3D2D]'>
                  Where to paste this script?
                </p>

                <p className='text-sm text-[#8C5945] mt-2 leading-6'>

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


                <pre className='
                  mt-3
                  bg-[#292722]
                  text-[#E6A27C]
                  rounded-xl
                  p-3
                  text-xs
                  font-mono
                  overflow-x-auto
                '>

                  {`<body>

  Your Website Content

  <script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}" data-backend-url="${ServerUrl}"></script>

</body>`}

                </pre>

              </div>

              <p className='text-sm font-medium text-[#292722] mb-3 mt-3'>
                Embed Code
              </p>

            </div>


            <div className='relative'>

              <textarea
                readOnly
                value={embedCode}
                className='
                  w-full
                  h-20
                  bg-[#292722]
                  text-[#E6A27C]
                  rounded-2xl
                  p-4
                  text-sm
                  font-mono
                  resize-none
                  outline-none
                '
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(embedCode);
                  toast.success("Copied")
                }}
                className='
                  absolute
                  top-4
                  right-4
                  w-10
                  h-10
                  rounded-xl
                  bg-[#FFFCF7]
                  shadow-sm
                  border
                  border-[#DDD7CE]
                  flex
                  items-center
                  justify-center
                  text-[#655F56]
                  hover:bg-[#F5F1EA]
                  transition-colors
                  cursor-pointer
                '
              >
                <FiCopy />
              </button>

            </div>


            <Button
              onClick={() => setEditAssistant(true)}
              className="
                mt-6
                bg-[#292722]
                hover:bg-[#3A3731]
                text-white
              "
            >
              Edit Assistant
            </Button>

          </Card>
        )}


        {/* EDIT ASSISTANT */}

        {editAssistant && (

          <div className='space-y-6'>


            {/* BASIC INFORMATION */}

            <Card className="
              p-6
              bg-[#FFFCF7]
              border-[#DDD7CE]
              shadow-[0_8px_25px_rgba(72,58,45,0.05)]
            ">

              <h2 className='text-lg font-semibold mb-5 text-[#292722]'>
                Basic Information
              </h2>

              <div className='space-y-4'>

                <Input
                  type="text"
                  onChange={(e) => setAssistantName(e.target.value)}
                  value={assistantName}
                  placeholder="Assistant Name"
                />

                <Input
                  type="text"
                  onChange={(e) => setBusinessName(e.target.value)}
                  value={businessName}
                  placeholder="Business Name"
                />

                <Input
                  type="text"
                  onChange={(e) => setBusinessType(e.target.value)}
                  value={businessType}
                  placeholder="Business Type"
                />

                <Textarea
                  rows={4}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  value={businessDescription}
                  placeholder="Business Description"
                />

              </div>

            </Card>


            {/* APPEARANCE */}

            <Card className="
              p-6
              bg-[#FFFCF7]
              border-[#DDD7CE]
              shadow-[0_8px_25px_rgba(72,58,45,0.05)]
            ">

              <h2 className='text-lg font-semibold mb-5 text-[#292722]'>
                Appearance
              </h2>


              <div>

                <Label className="text-[#655F56]">
                  Theme
                </Label>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2'>

                  {THEMES.map((item) => (

                    <button
                      key={item}
                      onClick={() => handleThemeChange(item)}
                      className={`
                        py-3
                        rounded-2xl
                        border-2
                        capitalize
                        text-sm
                        font-medium
                        transition-colors
                        cursor-pointer

                        ${
                          theme === item
                            ? "border-[#D97757] bg-[#F8EDE7] text-[#C85D3F]"
                            : "border-[#DDD7CE] text-[#655F56] hover:border-[#D8B7A8]"
                        }
                      `}
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>


              <div className='mt-6'>

                <Label className="text-[#655F56]">
                  Assistant Tone
                </Label>

                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2'>

                  {TONES.map((item) => (

                    <button
                      key={item}
                      onClick={() => setTone(item)}
                      className={`
                        py-3
                        rounded-2xl
                        border-2
                        capitalize
                        text-sm
                        font-medium
                        transition-colors
                        cursor-pointer

                        ${
                          tone === item
                            ? "border-[#D97757] bg-[#F8EDE7] text-[#C85D3F]"
                            : "border-[#DDD7CE] text-[#655F56] hover:border-[#D8B7A8]"
                        }
                      `}
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>

            </Card>


            {/* AI PROVIDER */}

            <Card className="
              p-6
              bg-[#FFFCF7]
              border-[#DDD7CE]
              shadow-[0_8px_25px_rgba(72,58,45,0.05)]
            ">

              <div className='flex items-center justify-between mb-5 gap-4 flex-wrap'>

                <div>

                  <h2 className='text-lg font-semibold text-[#292722]'>
                    AI Provider
                  </h2>

                  <p className='text-sm text-[#918A80] mt-1'>
                    Choose which AI service powers your assistant
                  </p>

                </div>

              </div>


              <div className='grid grid-cols-2 gap-3 mb-5'>

                <button
                  type="button"
                  onClick={() => setProvider("gemini")}
                  className={`
                    py-3
                    rounded-2xl
                    border-2
                    capitalize
                    text-sm
                    font-medium
                    transition-colors
                    cursor-pointer

                    ${
                      provider === "gemini"
                        ? "border-[#D97757] bg-[#F8EDE7] text-[#C85D3F]"
                        : "border-[#DDD7CE] text-[#655F56] hover:border-[#D8B7A8]"
                    }
                  `}
                >
                  Gemini
                </button>


                <button
                  type="button"
                  onClick={() => setProvider("openai")}
                  className={`
                    py-3
                    rounded-2xl
                    border-2
                    capitalize
                    text-sm
                    font-medium
                    transition-colors
                    cursor-pointer

                    ${
                      provider === "openai"
                        ? "border-[#D97757] bg-[#F8EDE7] text-[#C85D3F]"
                        : "border-[#DDD7CE] text-[#655F56] hover:border-[#D8B7A8]"
                    }
                  `}
                >
                  OpenAI
                </button>

              </div>


              {provider === "gemini" ? (

                <>

                  <div className='flex items-center justify-between mb-3 gap-4 flex-wrap'>

                    <h3 className='text-md font-semibold text-[#292722]'>
                      Gemini API KEY
                    </h3>

                    <Button
                      as="a"
                      href="https://aistudio.google.com/app/apikey"
                      target='_blank'
                      rel='noopener noreferrer'
                      size="sm"
                      className="
                        bg-[#D97757]
                        hover:bg-[#C96442]
                        text-white
                      "
                    >
                      Get API KEY
                    </Button>

                  </div>

                  <Input
                    type="password"
                    placeholder="AIza..."
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    value={geminiApiKey}
                  />

                </>

              ) : (

                <>

                  <div className='flex items-center justify-between mb-3 gap-4 flex-wrap'>

                    <h3 className='text-md font-semibold text-[#292722]'>
                      OpenAI API KEY
                    </h3>

                    <Button
                      as="a"
                      href="https://platform.openai.com/api-keys"
                      target='_blank'
                      rel='noopener noreferrer'
                      size="sm"
                      className="
                        bg-[#D97757]
                        hover:bg-[#C96442]
                        text-white
                      "
                    >
                      Get API KEY
                    </Button>

                  </div>

                  <Input
                    type="password"
                    placeholder="sk-..."
                    onChange={(e) => setOpenAiApiKey(e.target.value)}
                    value={openAiApiKey}
                  />

                </>

              )}


              <p className='text-xs text-[#918A80] mt-3 leading-6'>
                Your API key is securely stored and only used for generating AI responses.
              </p>

            </Card>


            {/* NAVIGATION PAGES */}

            <Card className="
              p-6
              bg-[#FFFCF7]
              border-[#DDD7CE]
              shadow-[0_8px_25px_rgba(72,58,45,0.05)]
            ">

              <div className='flex items-center justify-between mb-5 flex-wrap gap-3'>

                <div>

                  <h2 className='text-lg font-semibold text-[#292722]'>
                    Navigation Pages
                  </h2>

                  <p className='text-sm text-[#918A80]'>
                    Assistant can redirect users
                  </p>

                </div>


                <Button
                  onClick={addPage}
                  size="sm"
                  className="
                    bg-[#292722]
                    hover:bg-[#3A3731]
                    text-white
                  "
                >
                  <FiPlus />
                  Add
                </Button>

              </div>


              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>

                <Input
                  type="text"
                  placeholder='Page Name'
                  onChange={(e) => setPageName(e.target.value)}
                  value={pageName}
                />

                <Input
                  type="text"
                  placeholder='/pricing'
                  onChange={(e) => setPagePath(e.target.value)}
                  value={pagePath}
                />

                <Input
                  type="text"
                  placeholder='Pricing  Plan'
                  onChange={(e) => setPageKeywords(e.target.value)}
                  value={pageKeywords}
                />

              </div>


              <div className='mt-5 space-y-3'>

                {pages.map((page, index) => (

                  <div
                    key={index}
                    className='
                      flex
                      items-center
                      justify-between
                      border
                      border-[#E2DCD3]
                      rounded-2xl
                      p-4
                      bg-[#F5F1EA]
                    '
                  >

                    <div>

                      <p className='font-medium text-[#34312C]'>
                        {page.name}
                      </p>

                      <p className='text-sm text-[#918A80]'>
                        {page.path}
                      </p>

                    </div>


                    <button
                      onClick={() => removePage(index)}
                      className='
                        text-[#C85D3F]
                        hover:text-[#A94731]
                        p-2
                        rounded-lg
                        hover:bg-[#F3E4DD]
                        transition-colors
                        cursor-pointer
                      '
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                ))}

              </div>

            </Card>


            {/* SAVE */}

            <Button
              onClick={saveAssistant}
              disabled={
                loading ||
                !assistantName ||
                !businessName ||
                !businessType ||
                !businessDescription ||
                !(provider === "gemini"
                  ? geminiApiKey
                  : openAiApiKey)
              }
              size="lg"
              className="
                w-full
                bg-[#292722]
                hover:bg-[#3A3731]
                text-white
              "
            >
              {
                loading
                  ? "Saving..."
                  : user.isSetupComplete
                    ? "Update Assistant"
                    : "Save Assistant"
              }
            </Button>

          </div>
        )}

      </div>

    </div>
  )
}

export default Builder