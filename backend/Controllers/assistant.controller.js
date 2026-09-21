import { generateGeminiResponse } from "../configs/gemini.js"
import { generateOpenAIResponse } from "../configs/openai.js"
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

        const billingInfo = billingIntent()
        if (billingInfo) {
            return res.json(billingInfo)
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
                "visit",
                "go to",
                "open the",
                "show me",

            ];

            // Check navigation intent
            const isInformationQuestion = /\b(what|how|why|when|where|who|tell me|explain|describe)\b/.test(cleanMessage)
            const wantsNavigation = navigationWords.some((word) =>
                cleanMessage.includes(word)
            ) && !isInformationQuestion

            // User wants navigation
            if (wantsNavigation) {

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

        if (user.plan === "free") {
            user.totalMessages += 1

            await user.save()

        }
        return res.json({
            success: true,
            aiResponse
        });

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message:
                "Assistant AI Error",
        });

    }
}


