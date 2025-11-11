"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((x) => x);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-sm text-gray-400 flex items-center gap-2"
    >
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
      >
        <Home size={16} />
        <span>Trang</span>
      </Link>

      {paths.slice(1).map((p, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-gray-500" />
          <span className="capitalize text-gray-300">
            {decodeURIComponent(p.replace("-", " "))}
          </span>
        </span>
      ))}
    </motion.nav>
  );
}
