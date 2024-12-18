import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CryptoSearchButtonProps {
  onClick: () => void;
}

export function CryptoSearchButton({ onClick }: CryptoSearchButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="hover:bg-secondary/40"
    >
      <Search className="h-5 w-5" />
    </Button>
  );
}