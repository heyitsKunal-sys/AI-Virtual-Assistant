import React, { useState } from "react";
import { CiMicrophoneOn } from "react-icons/ci";
import { FiMessageCircle, FiSettings } from "react-icons/fi";

const themes = {
  dark: {
    card: "#292722",
    text: "#FFF9F3",
    sub: "#BEB6AC",
    accent: "#D97757",
    soft: "#3A3731",
    orb: "from-[#F1B49C] via-[#D97757] to-[#A94F36]",
    wave: "#D97757",
    button: "#D97757",
    buttonHover: "#C96442",
    border: "rgba(255,255,255,0.1)",
  },

  light: {
    card: "#FFFCF7",
    text: "#292722",
    sub: "#746F67",
    accent: "#D97757",
    soft: "#F5F1EA",
    orb: "from-[#F8D8C8] via-[#E58C69] to-[#C96442]",
    wave: "#D97757",
    button: "#D97757",
    buttonHover: "#C96442",
    border: "#DDD7CE",
  },

  glass: {
    card: "rgba(57,53,47,0.88)",
    text: "#FFF9F3",
    sub: "#D5CCC3",
    accent: "#E39A7C",
    soft: "rgba(255,255,255,0.1)",
    orb: "from-[#F8DDD0] via-[#E39A7C] to-[#C85D3F]",
    wave: "#E39A7C",
    button: "#D97757",
    buttonHover: "#C96442",
    border: "rgba(255,255,255,0.15)",
  },

  neon: {
    card: "#241B18",
    text: "#FFF3EA",
    sub: "#D9BDB1",
    accent: "#F08A68",
    soft: "#3A2924",
    orb: "from-[#FFD5C3] via-[#E88965] to-[#C85D3F]",
    wave: "#F08A68",
    button: "#E06F4D",
    buttonHover: "#C85D3F",
    border: "rgba(217,119,87,0.25)",
  },
};

