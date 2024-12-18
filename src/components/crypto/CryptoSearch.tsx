import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { CryptoSearchResults } from "./CryptoSearchResults";

interface CryptoSearchProps {
  onSelect: (symbol: string) => void;
}

export function CryptoSearch({ onSelect }: CryptoSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="bg-secondary/20 hover:bg-secondary/40"
      >
        <Search className="h-5 w-5 text-primary" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>חיפוש מטבעות</DialogTitle>
          </DialogHeader>

          <Command className="rounded-lg border shadow-sm">
            <CommandInput
              placeholder="חפש לפי שם או סימול..."
              value={search}
              onValueChange={setSearch}
              className="border-none focus:ring-0"
            />

            <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
              <CryptoSearchResults
                searchTerm={search}
                onSelect={onSelect}
                onClose={() => setOpen(false)}
              />
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}