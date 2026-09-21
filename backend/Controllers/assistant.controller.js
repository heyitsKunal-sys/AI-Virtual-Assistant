import { generateGeminiResponse } from "../Configs/gemini.js"
import { generateOpenAIResponse } from "../Configs/openai.js"
import User from "../Models/user.model.js"


export const getAssistantConfig = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId).select("-geminiApiKey")
        if (!user) {
            return res.status(404).json({ message: "failed to get user" })
        }

        return res.status(200).json({ message: "Assistant Config data ", user })

    } catch (error) {
        return res.status(500).json({ message: `Assistant Config failed ${error}` })
    }
}


export const askAssistant = async (req, res) => {
    try {
        const { message, userId, navigationTarget, pageContext, currentUrl } = req.body

        if (!message || !userId) {
            return res.status(400).json({ message: "Message and UserId are required" })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User is not found" })
        }
        const currentProvider = user.provider || "gemini"
        const hasApiKey = currentProvider === "openai" ? !!user.openAiApiKey : !!user.geminiApiKey

        if (!hasApiKey) {
            return res.status(400).json({ message: `${currentProvider === "openai" ? "OpenAI" : "Gemini"} API key is not added` })
        }

        if (user.plan === "free"
            && user.totalMessages >= user.requestLimit) {
            return res.status(400).json({ message: "Free limit reached" })
        }

        if (user.plan === "pro" && new Date(user.proExpiresAt) < new Date()) {
            user.plan === "free"

            await user.save()

            return res.status(400).json({ message: "Pro plan expired" })
        }

        const cleanMessage = message.toLowerCase()

        const billingIntent = () => {
            const billingPatterns = [
                "how many messages", "messages left", "remaining messages", "message left", "how many message",
                "free tier", "free plan", "billing", "limit left", "remaining limit", "messages remaining",
                "subscription", "plan status", "upgrade my plan", "my plan", "expired", "renew"
            ]

            const isBillingQuestion = billingPatterns.some((pattern) => cleanMessage.includes(pattern))

            if (!isBillingQuestion) return null

            if (user.plan === "free") {
                const remaining = Math.max(0, user.requestLimit - user.totalMessages)
                return {
                    success: true,
                    response: `You have ${remaining} messages left on the free tier.`,
                }
            }

            return {
                success: true,
                response: "You are on the Pro plan, so your message limit does not apply.",
            }
        }

        const faqIntent = () => {
            const faqAnswers = {
                login: ["login", "sign in", "log in", "signin", "how do i log in"],
                signup: ["signup", "sign up", "register", "create account", "how do i sign up"],
                settings: ["settings", "account settings", "profile settings", "preferences"],
                privacy: ["privacy", "privacy policy", "terms", "terms and conditions"],
                contact: ["contact", "support", "help", "reach us", "get in touch"],
                pricing: ["pricing", "plans", "prices", "cost", "fees", "subscription"],
            }

            for (const [key, patterns] of Object.entries(faqAnswers)) {
                if (patterns.some((pattern) => cleanMessage.includes(pattern))) {
                    const map = {
                        login: { path: "/login", response: "Open the login page." },
                        signup: { path: "/signup", response: "Open the sign up page." },
                        settings: { path: "/settings", response: "Open the settings page." },
                        privacy: { path: "/privacy", response: "Open the privacy page." },
                        contact: { path: "/contact", response: "Open the contact page." },
                        pricing: { path: "/pricing", response: "Open the pricing page." },
                    }

                    return {
                        success: true,
                        action: "navigate",
                        path: map[key].path,
                        response: map[key].response,
                    }
                }
            }

            return null
        }

        const inferRouteFromMessage = () => {
            const routeMap = [
                { route: "/", keywords: ["home", "main", "landing", "welcome", "welcome page", "dashboard", "index"] },
                { route: "/about", keywords: ["about", "about us", "our story", "company", "who we are"] },
                { route: "/contact", keywords: ["contact", "contact us", "reach us", "get in touch", "support", "help", "call us"] },
                { route: "/services", keywords: ["services", "service", "solutions", "what we do", "offerings"] },
                { route: "/pricing", keywords: ["pricing", "plan", "plans", "package", "packages", "prices", "cost", "fees"] },
                { route: "/billing", keywords: ["billing", "plans and billing", "payment", "payments", "upgrade", "checkout", "invoice"] },
                { route: "/portfolio", keywords: ["portfolio", "projects", "our work", "case studies", "work"] },
                { route: "/blog", keywords: ["blog", "articles", "news", "insights", "posts"] },
                { route: "/faq", keywords: ["faq", "frequently asked questions", "questions", "help center"] },
                { route: "/team", keywords: ["team", "our team", "people", "staff", "members"] },
                { route: "/testimonials", keywords: ["testimonials", "reviews", "feedback", "stories", "customer reviews"] },
                { route: "/login", keywords: ["login", "log in", "sign in", "signin", "account"] },
                { route: "/signup", keywords: ["signup", "sign up", "register", "create account", "join now"] },
                { route: "/settings", keywords: ["settings", "profile settings", "account settings", "preferences"] },
                { route: "/privacy", keywords: ["privacy", "privacy policy", "data policy", "terms", "terms and conditions"] },
                { route: "/profile", keywords: ["profile", "my profile", "account profile", "user profile"] },
                { route: "/orders", keywords: ["orders", "my orders", "order history", "purchases"] },
                { route: "/wishlist", keywords: ["wishlist", "saved items", "favorites", "saved products"] },
                { route: "/cart", keywords: ["cart", "shopping cart", "checkout cart", "basket"] },
                { route: "/checkout", keywords: ["checkout", "complete purchase", "payment page", "secure checkout"] },
                { route: "/dashboard", keywords: ["dashboard", "admin dashboard", "user dashboard"] },
                { route: "/builder", keywords: ["builder", "assistant builder", "setup assistant", "configure assistant"] },
                { route: "/admin", keywords: ["admin", "admin panel", "management"] },
                { route: "/docs", keywords: ["docs", "documentation", "guide", "tutorials"] },
                { route: "/downloads", keywords: ["downloads", "download", "resources"] },
                { route: "/book-demo", keywords: ["book demo", "demo", "schedule demo", "book a demo"] },
                { route: "/contact-us", keywords: ["contact us page", "contact form", "contact us"] },
                { route: "/careers", keywords: ["careers", "jobs", "join us", "career"] },
                { route: "/partners", keywords: ["partners", "partner program", "affiliates"] },
                { route: "/download", keywords: ["download app", "get app", "app download"] },
                { route: "/features", keywords: ["features", "feature", "benefits"] },
            ]

            const match = routeMap.find((item) =>
                item.keywords.some((keyword) => cleanMessage.includes(keyword))
            )

            if (!match) return null

            return {
                path: match.route,
                label: match.route === "/" ? "Home" : match.route.replace("/", "").split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "),
            }
        }

        const billingInfo = billingIntent()
        if (billingInfo) {
            return res.json(billingInfo)
        }

        const faqInfo = faqIntent()
        if (faqInfo) {
            return res.json(faqInfo)
        }

        if (user.enableNavigation) {

            // Navigation Commands
            const navigationWords = [

                "open",
                "go",
                "start",
                "show",
                "navigate",
                "take me",

            ];

            // Check navigation intent
            const wantsNavigation =
                navigationWords.some((word) =>

                    cleanMessage.includes(word)
                ) || Boolean(navigationTarget && navigationTarget.path);

            // User wants navigation
            if (wantsNavigation) {

                const inferredRoute = inferRouteFromMessage()
                if (inferredRoute) {
                    return res.json({
                        success: true,
                        action: "navigate",
                        path: inferredRoute.path,
                        response: `Opening ${inferredRoute.label}`,
                    })
                }

                if (cleanMessage.includes("home") || cleanMessage.includes("main") || cleanMessage.includes("landing") || cleanMessage.includes("welcome")) {
                    return res.json({
                        success: true,
                        action: "navigate",
                        path: "/",
                        response: "Opening Home",
                    })
                }

                // Find matching page
                const matchedPage =
                    user.pages.find((page) =>

                        page.keywords.some((keyword) =>

                            cleanMessage.includes(
                                keyword.toLowerCase()
                            )
                        )
                    );

                // Page found
                if (matchedPage) {

                    // Already open
                    if (
                        req.body.currentPath ===
                        matchedPage.path
                    ) {

                        return res.json({

                            success: true,

                            response:
                                `${matchedPage.name} already open`

                        });
                    }

                    // Navigate
                    return res.json({

                        success: true,

                        action: "navigate",

                        path: matchedPage.path,

                        response:
                            `Opening ${matchedPage.name}`,

                    });
                }

                if (navigationTarget && navigationTarget.path) {
                    return res.json({
                        success: true,
                        action: "navigate",
                        path: navigationTarget.path,
                        response: `Opening ${navigationTarget.label || "that page"}`,
                    })
                }
            }
        }

        const websiteContext = pageContext ? `
Website Context:
URL: ${currentUrl || "Unknown"}
${pageContext}
` : ""

        const prompt = `

You are ${user.assistantName}.

Business Name:
${user.businessName}

Business Type:
${user.businessType}

Business Description:
${user.businessDescription}

Assistant Tone:
${user.tone}

${websiteContext}

Rules:

- Keep replies under 15 words
- Give fast direct responses
- Talk naturally
- Behave like smart voice assistant
- Avoid long explanations
- Keep responses short for quick voice playback
- If the question is about the current website, answer using the website context above
- If the user asks to open or navigate to a page, guide them to the relevant page and keep the answer brief

User Question:
${message}

`;

     const aiResponse = currentProvider === "openai"
            ? await generateOpenAIResponse({ prompt, apikey: user.openAiApiKey, user })
            : await generateGeminiResponse({ prompt, apikey: user.geminiApiKey, user })

    if(user.plan === "free"){
        user.totalMessages += 1

     await user.save()

    }
    return  res.json({
                success: true,
                aiResponse
            });

    } catch (error) {

        console.log(error)

        return  res.status(500).json({
                success: false,
                message:
                    "Assistant AI Error",
            });

    }
}


