import React, { useState } from "react";
import { FaRocket } from "react-icons/fa";

// Platform options
const options = [
  {
    id: "geforce",
    name: "GeForce NOW",
    url: "https://play.geforcenow.com/",
    color: "bg-green-600 hover:bg-green-700",
    logo: "https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Emblem.png",
  },
  {
    id: "xcloud",
    name: "XCloud",
    url: "https://www.xbox.com/en-us/play",
    color: "bg-green-500 hover:bg-green-600",
    logo: "https://cdn.dribbble.com/userupload/25385567/file/original-652994e7de7cb6f4881bde606af2b01f.png",
  },
  {
    id: "blacknut",
    name: "Blacknut",
    url: "https://blacknut.com/",
    color: "bg-red-600 hover:bg-red-700",
    logo: "https://play-lh.googleusercontent.com/Lp8_TTzD_vAIc417a8LeDr4qsbOAlB7_t9EqaKhIHLhbHXK0RZCaltRCoPV98qfSa0M",
  },
  {
    id: "luna",
    name: "Amazon Luna",
    url: "https://luna.amazon.com/",
    color: "bg-purple-600 hover:bg-purple-700",
    logo: "https://m.media-amazon.com/images/I/51N11v0-CQL.png",
  },
];

// News items
const newsItems = [
  "🚀 XForce Infinity v2.0 released with new UI improvements and many more features.",
  "🎉 Added multi-platform support: Choose from GeForce NOW, XCloud, Blacknut, Amazon Luna!",
  "📢 Follow us on GitHub, Our Website and Patreon for updates and support!",
];

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);

  const selectedOption = options.find((opt) => opt.id === selected);

  const onChoose = (opt: typeof options[0]) => setSelected(opt.id);

  const onLaunch = () => {
    if (!selectedOption) return;

    // Launch the selected platform
    window.electronAPI.launchPlatform(selectedOption.url);

    // Save selectedPlatform
    if (remember) {
      window.electronAPI.saveConfig({
        selectedPlatform: selectedOption.url,
      });
    }
  };

  return (
    <div className="h-screen w-full bg-[#23272b] text-[rgb(37 99 235)] flex flex-col px-8">
      {/* Title */}
      <header className="py-8 flex-shrink-0">
        <h1 className="text-6xl font-bold select-none text-center">
          Welcome to XForce Infinity
        </h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col flex-grow items-center justify-center space-y-10 w-full px-4">
        {/* Platform selector */}
        <div className="flex flex-wrap justify-center gap-8 max-w-full max-h-full">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChoose(opt)}
                className={`
                  flex flex-col items-center justify-center w-48 p-6 rounded-2xl
                  transition-transform transform
                  border-4
                  ${isSelected ? `${opt.color} scale-110 border-transparent` : "border-gray-700"}
                  hover:scale-105 focus:outline-none focus:ring-6 focus:ring-offset-4 focus:ring-blue-400
                  bg-gray-800
                  select-none
                  shadow-lg
                `}
              >
                <img
                  src={opt.logo}
                  alt={`${opt.name} logo`}
                  className="h-28 w-auto mb-6 object-contain"
                  style={{ maxHeight: 112 }}
                />
                <span className="font-semibold text-2xl">{opt.name}</span>
              </button>
            );
          })}
        </div>

        {/* Launch button */}
        <button
          onClick={onLaunch}
          disabled={!selected}
          className="flex items-center justify-center space-x-3 px-16 py-5 rounded-full text-white font-bold uppercase text-xl bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <FaRocket className="w-6 h-6" />
          <span>Launch {selectedOption?.name || ""}</span>
        </button>

        {/* Remember toggle */}
        <label
          htmlFor="remember-toggle"
          className="flex items-center space-x-4 cursor-pointer select-none text-gray-300"
        >
          <span className="text-xl font-medium">Remember my choice</span>
          <input
            id="remember-toggle"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="toggle toggle-primary"
          />
        </label>
      </main>

      {/* News section */}
      <section
        className="mt-12 max-w-5xl mx-auto w-full
                   bg-gradient-to-br from-[#2f3640] to-[#23272b]
                   rounded-xl p-8 shadow-lg border-2 border-blue-600
                   backdrop-blur-md bg-opacity-90"
        style={{ backdropFilter: "saturate(180%) blur(10px)" }}
      >
        <h2
          className="text-4xl font-extrabold mb-6
                     text-[#90caf9] drop-shadow-md
                     border-b-4 border-purple-600 pb-3"
        >
          XForce Infinity News
        </h2>
        <ul className="list-disc list-inside space-y-4 text-lg text-[#babec4]">
          {newsItems.map((item, idx) => (
            <li
              key={idx}
              className="hover:text-white cursor-default transition-colors duration-300"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 text-right text-sm text-[#8f99a5] italic">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </section>
    </div>
  );
}
