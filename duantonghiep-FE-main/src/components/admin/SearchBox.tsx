"use client";

import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PageItem {
  name: string;
  path: string;
}

interface SearchBoxProps {
  pages: PageItem[];
  placeholder?: string;
}

export default function SearchBox({ pages, placeholder }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PageItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (!value.trim()) return setSuggestions([]);

    const filtered = pages.filter((p) => p.name.toLowerCase().includes(value));
    setSuggestions(filtered);
  };

  const handleSelect = (path: string) => {
    router.push(path);
    setQuery("");
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0].path);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightMatch = (text: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <>
        {before}
        <span className="text-[#ff6600] font-semibold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Ô tìm kiếm */}
      <div
        className={`flex items-center border rounded-full px-4 py-2 w-80 shadow-sm transition-all duration-200 bg-white dark:bg-[#1a1a1a] ${
          isFocused
            ? "border-[#ff6600] ring-2 ring-[#ff6600]/40"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <Search
          className={`w-5 h-5 transition-colors duration-200 ${
            isFocused
              ? "text-[#ff6600]"
              : "text-gray-500 dark:text-gray-400"
          }`}
        />
        <input
          type="text"
          placeholder={placeholder || "Tìm trang..."}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !query && setIsFocused(false)}
          className="bg-transparent outline-none ml-3 text-base text-gray-800 dark:text-gray-100 w-full placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {/* Danh sách gợi ý */}
      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 w-80 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 bg-white dark:bg-[#1a1a1a]">
          {suggestions.map((s) => (
            <li
              key={s.path}
              onClick={() => handleSelect(s.path)}
              className="px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-[#2a2a2a] text-sm text-gray-700 dark:text-gray-200 transition-colors"
            >
              {highlightMatch(s.name)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
