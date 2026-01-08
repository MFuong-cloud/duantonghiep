"use client";

import { History, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PageItem {
  name: string;
  path: string;
}

interface SearchBoxProps {
  pages: PageItem[];
  placeholder?: string;
  className?: string; // Thêm prop này để nhận style từ bên ngoài nếu cần
}

const HISTORY_STORAGE_KEY = "admin-search-history";
const HISTORY_LIMIT = 6;

export default function SearchBox({ pages, placeholder, className }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PageItem[]>([]);
  const [history, setHistory] = useState<PageItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Không thể tải lịch sử tìm kiếm:", error);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = pages.filter((p) => p.name.toLowerCase().includes(value));
    setSuggestions(filtered);
  };

  const persistHistory = (page: PageItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.path !== page.path);
      const next = [page, ...filtered].slice(0, HISTORY_LIMIT);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      }

      return next;
    });
  };

  const handleSelect = (page: PageItem) => {
    persistHistory(page);
    router.push(page.path);
    setQuery("");
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0]);
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
    if (!query) return text;
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
    // Thêm w-full ở đây để component chiếm hết chiều rộng cha
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Ô tìm kiếm */}
      {/* Đã đổi w-80 thành w-full */}
      <div
        className={`flex items-center border rounded-full px-4 py-2 w-full shadow-sm transition-all duration-200 bg-white dark:bg-[#1a1a1a] ${isFocused
            ? "border-[#ff6600] ring-2 ring-[#ff6600]/40"
            : "border-gray-300 dark:border-gray-700"
          }`}
      >
        <Search
          className={`w-5 h-5 transition-colors duration-200 shrink-0 ${isFocused
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

      {(isFocused && (suggestions.length > 0 || (!query && history.length > 0))) && (
        <ul className="absolute top-12 left-0 w-full border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 bg-white dark:bg-[#1a1a1a]">
          {!query && history.length > 0 && (
            <li className="px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              Lịch sử gần đây
            </li>
          )}
          {(query ? suggestions : history).map((s) => (
            <li
              key={s.path}
              onClick={() => handleSelect(s)}
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