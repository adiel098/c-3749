import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface UserSearchProps {
  onSearch: (query: string) => void;
}

export function UserSearch({ onSearch }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 h-4 w-4 text-[#E5DEFF]/50" />
      <Input
        placeholder="Search by name, email, or ID..."
        className="pl-10 bg-[#1A1F2C]/50 border-[#7E69AB]/20 text-[#E5DEFF] transition-all duration-200 focus:border-[#9b87f5]/40"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}