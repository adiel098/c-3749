import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandInput } from '@/components/ui/command';
import { CryptoSearchButton } from './CryptoSearchButton';
import { CryptoSearchList } from './CryptoSearchList';
import { useWebSocketData } from './useWebSocketData';

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
          </DialogHeader>
          
          <Command className="rounded-lg border-0">
            <CommandInput placeholder="חפש מטבעות..." className="border-0" />
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-destructive p-4 text-center">{error}</div>
            ) : (
              <CryptoSearchList 
                cryptoList={cryptoList}
                onSelect={onSelect}
                onClose={() => setSearchOpen(false)}
              />
            )}
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}