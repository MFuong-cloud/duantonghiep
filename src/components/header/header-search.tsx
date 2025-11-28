"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, X } from "lucide-react"; // Đảm bảo bạn đã cài lucide-react

export default function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load lịch sử từ localStorage khi component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm thực hiện tìm kiếm
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    // 1. Lưu vào lịch sử (loại bỏ trùng lặp và giới hạn 5 mục gần nhất)
    const newHistory = [searchTerm, ...history.filter((h) => h !== searchTerm)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    // 2. Đóng dropdown và reset input (tuỳ chọn)
    setIsFocused(false);

    // 3. Xoá nội dung thanh tìm kiếm
    setQuery("");
    
    // 4. Chuyển hướng sang trang kết quả 
    router.push(`/${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const removeHistoryItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    const newHistory = history.filter((item) => item !== itemToRemove);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-4 hidden md:block">
      <div className="relative">
        {/* Icon Search */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>

        {/* Input Thanh Tìm Kiếm */}
        <input
          ref={inputRef}
          type="text"
          className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-background/50 focus:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          placeholder="Tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Dropdown Lịch Sử Tìm Kiếm */}
      {isFocused && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground rounded-xl border shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
            Lịch sử tìm kiếm
          </div>
          <ul>
            {history.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 cursor-pointer text-sm group"
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
                <button
                  onClick={(e) => removeHistoryItem(e, item)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-muted p-1 rounded-full transition-all"
                  title="Xóa"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}