(function () {

    const script = document.currentScript;

    if (!script) return;

    const userId = script.dataset.userId;

    const scriptUrl = new URL(
        script.src,
        window.location.href
    );

    const FRONTEND_URL = scriptUrl.origin;

    const BACKEND_URL =
        script.dataset.backendUrl ||
        "https://ai-virtual-assistant-backend-mqd6.onrender.com";

    if (!userId || document.querySelector(".chatplug-popup")) {
        return;
    }


    // =========================================================
    // STATE
    // =========================================================

    let theme = "dark";

    let assistantConfig = null;


    // =========================================================
    // LOAD CSS
    // =========================================================

    const link = document.createElement("link");

    link.rel = "stylesheet";

    link.href = `${FRONTEND_URL}/assistant.css`;

    document.head.appendChild(link);


    // =========================================================
    // CREATE POPUP
    // =========================================================

    const popup = document.createElement("div");

    popup.className = `chatplug-popup theme-${theme}`;

    popup.innerHTML = `
        <div class="chatplug-overlay"></div>

        <div class="chatplug-content">

            <div class="chatplug-top">

                <div class="chatplug-brand-wrap">

                    <img
                        class="chatplug-brand-logo"
                        src="${FRONTEND_URL}/chat-plug-logo.png"
                        alt="ChatPlug logo"
                    />

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
                    Ask anything about this website.
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
                    <span></span>

                </div>


                <div class="chatplug-user-text"></div>

                <div class="chatplug-ai-text"></div>

            </div>


            <div class="chatplug-bottom">

                <button class="chatplug-mic">

                    <img
                        src="${FRONTEND_URL}/mic.svg"
                        alt="mic"
                        class="chatplug-mic-icon"
                    />

                </button>

            </div>

        </div>
    `;

    document.body.appendChild(popup);


    // =========================================================
    // FLOATING BUTTON
    // =========================================================

    const button = document.createElement("button");

    button.className = `chatplug-btn theme-${theme}`;

    button.innerHTML = `
        <img
            src="${FRONTEND_URL}/chat-plug-logo.png"
            alt="ChatPlug logo"
        />
    `;

    document.body.appendChild(button);


    // =========================================================
    // POPUP TOGGLE
    // =========================================================

    let open = false;

    button.onclick = () => {

        open = !open;

        popup.style.display = open
            ? "flex"
            : "none";

    };


    // =========================================================
    // WEBSITE CONTEXT
    // =========================================================

    const buildPageContext = () => {

        const headings = [
            ...document.querySelectorAll(
                "h1, h2, h3, h4, h5, h6"
            )
        ]
            .map(
                (heading) =>
                    (heading.textContent || "").trim()
            )
            .filter(Boolean)
            .slice(0, 50);


        const links = [
            ...document.querySelectorAll("a[href]")
        ]
            .map((link) => {

                const href =
                    link.getAttribute("href");

                const label =
                    (
                        link.textContent ||
                        link.getAttribute("aria-label") ||
                        link.getAttribute("title") ||
                        ""
                    ).trim();


                if (
                    !href ||
                    !label ||
                    href.startsWith("#") ||
                    href.startsWith("javascript:")
                ) {
                    return null;
                }


                try {

                    const absoluteUrl =
                        new URL(
                            href,
                            window.location.href
                        );


                    return {

                        label,

                        href: absoluteUrl.href,

                        path: absoluteUrl.pathname

                    };

                } catch {

                    return null;

                }

            })
            .filter(Boolean)
            .slice(0, 100);


        const plainText =
            (
                document.body?.innerText ||
                ""
            )
                .replace(/\s+/g, " ")
                .trim();


        return {

            title:
                document.title || "",

            URL:
                window.location.href,

            pathname:
                window.location.pathname,

            headings,

            text:
                plainText.slice(0, 12000),

            links,

            navLinks:
                links
                    .filter((link) => {

                        const text =
                            link.label.toLowerCase();

                        return /home|about|pricing|contact|login|signup|faq|services|blog|settings|privacy|dashboard|profile|billing|cart|checkout|features|products|portfolio|team/
                            .test(text);

                    })
                    .slice(0, 30)

        };

    };


    // =========================================================
    // BUILD WEBSITE MAP
    // =========================================================

    const buildSiteMap = () => {

        const links = [
            ...document.querySelectorAll("a[href]")
        ];


        const pages = links
            .map((link) => {

                const href =
                    link.getAttribute("href");

                const label =
                    (
                        link.textContent ||
                        link.getAttribute("aria-label") ||
                        link.getAttribute("title") ||
                        ""
                    ).trim();


                if (
                    !href ||
                    !label ||
                    href.startsWith("#") ||
                    href.startsWith("javascript:")
                ) {
                    return null;
                }


                try {

                    const url =
                        new URL(
                            href,
                            window.location.href
                        );


                    // Only pages belonging to the same website
                    if (
                        url.origin !== window.location.origin
                    ) {
                        return null;
                    }


                    return {

                        label,

                        path:
                            url.pathname,

                        url:
                            url.href

                    };

                } catch {

                    return null;

                }

            })
            .filter(Boolean);


        const uniquePages =
            new Map();


        pages.forEach((page) => {

            if (!uniquePages.has(page.path)) {

                uniquePages.set(
                    page.path,
                    page
                );

            }

        });


        return [
            ...uniquePages.values()
        ].slice(0, 100);

    };


    // =========================================================
    // EXPLICIT NAVIGATION DETECTION
    // =========================================================

    const isExplicitNavigationRequest = (message) => {

        const text =
            message.toLowerCase().trim();


        const navigationPatterns = [

            /\bgo to\b/,

            /\bgo on\b/,

            /\bopen\b/,

            /\bnavigate to\b/,

            /\btake me to\b/,

            /\bbring me to\b/,

            /\bvisit\b/,

            /\bredirect me to\b/,

            /\bmove me to\b/,

            /\btake me\b.*\bpage\b/,

            /\bshow me\b.*\bpage\b/,

            /\bswitch to\b/,

            /\bgo back\b/,

            /\breturn to\b/

        ];


        return navigationPatterns.some(
            (pattern) =>
                pattern.test(text)
        );

    };


    // =========================================================
    // NAVIGATION ALIASES
    // =========================================================

    const navigationAliases = {

        home: [
            "home",
            "homepage",
            "home page",
            "main page",
            "landing page",
            "main"
        ],

        about: [
            "about",
            "about us",
            "our story",
            "company",
            "who we are"
        ],

        contact: [
            "contact",
            "contact us",
            "reach us",
            "get in touch",
            "support"
        ],

        pricing: [
            "pricing",
            "pricing page",
            "plans",
            "packages",
            "prices"
        ],

        services: [
            "services",
            "service",
            "solutions",
            "offerings"
        ],

        blog: [
            "blog",
            "articles",
            "news",
            "posts"
        ],

        faq: [
            "faq",
            "faq page",
            "frequently asked questions",
            "help center"
        ],

        portfolio: [
            "portfolio",
            "projects",
            "our work",
            "case studies"
        ],

        login: [
            "login",
            "log in",
            "sign in",
            "signin",
            "login page"
        ],

        signup: [
            "signup",
            "sign up",
            "register",
            "registration",
            "create account"
        ],

        settings: [
            "settings",
            "settings page",
            "account settings",
            "preferences"
        ],

        privacy: [
            "privacy",
            "privacy policy",
            "terms",
            "terms and conditions"
        ],

        billing: [
            "billing",
            "billing page",
            "billing section"
        ],

        dashboard: [
            "dashboard",
            "dashboard page"
        ],

        profile: [
            "profile",
            "profile page",
            "my profile"
        ],

        cart: [
            "cart",
            "shopping cart",
            "cart page"
        ],

        checkout: [
            "checkout",
            "checkout page"
        ],

        features: [
            "features",
            "feature page",
            "benefits"
        ]

    };


    // =========================================================
    // FIND NAVIGATION TARGET
    // =========================================================

    const findNavigationMatch = (message) => {

        const cleanedMessage =
            message.toLowerCase().trim();


        const siteMap =
            buildSiteMap();


        // -----------------------------------------------------
        // 1. Match actual website links
        // -----------------------------------------------------

        const linkCandidates =
            siteMap
                .map((page) => {

                    const combined =
                        `${page.label} ${page.path}`
                            .toLowerCase();


                    let score = 0;


                    if (
                        cleanedMessage.includes(
                            combined
                        )
                    ) {
                        score += 100;
                    }


                    const words =
                        cleanedMessage
                            .split(/\s+/)
                            .filter(Boolean);


                    words.forEach((word) => {

                        if (
                            word.length > 2 &&
                            combined.includes(word)
                        ) {

                            score += 3;

                        }

                    });


                    return {

                        ...page,

                        score

                    };

                })
                .filter(
                    (page) =>
                        page.score > 0
                );


        // -----------------------------------------------------
        // 2. Alias matching
        // -----------------------------------------------------

        const aliasCandidates = [];


        Object.entries(
            navigationAliases
        ).forEach(
            ([pageKey, aliases]) => {

                const matchedAlias =
                    aliases.find(
                        (alias) =>
                            cleanedMessage.includes(
                                alias
                            )
                    );


                if (!matchedAlias) {
                    return;
                }


                const sitePage =
                    siteMap.find(
                        (page) => {

                            const combined =
                                `${page.label} ${page.path}`
                                    .toLowerCase();

                            return aliases.some(
                                (alias) =>
                                    combined.includes(
                                        alias
                                    )
                            );

                        }
                    );


                if (sitePage) {

                    aliasCandidates.push({

                        ...sitePage,

                        score: 80

                    });

                    return;

                }


                const fallbackRoutes = {

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

                    profile: "/profile",

                    cart: "/cart",

                    checkout: "/checkout",

                    features: "/features"

                };


                if (
                    fallbackRoutes[pageKey]
                ) {

                    aliasCandidates.push({

                        label:
                            pageKey
                                .charAt(0)
                                .toUpperCase() +
                            pageKey.slice(1),

                        path:
                            fallbackRoutes[pageKey],

                        url:
                            `${window.location.origin}${fallbackRoutes[pageKey]}`,

                        score: 60

                    });

                }

            }
        );


        const candidates = [

            ...aliasCandidates,

            ...linkCandidates

        ];


        if (!candidates.length) {
            return null;
        }


        candidates.sort(
            (a, b) =>
                b.score - a.score
        );


        return candidates[0];

    };


    // =========================================================
    // LOAD ASSISTANT CONFIG
    // =========================================================

    const loadAssistant = async () => {

        try {

            const res =
                await fetch(
                    `${BACKEND_URL}/api/assistant/config/${encodeURIComponent(userId)}`
                );


            const data =
                await res.json();


            if (data?.user) {

                assistantConfig =
                    data.user;

                applyConfig();

            }

        } catch (error) {

            console.log(
                "Assistant Load Error:",
                error
            );

        }

    };


    // =========================================================
    // REFRESH ASSISTANT CONFIG
    // =========================================================

    const refreshAssistantConfig =
        async () => {

            if (!userId) return;


            try {

                const res =
                    await fetch(
                        `${BACKEND_URL}/api/assistant/config/${encodeURIComponent(userId)}`,
                        {
                            cache: "no-store"
                        }
                    );


                const data =
                    await res.json();


                const nextConfig =
                    data?.user;


                if (!nextConfig) {
                    return;
                }


                const configChanged =
                    !assistantConfig ||

                    assistantConfig.theme !==
                    nextConfig.theme ||

                    assistantConfig.assistantName !==
                    nextConfig.assistantName ||

                    assistantConfig.businessName !==
                    nextConfig.businessName;


                if (configChanged) {

                    assistantConfig =
                        nextConfig;

                    applyConfig();

                }

            } catch (error) {

                console.log(
                    "Assistant Config Refresh Error:",
                    error
                );

            }

        };


    // =========================================================
    // APPLY THEME
    // =========================================================

    const applyTheme =
        (nextTheme = "dark") => {

            theme =
                nextTheme || "dark";


            popup.className =
                `chatplug-popup theme-${theme}`;


            button.className =
                `chatplug-btn theme-${theme}`;

        };


    // =========================================================
    // APPLY CONFIG
    // =========================================================

    const applyConfig = () => {

        if (!assistantConfig) {
            return;
        }


        applyTheme(
            assistantConfig.theme ||
            "dark"
        );


        const title =
            popup.querySelector(
                ".chatplug-title"
            );


        if (title) {

            title.textContent =
                `Hello! I'm ${
                    assistantConfig.assistantName ||
                    "ChatPlug"
                }`;

        }


        const subTitle =
            popup.querySelector(
                ".chatplug-sub"
            );


        if (subTitle) {

            subTitle.innerHTML =
                `Welcome to ${
                    assistantConfig.businessName ||
                    "this website"
                }.
                <br />
                Ask anything about this website.`;

        }

    };


    loadAssistant();

    setInterval(
        refreshAssistantConfig,
        30000
    );


    // =========================================================
    // ELEMENTS
    // =========================================================

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


    // =========================================================
    // TEXT TO SPEECH
    // =========================================================

    const speak = (text) => {

        window.speechSynthesis.cancel();


        aiText.innerText =
            text;


        status.innerText =
            "AI Speaking...";


        const speech =
            new SpeechSynthesisUtterance(
                text
            );


        speech.lang =
            "en-US";


        speech.rate =
            1;


        speech.pitch =
            1;


        speech.volume =
            1;


        speech.onend = () => {

            status.innerText =
                "Tap button to Speak";


            wave.style.opacity =
                "0";

        };


        window.speechSynthesis.speak(
            speech
        );

    };


    // =========================================================
    // SPEECH RECOGNITION
    // =========================================================

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        status.innerText =
            "Speech Recognition not supported";

    } else {

        const recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-US";


        recognition.continuous =
            false;


        recognition.interimResults =
            false;


        // =====================================================
        // MICROPHONE
        // =====================================================

        mic.onclick = () => {

            try {

                wave.style.opacity =
                    "1";


                status.innerText =
                    "Listening...";


                userText.innerText =
                    "";


                aiText.innerText =
                    "";


                recognition.start();

            } catch (error) {

                console.log(
                    "Recognition Start Error:",
                    error
                );

            }

        };


        // =====================================================
        // SPEECH RESULT
        // =====================================================

        recognition.onresult =
            (e) => {

                const text =
                    e.results[0][0]
                        .transcript
                        .trim();


                userText.innerText =
                    "You: " + text;


                recognition.stop();


                setTimeout(
                    async () => {

                        try {

                            status.innerText =
                                "Thinking...";


                            // ---------------------------------
                            // Detect explicit navigation
                            // ---------------------------------

                            const isNavigationRequest =
                                isExplicitNavigationRequest(
                                    text
                                );


                            // ---------------------------------
                            // Only find a navigation target
                            // when navigation was explicitly
                            // requested.
                            // ---------------------------------

                            const navigationTarget =
                                isNavigationRequest
                                    ? findNavigationMatch(
                                        text
                                    )
                                    : null;


                            // ---------------------------------
                            // Current website context
                            // ---------------------------------

                            const currentPage =
                                buildPageContext();


                            // ---------------------------------
                            // Website page map
                            // ---------------------------------

                            const siteMap =
                                buildSiteMap();


                            // ---------------------------------
                            // Combined context
                            // ---------------------------------

                            const pageContext =
                                JSON.stringify({

                                    currentPage,

                                    siteMap

                                });


                            // ---------------------------------
                            // Backend request
                            // ---------------------------------

                            const res =
                                await fetch(
                                    `${BACKEND_URL}/api/assistant/ask`,
                                    {

                                        method: "POST",

                                        headers: {

                                            "Content-Type":
                                                "application/json"

                                        },

                                        body:
                                            JSON.stringify({

                                                message:
                                                    text,

                                                userId,

                                                currentUrl:
                                                    window.location.href,

                                                currentPath:
                                                    window.location.pathname,

                                                pageContext,

                                                isNavigationRequest,

                                                navigationTarget:
                                                    navigationTarget
                                                        ? {

                                                            path:
                                                                navigationTarget.path,

                                                            label:
                                                                navigationTarget.label

                                                        }
                                                        : null

                                            })

                                    }
                                );


                            const data =
                                await res.json();


                            console.log(
                                "ChatPlug response:",
                                data
                            );


                            // ---------------------------------
                            // Successful response
                            // ---------------------------------

                            if (data.success) {

                                // ---------------------------------
                                // NAVIGATION
                                // ---------------------------------

                                if (
                                    data.action ===
                                    "navigate"
                                ) {

                                    speak(
                                        data.response ||
                                        "Opening the page."
                                    );


                                    if (
                                        data.path &&
                                        window.location.pathname !==
                                        data.path
                                    ) {

                                        setTimeout(
                                            () => {

                                                window.location.href =
                                                    data.path;

                                            },
                                            1200
                                        );

                                    }

                                }

                                // ---------------------------------
                                // NORMAL AI RESPONSE
                                // ---------------------------------

                                else {

                                    speak(
                                        data.aiResponse ||
                                        data.response ||
                                        "I couldn't find that information."
                                    );

                                }

                            }

                            // ---------------------------------
                            // Backend error
                            // ---------------------------------

                            else {

                                speak(
                                    data.message ||
                                    "I couldn't process that request."
                                );

                            }

                        } catch (error) {

                            console.log(
                                "Assistant Request Error:",
                                error
                            );


                            speak(
                                "AI Server Error"
                            );

                        }

                    },
                    500
                );

            };


        // =====================================================
        // SPEECH ERROR
        // =====================================================

        recognition.onerror =
            (error) => {

                console.log(
                    "Speech Recognition Error:",
                    error
                );


                status.innerText =
                    "Tap button to Speak";


                wave.style.opacity =
                    "0";

            };


        recognition.onend =
            () => {

                if (
                    status.innerText ===
                    "Listening..."
                ) {

                    status.innerText =
                        "Tap button to Speak";

                }

            };

    }

})();