function AssistantPreview() {

  // IMPORTANT:
  // This state belongs ONLY to this preview.
  const [theme, setTheme] = useState("dark");

  const current = themes[theme];

  const themeButtons = [
    ["dark", "#292722"],
    ["light", "#F7F4EE"],
    ["glass", "#777069"],
    ["neon", "#C85D3F"],
  ];

  return (
    <div className="flex items-center justify-center px-4 py-10">

      {/* PREVIEW CARD */}
      <div
        className="
          relative
          w-[330px] h-[570px]
          sm:w-[360px] sm:h-[600px]
          rounded-[32px]
          overflow-hidden
          border
          shadow-[0_25px_80px_rgba(41,39,34,0.22)]
          transition-colors duration-300
        "
        style={{
          backgroundColor: current.card,
          borderColor: current.border,
        }}
      >

        {/* TOP GLOW */}
        <div
          className="
            pointer-events-none
            absolute
            -top-32
            left-1/2
            -translate-x-1/2
            w-80
            h-80
            rounded-full
            blur-[100px]
            opacity-30
          "
          style={{
            backgroundColor: current.accent,
          }}
        />

        <div className="relative z-10 h-full flex flex-col">


          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                "
                style={{
                  backgroundColor: `${current.accent}20`,
                }}
              >
                <FiMessageCircle
                  size={19}
                  style={{
                    color: current.accent,
                  }}
                />
              </div>

              <div>

                <h3
                  className="font-semibold"
                  style={{
                    color: current.text,
                  }}
                >
                  ChatPlug
                </h3>

                <div className="flex items-center gap-1.5 mt-0.5">

                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: "#6B9B72",
                    }}
                  />

                  <span
                    className="text-xs"
                    style={{
                      color: current.sub,
                    }}
                  >
                    AI Assistant
                  </span>

                </div>

              </div>

            </div>


            <button
              type="button"
              className="
                w-9 h-9
                rounded-xl
                flex items-center justify-center
                transition
                hover:opacity-80
                cursor-pointer
              "
              style={{
                backgroundColor: current.soft,
                color: current.sub,
              }}
            >
              <FiSettings size={17} />
            </button>

          </div>


          {/* THEME SWITCHER */}
          <div className="relative z-50 flex justify-center gap-3">

            {themeButtons.map(([name, color]) => (

              <button
                key={name}
                type="button"
                aria-label={`Select ${name} theme`}
                onClick={() => setTheme(name)}
                className={`
                  relative
                  z-50
                  w-6 h-6
                  rounded-full
                  border-2
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:scale-110
                  ${
                    theme === name
                      ? "scale-125 border-white shadow-lg"
                      : "border-transparent"
                  }
                `}
                style={{
                  backgroundColor: color,
                }}
              />

            ))}

          </div>


          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">


            {/* AI ORB */}
            <div className="relative mb-9">

              {/* Orb Glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  scale-150
                  blur-3xl
                  opacity-30
                  rounded-full
                "
                style={{
                  backgroundColor: current.accent,
                }}
              />

              {/* Orb */}
              <div
                className={`
                  relative
                  w-32 h-32
                  rounded-full
                  bg-gradient-to-br
                  ${current.orb}
                  shadow-[0_15px_50px_rgba(217,119,87,0.25)]
                  animate-pulse
                  transition-all
                  duration-300
                `}
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-5
                  rounded-full
                  bg-white/10
                  blur-md
                "
              />

            </div>


            {/* GREETING */}
            <div className="text-center">

              <h2
                className="
                  text-[26px]
                  font-semibold
                  tracking-tight
                "
                style={{
                  color: current.text,
                }}
              >
                How can I help?
              </h2>

              <p
                className="
                  text-sm
                  leading-6
                  mt-2
                  max-w-[250px]
                "
                style={{
                  color: current.sub,
                }}
              >
                I'm here to answer questions and
                help your visitors navigate your website.
              </p>

            </div>


            {/* LISTENING */}
            <div
              className="
                mt-8
                px-4 py-2
                rounded-full
                flex
                items-center
                gap-2
              "
              style={{
                backgroundColor: current.soft,
              }}
            >

              <span
                className="
                  w-2 h-2
                  rounded-full
                  animate-pulse
                "
                style={{
                  backgroundColor: current.accent,
                }}
              />

              <span
                className="text-xs font-medium"
                style={{
                  color: current.sub,
                }}
              >
                Listening
              </span>

            </div>


            {/* WAVEFORM */}
            <div className="flex items-center gap-1 mt-5 h-8">

              {[3, 6, 10, 16, 23, 14, 8, 5, 12, 18, 7].map(
                (height, index) => (

                  <span
                    key={index}
                    className="
                      w-1
                      rounded-full
                      animate-pulse
                    "
                    style={{
                      height: `${height}px`,
                      backgroundColor: current.wave,
                      animationDelay: `${index * 100}ms`,
                    }}
                  />

                )
              )}

            </div>

          </div>


          {/* BOTTOM */}
          <div className="px-6 pb-7">

            <div
              className="
                rounded-2xl
                p-3
                flex
                items-center
                justify-between
              "
              style={{
                backgroundColor: current.soft,
              }}
            >

              <div className="pl-2">

                <p
                  className="text-xs"
                  style={{
                    color: current.sub,
                  }}
                >
                  Try saying
                </p>

                <p
                  className="
                    text-sm
                    font-medium
                    mt-0.5
                  "
                  style={{
                    color: current.text,
                  }}
                >
                  "What services do you offer?"
                </p>

              </div>


              {/* MICROPHONE */}
              <button
                type="button"
                className="
                  w-14 h-14
                  rounded-full
                  text-white
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-200
                  hover:scale-105
                  cursor-pointer
                "
                style={{
                  backgroundColor: current.button,
                  boxShadow: `0 8px 25px ${current.accent}55`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    current.buttonHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    current.button;
                }}
              >
                <CiMicrophoneOn size={28} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AssistantPreview;