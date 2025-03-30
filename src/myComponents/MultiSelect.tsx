
import { useState, useRef, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxDisplay?: number;
  className?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  maxDisplay = 3,
  className = "",
  emptyMessage = "No items found.",
  disabled = false,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemove = (value: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          handleRemove(selected[selected.length - 1]);
        }
      }
      // Close dropdown on escape
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const displayOptions = options.filter((option) => 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const displaySelectedCount = 
    selected.length > maxDisplay ? maxDisplay : selected.length;
  
  const displaySelected = selected.slice(0, displaySelectedCount);
  const remainingCount = selected.length - displaySelectedCount;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-10 w-full justify-between text-sm font-normal",
            selected.length > 0 ? "h-auto" : "",
            className
          )}
          onClick={() => setOpen(!open)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 p-1">
            {displaySelected.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="rounded-md px-2 py-1 text-xs font-normal"
              >
                {item}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => handleRemove(item, e)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="secondary" className="rounded-md px-2 py-1 text-xs">
                +{remainingCount} more
              </Badge>
            )}
            {selected.length === 0 && (
              <span className="py-1 text-sm text-muted-foreground">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0">
        <Command shouldFilter={false} className="max-h-full">
          <CommandInput
            ref={inputRef}
            placeholder="Search..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList className="max-h-[230px]">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="overflow-auto">
              {displayOptions.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      isSelected ? "bg-secondary" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
