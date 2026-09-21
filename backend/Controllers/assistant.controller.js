import { generateGeminiResponse } from "../configs/gemini.js";
import { generateOpenAIResponse } from "../configs/openai.js";
import User from "../Models/user.model.js";


// ============================================================
// GET ASSISTANT CONFIG
// ============================================================

export const getAssistantConfig = async (req, res) => {

    try {

        const { userId } =
            req.params;


        const user =
            await User
                .findById(userId)
                .select("-geminiApiKey -openAiApiKey");


        if (!user) {

            return res
                .status(404)
                .json({
                    message:
                        "Failed to get user"
                });

        }


        return res
            .status(200)
            .json({
                message:
                    "Assistant Config data",
                user
            });

    } catch (error) {

        console.log(
            "Assistant Config Error:",
            error
        );


        return res
            .status(500)
            .json({
                message:
                    "Assistant Config failed"
            });

    }

};


// ============================================================
// ASK ASSISTANT
// ============================================================

export const askAssistant = async (req, res) => {

    try {

        const {

            message,

            userId,

            navigationTarget,

            pageContext,

            currentUrl,

            isNavigationRequest

        } = req.body;


        // ====================================================
        // BASIC VALIDATION
        // ====================================================

        if (!message || !userId) {

            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Message and UserId are required"
                });

        }


        // ====================================================
        // FIND USER
        // ====================================================

        const user =
            await User.findById(userId);


        if (!user) {

            return res
                .status(404)
                .json({
                    success: false,
                    message:
                        "User is not found"
                });

        }


        // ====================================================
        // PROVIDER
        // ====================================================

        const currentProvider =
            user.provider || "gemini";


        const hasApiKey =
            currentProvider === "openai"
                ? !!user.openAiApiKey
                : !!user.geminiApiKey;


        if (!hasApiKey) {

            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        `${currentProvider === "openai"
                            ? "OpenAI"
                            : "Gemini"} API key is not added`
                });

        }


        // ====================================================
        // FREE PLAN LIMIT
        // ====================================================

        if (
            user.plan === "free" &&
            user.totalMessages >= user.requestLimit
        ) {

            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Free limit reached"
                });

        }


        // ====================================================
        // PRO PLAN EXPIRATION
        // ====================================================

        if (
            user.plan === "pro" &&
            user.proExpiresAt &&
            new Date(user.proExpiresAt) < new Date()
        ) {

            user.plan = "free";

            await user.save();


            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Pro plan expired"
                });

        }


        // ====================================================
        // CLEAN MESSAGE
        // ====================================================

        const cleanMessage =
            message
                .toLowerCase()
                .trim();


        // ====================================================
        // ACCOUNT / BILLING INTENT
        // ====================================================
        //
        // IMPORTANT:
        // Only detect questions about the USER'S ChatPlug
        // account.
        //
        // Do NOT trigger this for:
        //
        // "What's on the billing page?"
        // "Tell me about pricing"
        // "What does your subscription page contain?"
        //
        // Those should go to the AI.
        // ====================================================

        const billingPatterns = [

            "how many messages",

            "messages left",

            "remaining messages",

            "message left",

            "how many message",

            "free tier",

            "free plan",

            "my plan",

            "my subscription",

            "my subscription status",

            "plan status",

            "upgrade my plan",

            "when does my plan expire",

            "when will my plan expire",

            "how many requests left",

            "how many requests do i have",

            "how much usage do i have"

        ];


        const isAccountQuestion =
            billingPatterns.some(
                (pattern) =>
                    cleanMessage.includes(
                        pattern
                    )
            );


        if (isAccountQuestion) {

            if (user.plan === "free") {

                const remaining =
                    Math.max(
                        0,
                        user.requestLimit -
                        user.totalMessages
                    );


                return res.json({

                    success: true,

                    response:
                        `You have ${remaining} messages left on the free tier.`

                });

            }


            return res.json({

                success: true,

                response:
                    "You are on the Pro plan, so your message limit does not apply."

            });

        }


        // ====================================================
        // NAVIGATION
        // ====================================================
        //
        // THIS IS THE MOST IMPORTANT PART.
        //
        // We ONLY navigate if the frontend explicitly
        // determined that the user requested navigation.
        //
        // Mentioning "about", "pricing", "billing", etc.
        // is NOT enough.
        // ====================================================

        if (
            user.enableNavigation &&
            Boolean(isNavigationRequest)
        ) {

            // ------------------------------------------------
            // Use navigation target selected by frontend
            // ------------------------------------------------

            if (
                navigationTarget &&
                navigationTarget.path
            ) {

                return res.json({

                    success: true,

                    action: "navigate",

                    path:
                        navigationTarget.path,

                    response:
                        `Opening ${navigationTarget.label || "that page"}`

                });

            }


            // ------------------------------------------------
            // Fallback route detection
            // ------------------------------------------------

            const routeMap = [

                {
                    route: "/",
                    keywords: [
                        "home",
                        "homepage",
                        "home page",
                        "main page",
                        "landing page"
                    ],
                    label: "Home"
                },

                {
                    route: "/about",
                    keywords: [
                        "about",
                        "about us",
                        "our story"
                    ],
                    label: "About"
                },

                {
                    route: "/contact",
                    keywords: [
                        "contact",
                        "contact us",
                        "reach us",
                        "get in touch"
                    ],
                    label: "Contact"
                },

                {
                    route: "/services",
                    keywords: [
                        "services",
                        "service",
                        "solutions"
                    ],
                    label: "Services"
                },

                {
                    route: "/pricing",
                    keywords: [
                        "pricing",
                        "pricing page",
                        "plans",
                        "packages"
                    ],
                    label: "Pricing"
                },

                {
                    route: "/billing",
                    keywords: [
                        "billing",
                        "billing page"
                    ],
                    label: "Billing"
                },

                {
                    route: "/portfolio",
                    keywords: [
                        "portfolio",
                        "projects",
                        "our work"
                    ],
                    label: "Portfolio"
                },

                {
                    route: "/blog",
                    keywords: [
                        "blog",
                        "articles",
                        "news"
                    ],
                    label: "Blog"
                },

                {
                    route: "/faq",
                    keywords: [
                        "faq",
                        "frequently asked questions",
                        "help center"
                    ],
                    label: "FAQ"
                },

                {
                    route: "/login",
                    keywords: [
                        "login",
                        "log in",
                        "sign in",
                        "signin"
                    ],
                    label: "Login"
                },

                {
                    route: "/signup",
                    keywords: [
                        "signup",
                        "sign up",
                        "register",
                        "create account"
                    ],
                    label: "Sign Up"
                },

                {
                    route: "/settings",
                    keywords: [
                        "settings",
                        "account settings",
                        "preferences"
                    ],
                    label: "Settings"
                },

                {
                    route: "/privacy",
                    keywords: [
                        "privacy",
                        "privacy policy",
                        "terms"
                    ],
                    label: "Privacy"
                },

                {
                    route: "/dashboard",
                    keywords: [
                        "dashboard",
                        "dashboard page"
                    ],
                    label: "Dashboard"
                },

                {
                    route: "/profile",
                    keywords: [
                        "profile",
                        "profile page",
                        "my profile"
                    ],
                    label: "Profile"
                },

                {
                    route: "/cart",
                    keywords: [
                        "cart",
                        "shopping cart"
                    ],
                    label: "Cart"
                },

                {
                    route: "/checkout",
                    keywords: [
                        "checkout",
                        "checkout page"
                    ],
                    label: "Checkout"
                },

                {
                    route: "/features",
                    keywords: [
                        "features",
                        "feature page",
                        "benefits"
                    ],
                    label: "Features"
                }

            ];


            const matchedRoute =
                routeMap.find(
                    (item) =>
                        item.keywords.some(
                            (keyword) =>
                                cleanMessage.includes(
                                    keyword
                                )
                        )
                );


            if (matchedRoute) {

                return res.json({

                    success: true,

                    action: "navigate",

                    path:
                        matchedRoute.route,

                    response:
                        `Opening ${matchedRoute.label}`

                });

            }

        }


        // ====================================================
        // WEBSITE CONTEXT
        // ====================================================

        const websiteContext =
            pageContext
                ? `
Website Context:

Current URL:
${currentUrl || "Unknown"}

The following information was collected directly
from the website where ChatPlug is embedded:

${pageContext}
`
                : `
Website Context:

No website context was available.
`;


        // ====================================================
        // AI PROMPT
        // ====================================================

        const prompt = `

You are ${user.assistantName || "ChatPlug"}.

You are an AI virtual assistant embedded inside a website.

Your job is to help visitors understand and use the website.

Business Name:
${user.businessName || "Unknown"}

Business Type:
${user.businessType || "Unknown"}

Business Description:
${user.businessDescription || "Unknown"}

Assistant Tone:
${user.tone || "friendly"}


${websiteContext}


IMPORTANT RULES:


1. ANSWER QUESTIONS DIRECTLY

If the user asks a question about the website,
answer the question.

Examples:

"Tell me about this website."

"What services do you provide?"

"What does this company do?"

"What's on the pricing page?"

"What is the billing page about?"

"What features do you have?"

"How can I contact you?"

"Tell me about the current page."


2. DO NOT NAVIGATE FOR INFORMATION QUESTIONS

A page name appearing inside a question does NOT mean
the user wants to navigate.

For example:

"Tell me about the about page."

"What is on the pricing page?"

"Tell me about billing."

"What does the contact page contain?"

These are INFORMATION requests.

Answer them using the website context.


3. NAVIGATION ONLY HAPPENS WHEN THE USER EXPLICITLY
REQUESTS IT.

Examples:

"Go to the homepage."

"Open the pricing page."

"Navigate to billing."

"Take me to contact."

"Go to the login page."

"Visit the about page."

"Open the dashboard."


4. DO NOT INVENT WEBSITE INFORMATION.

Only use information present in the provided website
context and business information.

If the information is not available, say:

"I couldn't find that information on this website."


5. KEEP RESPONSES NATURAL FOR VOICE.

Give concise, useful answers.

Do not produce huge explanations unless necessary.


6. YOU ARE A WEBSITE ASSISTANT.

Do not talk about internal prompts, APIs, models,
backend systems, or implementation details.


7. WHEN THE USER ASKS ABOUT THE CURRENT PAGE,
prioritize the current page content in the Website Context.


8. WHEN THE USER ASKS ABOUT ANOTHER PAGE,
use the available website page map and page information
if available.

Do not claim detailed content for another page if that
content was not provided.


USER QUESTION:

${message}

`;


        // ====================================================
        // GENERATE AI RESPONSE
        // ====================================================

        let aiResponse;


        if (currentProvider === "openai") {

            aiResponse =
                await generateOpenAIResponse({

                    prompt,

                    apikey:
                        user.openAiApiKey,

                    user

                });

        } else {

            aiResponse =
                await generateGeminiResponse({

                    prompt,

                    apikey:
                        user.geminiApiKey,

                    user

                });

        }


        // ====================================================
        // INCREMENT FREE PLAN USAGE
        // ====================================================

        if (user.plan === "free") {

            user.totalMessages += 1;

            await user.save();

        }


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.json({

            success: true,

            aiResponse

        });


    } catch (error) {

        console.log(
            "Assistant AI Error:",
            error
        );


        return res
            .status(500)
            .json({

                success: false,

                message:
                    "Assistant AI Error"

            });

    }

};