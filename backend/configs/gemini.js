const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"
const RETRYABLE_STATUS_CODES = [500, 502, 503, 504]
const FALLBACK_RESPONSE = "The AI is busy right now. Please try again in a moment."
const QUOTA_RESPONSE = "The AI daily quota has been reached. Please try again later or upgrade your plan."

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const generateGeminiResponse = async ({
    prompt,
    apikey,
    user
}) => {
    try {

        if (!apikey) {
            throw new Error("Gemini API key missing")
        }

        let lastError = null

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await fetch(`${Gemini_URL}?key=${apikey}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ]
                    })
                })

                if (!response.ok) {
                    const errText = await response.text()
                    const status = response.status

                    if (status === 400 || status === 401) {
                        user.geminiStatus = "invalid"
                        await user.save()
                        throw new Error(`Gemini API error: ${status} ${errText}`)
                    }

                    if (status === 429) {
                        user.geminiStatus = "quota_exceeded"
                        await user.save()
                        return QUOTA_RESPONSE
                    }

                    if (RETRYABLE_STATUS_CODES.includes(status) && attempt < 3) {
                        await wait(1000 * attempt)
                        continue
                    }

                    if (RETRYABLE_STATUS_CODES.includes(status)) {
                        return FALLBACK_RESPONSE
                    }

                    throw new Error(`Gemini API error: ${status} ${errText}`)
                }

                user.geminiStatus = "active"
                await user.save()

                const data = await response.json()
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text

                if (!text) {
                    throw new Error("No text returned from Gemini")
                }

                return text.trim()
            } catch (error) {
                lastError = error

                const message = error?.message || ""
                const shouldRetry = RETRYABLE_STATUS_CODES.some((code) => message.includes(String(code)))
                    || message.includes("UNAVAILABLE")
                    || message.includes("timeout")
                    || message.includes("fetch")

                if (shouldRetry && attempt < 3) {
                    await wait(1000 * attempt)
                    continue
                }

                throw error
            }
        }

        throw lastError || new Error("Gemini API fetch failed")
    } catch (error) {
        console.error("Gemini Fetch Error:", error.message)

        if (error.message?.includes("Gemini API key missing") || error.message?.includes("invalid")) {
            throw error
        }

        if (error.message?.includes("quota exceeded") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            return QUOTA_RESPONSE
        }

        return FALLBACK_RESPONSE
    }
}