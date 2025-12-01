"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect, ChangeEvent } from "react";
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
  const [history, setHistory] = useState<PageItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("search_history");
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Lỗi đọc lịch sử", e);
        }
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (!value.trim()) return setSuggestions([]);

    const filtered = pages.filter((p) => p.name.toLowerCase().includes(value));
    setSuggestions(filtered);
  };

  const handleSelect = (path: string, name: string) => {
    router.push(path);

    if (name) {
      setHistory((prev) => {
        const newHistory = [
          { name, path },
          ...prev.filter((item) => item.path !== path),
        ].slice(0, 5);
        localStorage.setItem("search_history", JSON.stringify(newHistory));
        return newHistory;
      });
    }

    setQuery("");
    setSuggestions([]);
    setIsFocused(false);
  };

  const removeHistory = (path: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.path !== path);
      localStorage.setItem("search_history", JSON.stringify(newHistory));
      return newHistory;
    });
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

  return (
    <div className="relative" ref={containerRef}>
      {/* màu Hover và Focus tìm kiếm */}
      <div
        className={`flex items-center border rounded-full px-4 py-2 w-80 shadow-sm transition-all duration-200 bg-white dark:bg-[#1a1a1a]
  hover:border-blue-500 hover:shadow-lg hover:shadow-blue-200/40 hover:bg-blue-50
  ${
    isFocused
      ? "border-cyan-500 ring-2 ring-cyan-500/40"
      : "border-gray-300 dark:border-gray-700"
  }`}
      >
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder={placeholder || "Tìm trang..."}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          className="bg-transparent outline-none ml-3 text-base text-gray-800 dark:text-gray-100 w-full"
        />
      </div>

      {/* Lịch sử gần đây */}
      {isFocused && query === "" && history.length > 0 && (
        <ul className="absolute top-12 left-0 w-80 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 bg-white dark:bg-[#1a1a1a]">
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase">
            Lịch sử gần đây
          </div>

          {history.map((item) => (
            <li
              key={item.path}
              className="flex items-center justify-between px-4 py-2 group cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              onClick={() => handleSelect(item.path, item.name)}
            >
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {item.name}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistory(item.path);
                }}
                className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Gợi ý khi nhập */}
      {isFocused && suggestions.length > 0 && query !== "" && (
        <ul className="absolute top-12 left-0 w-80 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 bg-white dark:bg-[#1a1a1a]">
          {suggestions.map((s) => (
            <li
              key={s.path}
              onClick={() => handleSelect(s.path, s.name)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-sm text-gray-700 dark:text-gray-200"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
