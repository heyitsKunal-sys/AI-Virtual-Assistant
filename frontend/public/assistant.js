(function () {

    const script = document.currentScript;

    if (!script) return

    const userId = script.dataset.userId
    const scriptUrl = new URL(script.src, window.location.href)
    const FRONTEND_URL = scriptUrl.origin
    const BACKEND_URL = script.dataset.backendUrl || "https://ai-virtual-assistant-backend-mqd6.onrender.com"

    if (!userId || document.querySelector(".chatplug-popup")) return

    let theme = "dark"

    let assistantConfig = null


    // load CSS

    const link = document.createElement("link")

    link.rel = "stylesheet"

    link.href = `${FRONTEND_URL}/assistant.css`

    document.head.appendChild(link)


    // Create PopUp

    const popup = document.createElement("div")

    popup.className = `chatplug-popup theme-${theme}`

    popup.innerHTML = `
    <div class="chatplug-overlay"></div>

    <div class="chatplug-content">

       <div class="chatplug-top">
            <div class="chatplug-brand-wrap">
                <img class="chatplug-brand-logo" src="${FRONTEND_URL}/chat-plug-logo.png" alt="ChatPlug logo" />
            </div>

            <div class="chatplug-orb-wrap">

                <div class="chatplug-orb-glow"></div>

                <div class="chatplug-orb"></div>

            </div>

            <h2 class="chatplug-title">
                Hello! I'm ChatPlug
            </h2>

            <p class="chatplug-sub">
                Your smart voice assistant.
                <br />
                Ask anything about your website.
            </p>


            <div class="chatplug-status">
                Tap button to Speak
            </div>

            <div class="chatplug-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <!-- User Text -->
            <div class="chatplug-user-text">
            </div>

            <!-- AI Text -->
            <div class="chatplug-ai-text">
            </div>
  
        </div>


        <div class="chatplug-bottom">
            
            <button class="chatplug-mic">

               <img 
               src="${FRONTEND_URL}/mic.svg"
               alt="mic"
               class="chatplug-mic-icon"/>
            </button>
        </div>
    </div>
    
    `;

    document.body.appendChild(popup);

    // floating Button

    const button = document.createElement("button")

    button.className = `chatplug-btn theme-${theme}`

    button.innerHTML = `
    <img 
    src="${FRONTEND_URL}/chat-plug-logo.png"
    alt="ChatPlug logo"
    />`;
    document.body.appendChild(button)




    // toggle popup

    let open = false

    button.onclick = () => {
        open = !open;
        popup.style.display = open ? "flex" : "none";
    }


    // load Assistant

    const buildPageContext = () => {
        const headings = [...document.querySelectorAll("h1, h2, h3, h4")]
            .map((heading) => (heading.textContent || "").trim())
            .filter(Boolean)
            .slice(0, 30)

        const links = [...document.querySelectorAll("a[href]")]
            .map((link) => {
                const href = link.getAttribute("href")
                const label = (link.textContent || link.getAttribute("aria-label") || "").trim()

                if (!href || !label || href.startsWith("#")) return null

                const absoluteHref = href.startsWith("http")
                    ? href
                    : new URL(href, window.location.origin).href

                return {
                    label,
                    href: absoluteHref,
                }
            })
            .filter(Boolean)
            .slice(0, 80)

        const plainText = (document.body?.innerText || "").replace(/\s+/g, " ").trim()

        return {
            title: document.title || "",
            URL: window.location.href,
            pathname: window.location.pathname,
            titleWords: (document.title || "").toLowerCase(),
            headings,
            text: plainText.slice(0, 8000),
            links,
            navLinks: links.filter((link) => {
                const text = link.label.toLowerCase()
                return /home|about|pricing|contact|login|signup|faq|services|blog|settings|privacy|dashboard|profile|billing/.test(text)
            }).slice(0, 20),
        }
    }

    const navigationAliases = {
        home: ["home", "main", "landing", "start", "welcome", "home page", "main page", "landing page"],
        about: ["about", "about us", "company", "our story", "who we are"],
        contact: ["contact", "contact us", "reach us", "get in touch", "support", "help", "call us"],
        pricing: ["pricing", "plans", "plan", "packages", "package", "prices", "cost", "fees", "subscription"],
        services: ["services", "service", "solutions", "offerings"],
        blog: ["blog", "articles", "news", "insights", "posts"],
        faq: ["faq", "questions", "help center", "frequently asked questions"],
        portfolio: ["portfolio", "projects", "work", "case studies"],
        login: ["login", "log in", "sign in", "signin", "account", "my account"],
        signup: ["signup", "register", "create account", "sign up", "join now"],
        settings: ["settings", "profile settings", "preferences", "account settings"],
        privacy: ["privacy", "privacy policy", "terms", "terms and conditions"],
        billing: ["billing", "plans and billing", "payment", "payments", "upgrade", "checkout", "invoice"],
        dashboard: ["dashboard", "admin dashboard", "user dashboard"],
        team: ["team", "our team", "people"],
        testimonials: ["testimonials", "reviews", "feedback", "stories"],
    }

    const findNavigationMatch = (message) => {
        const cleanedMessage = message.toLowerCase().trim()
        if (!cleanedMessage) return null

        const directHome = ["home", "main", "landing", "welcome", "welcome page", "home page", "main page"].some((term) => cleanedMessage.includes(term))
        if (directHome) {
            return {
                label: "Home",
                href: `${window.location.origin}/`,
                score: 999,
            }
        }

        const aliasTerms = new Set()
        Object.entries(navigationAliases).forEach(([, aliases]) => {
            aliases.forEach((alias) => {
                aliasTerms.add(alias)
            })
        })

        const scoreLink = (label, href) => {
            const normalizedLabel = label.toLowerCase()
            const combined = `${normalizedLabel} ${href}`.toLowerCase()
            let score = 0

            if (combined.includes(cleanedMessage)) score += 30

            aliasTerms.forEach((alias) => {
                if (cleanedMessage.includes(alias) && combined.includes(alias)) {
                    score += 18
                }
            })

            cleanedMessage.split(/\s+/).forEach((word) => {
                if (!word) return
                if (combined.includes(word)) score += 2
            })

            return score
        }

        const linkCandidates = [...document.querySelectorAll("a[href]")]
            .map((link) => {
                const href = link.getAttribute("href")
                const label = (link.textContent || link.getAttribute("aria-label") || "").trim()

                if (!href || !label || href.startsWith("#")) return null

                const absoluteHref = href.startsWith("http")
                    ? href
                    : new URL(href, window.location.origin).href

                const score = scoreLink(label, absoluteHref)
                if (score > 0) {
                    return { label, href: absoluteHref, score }
                }

                return null
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)

        const namedPageRoutes = Object.entries(navigationAliases).map(([pageKey, aliases]) => {
            const matchedAlias = aliases.find((alias) => cleanedMessage.includes(alias))
            if (!matchedAlias) return null

            const routeMap = {
                home: "/",
                about: "/about",
                contact: "/contact",
                pricing: "/pricing",
                services: "/services",
                blog: "/blog",
                faq: "/faq",
                portfolio: "/portfolio",
                login: "/login",
                signup: "/signup",
                settings: "/settings",
                privacy: "/privacy",
                billing: "/billing",
                dashboard: "/dashboard",
                team: "/team",
                testimonials: "/testimonials",
            }

            return {
                label: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
                href: `${window.location.origin}${routeMap[pageKey] || "/"}`,
                score: 100,
            }
        }).filter(Boolean)

        const headingCandidates = [...document.querySelectorAll("h1, h2, h3")]
            .map((heading) => {
                const text = (heading.textContent || "").trim()
                if (!text) return null

                const anchor = heading.closest("a")
                const href = anchor?.getAttribute("href")
                if (!href) return null

                const score = scoreLink(text, href)
                if (score > 0) {
                    return {
                        label: text,
                        href: href.startsWith("http") ? href : new URL(href, window.location.origin).href,
                        score,
                    }
                }

                return null
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)

        const candidates = [...namedPageRoutes, ...linkCandidates, ...headingCandidates]
        return candidates.length ? candidates.sort((a, b) => b.score - a.score)[0] : null
    }

    const loadAssistant = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/assistant/config/${encodeURIComponent(userId)}`)

            const data = await res.json()

            if (data) {
                assistantConfig = data.user
                applyConfig()
            }

        } catch (error) {
            console.log(
                "Assistant Load Error:",
                error
            );
        }
    }

    const refreshAssistantConfig = async () => {
        if (!userId) return

        try {
            const res = await fetch(`${BACKEND_URL}/api/assistant/config/${encodeURIComponent(userId)}`, {
                cache: "no-store",
            })
            const data = await res.json()
            const nextConfig = data?.user

            if (!nextConfig) return

            const configChanged = !assistantConfig
                || assistantConfig.theme !== nextConfig.theme
                || assistantConfig.assistantName !== nextConfig.assistantName
                || assistantConfig.businessName !== nextConfig.businessName

            if (configChanged) {
                assistantConfig = nextConfig
                applyConfig()
            }
        } catch (error) {
            console.log("Assistant Config Refresh Error:", error)
        }
    }


    const applyTheme = (nextTheme = "dark") => {
        theme = nextTheme || "dark"
        popup.className = `chatplug-popup theme-${theme}`
        button.className = `chatplug-btn theme-${theme}`

        const brandLogo = popup.querySelector(".chatplug-brand-logo")
        if (brandLogo) {
            brandLogo.src = `${FRONTEND_URL}/chat-plug-logo.png`
        }
    }

    const applyConfig = () => {
        if (!assistantConfig) return;

        applyTheme(assistantConfig.theme || "dark")

        const title = popup.querySelector(".chatplug-title")

                title.textContent = `Hello! I'm ${assistantConfig.assistantName || "ChatPlug"}`;

        const subTitle = popup.querySelector(".chatplug-sub")
                subTitle.textContent = `Welcome to ${assistantConfig.businessName || "your website"}. Ask anything about your website.`;


    }

    loadAssistant()
    setInterval(refreshAssistantConfig, 30000)


    // Element


    const status =
        popup.querySelector(
            ".chatplug-status"
        );

    const wave =
        popup.querySelector(
            ".chatplug-wave"
        );

    const userText =
        popup.querySelector(
            ".chatplug-user-text"
        );

    const aiText =
        popup.querySelector(
            ".chatplug-ai-text"
        );

    const mic =
        popup.querySelector(
            ".chatplug-mic"
        );



    // text-speech

    const speak = (text) => {
        window.speechSynthesis.cancel();

        // Show AI response
        aiText.innerText =
            text;

        status.innerText =
            "AI Speaking...";

        const speech = new SpeechSynthesisUtterance(text)

        speech.lang =
            "hi-IN";

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;

        // Voice end
        speech.onend = () => {

            status.innerText =
                "Tap button to Speak";

            wave.style.opacity =
                "0";
        };

        // Start speaking
        window.speechSynthesis.speak(
            speech
        );
    }


    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition


    if (SpeechRecognition) {

        const recognition = new SpeechRecognition();

        recognition.lang =
            "en-US";

        recognition.continuous =
            false;

        recognition.interimResults =
            false;


        mic.onclick = () => {
            wave.style.opacity =
                "1";

            status.innerText =
                "Listening...";

            userText.innerText =
                "";

            aiText.innerText =
                "";

            recognition.start();
        }


        recognition.onresult = (e) => {
            const text = e.results[0][0].transcript

            userText.innerText = "You: " + text;

            recognition.stop();


            setTimeout(async () => {
                try {
                    status.innerText = "Thinking...";


                    const navigationTarget = findNavigationMatch(text)
                    const pageContext = buildPageContext()

                    const res = await fetch(`${BACKEND_URL}/api/assistant/ask`, {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            message: text,
                            userId,
                            currentUrl: window.location.href,
                            currentPath: window.location.pathname,
                            pageContext: JSON.stringify(pageContext),
                            navigationTarget: navigationTarget ? {
                                path: new URL(navigationTarget.href).pathname,
                                label: navigationTarget.label,
                            } : null,
                        })
                    })

                    const data = await res.json()
                    console.log(data)

                    if (data.success) {

                        if (data.action === "navigate") {
                            speak(data.response)

                            if (window.location.pathname !== data.path) {
                                setTimeout(() => {
                                    window.location.href = data.path
                                }, 1500)
                            }
                        } else {
                            speak(data.aiResponse || data.response || "I can help with pricing, support, login, billing, or website navigation.")
                        }

                    } else {
                        speak("I can help with pricing, support, login, billing, or website navigation.")

                    }



                } catch (error) {
                    console.log(error)
                    speak("AI Server Error")

                }
            }, 600)
        };

        recognition.onerror = () => {
            status.innerText =
                "Tap button to Speak";

            wave.style.opacity =
                "0";
        }


    }
    else {
        status.innerText =
            "Speech Recognition not supported";
    }


})();