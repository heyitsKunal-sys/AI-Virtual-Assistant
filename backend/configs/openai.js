const OpenAI_URL = "https://api.openai.com/v1/chat/completions"
const FALLBACK_RESPONSE = "The AI is busy right now. Please try again in a moment."

export const generateOpenAIResponse = async ({
    prompt,
    apikey,
    user,
}) => {
    try {
        if (!apikey) {
            throw new Error("OpenAI API key missing")
        }

        const response = await fetch(OpenAI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 200,
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            const status = response.status

            if (status === 401 || status === 403) {
                user.geminiStatus = "invalid"
                await user.save()
                throw new Error(`OpenAI API key invalid: ${errText}`)
            }

            if (status === 429) {
                user.geminiStatus = "quota_exceeded"
                await user.save()
                return "The AI daily quota has been reached. Please try again later or upgrade your plan."
            }

            if ([500, 502, 503, 504].includes(status)) {
                return FALLBACK_RESPONSE
            }

            throw new Error(`OpenAI API error: ${status} ${errText}`)
        }

        const data = await response.json()
        const text = data.choices?.[0]?.message?.content

        if (!text) {
            throw new Error("No text returned from OpenAI")
        }

        user.geminiStatus = "active"
        await user.save()

        return String(text).trim()
    } catch (error) {
        console.error("OpenAI Fetch Error:", error.message)

        if (error.message?.includes("OpenAI API key missing") || error.message?.includes("invalid")) {
            throw error
        }

        if (error.message?.includes("quota") || error.message?.includes("429")) {
            return "The AI daily quota has been reached. Please try again later or upgrade your plan."
        }

        return FALLBACK_RESPONSE
    }
}
