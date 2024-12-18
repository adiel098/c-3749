import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocketData } from "./useWebSocketData";
import { CryptoSearchResults } from "./CryptoSearchResults";

interface CryptoSearchProps {
  onSelect: (symbol: string) => void;
}

export function CryptoSearch({ onSelect }: CryptoSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { cryptoList, isLoading, error } = useWebSocketData(open);

  const filteredCryptos = cryptoList.filter((crypto) =>
    crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

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
            <DialogTitle>Search Cryptocurrencies</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-primary/20 bg-secondary/20 focus:border-primary/40 transition-colors"
            />

            <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
              <CryptoSearchResults
                cryptoList={filteredCryptos}
                isLoading={isLoading}
                error={error}
                onSelect={onSelect}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}