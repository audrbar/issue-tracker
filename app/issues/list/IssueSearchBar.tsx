"use client";

import { TextField } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const IssueSearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }

      params.delete("page"); // Reset to page 1 when searching

      const query = params.toString() ? `?${params.toString()}` : "";
      router.push(`/issues/list${query}`);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(delaySearch);
  }, [searchTerm, router, searchParams]);

  return (
    <TextField.Root
      placeholder="Search issues by title or description..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      size="2"
      style={{ width: "300px" }}
    >
      <TextField.Slot side="left">
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
};

export default IssueSearchBar;
