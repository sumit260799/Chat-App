import React, { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { emojis } from "../utils/emoji";
import { CiSearch } from "react-icons/ci";

const EmojiBox = ({ emojiSend }) => {
  const [activeGroupName, setActiveGroupName] = useState("smileys"); // State to track active group
  const emojiContainerRef = useRef(null); // Ref to emoji container for scrolling
  const [visibleGroup, setVisibleGroup] = useState(null); // State to track visible group
  const [emojiName, setEmojiName] = useState("");

  console.log("🚀 ---------------------------------🚀");
  console.log("🚀  EmojiBox  emojiName", emojiName);
  console.log("🚀 ---------------------------------🚀");

  // Function to handle click on groupLogo
  const handleGroupClick = (groupName) => {
    setActiveGroupName(groupName); // Set active group name
    // Scroll to the emoji group section
    if (emojiContainerRef.current) {
      emojiContainerRef.current.querySelector(`#${groupName}`).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Function to handle visibility change
  const handleVisibilityChange = (groupName, inView) => {
    if (inView) {
      setVisibleGroup(groupName);
      setActiveGroupName(groupName);
    }
  };

  const filterEmojis = emojis
    .flatMap((group) => group.emojis)
    .filter((emo) =>
      emo.name.toLocaleLowerCase().includes(emojiName.toLocaleLowerCase())
    );

  const displayedEmojis = emojiName
    ? [{ groupName: "search", emojis: filterEmojis }]
    : emojis;

  console.log("🚀 ---------------------------------------------🚀");
  console.log("🚀  EmojiBox  displayedEmojis", displayedEmojis);
  console.log("🚀 ---------------------------------------------🚀");

  return (
    <section className="bg-white dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white z-50 w-full sm:w-full md:w-[470px] lg:w-[600px] overflow-hidden sm:rounded-tr-lg">
      <form className="w-full mx-auto">
        <label
          htmlFor="default-search"
          className="text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="search"
            value={emojiName}
            onChange={(e) => setEmojiName(e.target.value)}
            id="default-search"
            className="block w-full p-1 ps-10 text-md text-gray-900 bg-gray-200 dark:bg-gray-900 dark:text-slate-300 outline-none"
            placeholder="Search Mockups, Logos..."
            required
          />
        </div>
      </form>
      <div
        className="max-h-80 overflow-y-auto custom-scrollbar py-0"
        ref={emojiContainerRef}
      >
        {displayedEmojis.map((emo) => {
          const { ref, inView } = useInView({
            threshold: 0.5, // Trigger when 50% of the item is visible
          });

          useEffect(() => {
            handleVisibilityChange(emo.groupName, inView);
          }, [inView, emo.groupName]);

          return (
            <div
              ref={ref}
              key={emo.groupName}
              id={emo.groupName}
              className="select-none"
            >
              <h1 className="text-center text-sm my-1 font-semibold">
                {emo.groupName}
              </h1>
              <div className="flex justify-center items-center flex-wrap gap-0">
                {emo.emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => emojiSend(emoji.emoji)}
                    className="focus:outline-none p-1 rounded-md text-2xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                  >
                    {emoji.emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center overflow-x-auto bg-gray-200 dark:bg-gray-900 py-1 px-1 sm:px-3">
        {emojis.map((e) => (
          <button
            key={e.groupName}
            className={`flex-shrink-0 p-2 sm:p-1 md:p-2 text-md lg:text-xl rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out ${
              activeGroupName === e.groupName
                ? "bg-gray-300 dark:bg-gray-600"
                : ""
            }`}
            onClick={() => handleGroupClick(e.groupName)}
          >
            {e.groupLogo}
          </button>
        ))}
      </div>
    </section>
  );
};

export default EmojiBox;
