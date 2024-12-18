import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandInput } from '@/components/ui/command';
import { CryptoSearchButton } from './CryptoSearchButton';
import { CryptoSearchResults } from './CryptoSearchResults';
import { useWebSocketData } from '@/hooks/useWebSocketData';

interface CryptoSearchProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  onSelect: (symbol: string) => void;
}

export function CryptoSearch({ searchOpen, setSearchOpen, onSelect }: CryptoSearchProps) {
  const { cryptoList, isLoading, error } = useWebSocketData(searchOpen);

  return (
    <>
      <CryptoSearchButton onClick={() => setSearchOpen(true)} />
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>חיפוש מטבעות</DialogTitle>
            <DialogDescription>
              חפש וסחר במטבעות קריפטו פופולריים
            </DialogDescription>
          </DialogHeader>
          <Command className="rounded-lg border-0">
            <CommandInput placeholder="חפש מטבעות..." className="border-0" />
            <CryptoSearchResults 
              cryptoList={cryptoList || []} 
              isLoading={isLoading}
              error={error}
              onSelect={onSelect}
              onClose={() => setSearchOpen(false)}
            />
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}