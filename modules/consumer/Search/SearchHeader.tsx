"use client";

import { motion } from "motion/react";
import { Search as SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type SearchHeaderProps = {
  keywordDraft: string | null;
  onKeywordDraftChange: (value: string | null) => void;
  onSearchSubmit: () => void;
};

export function SearchHeader({
  keywordDraft,
  onKeywordDraftChange,
  onSearchSubmit,
}: SearchHeaderProps) {
  return (
    <header className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-deep-charcoal mb-6">
          Tìm kiếm sách
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <InputGroup className="max-w-xl w-full h-14 rounded-full">
            <InputGroupAddon>
              <InputGroupButton variant="ghost">
                <SearchIcon className="size-5" />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupInput
              value={keywordDraft || ""}
              onChange={(e) => onKeywordDraftChange(e.target.value)}
              className="h-full"
              placeholder="Tìm kiếm tựa sách, tác giả hoặc mã ISBN..."
            />
            <InputGroupAddon align="inline-end" className="h-full">
              <InputGroupButton
                className="rounded-full h-full px-8"
                variant="secondary"
                type="submit"
              >
                Tìm kiếm
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </motion.div>
    </header>
  );
}
