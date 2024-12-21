import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface ActivityFiltersProps {
  type: string;
  setType: (type: string) => void;
  dateRange: Date | undefined;
  setDateRange: (date: Date | undefined) => void;
}

export function ActivityFilters({ type, setType, dateRange, setDateRange }: ActivityFiltersProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Activity</SelectItem>
          <SelectItem value="transaction">Transactions</SelectItem>
          <SelectItem value="position">Positions</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? format(dateRange, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateRange}
            onSelect={setDateRange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(type !== 'all' || dateRange) && (
        <Button 
          variant="ghost" 
          onClick={() => {
            setType('all');
            setDateRange(undefined);
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}