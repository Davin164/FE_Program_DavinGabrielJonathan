import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: initialValue = '',
  onChange,
  placeholder = 'Search...',
  className,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onChange]);

  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <Search className="absolute left-3.5 w-4 h-4 text-text-secondary pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-subtle"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            onChange('');
          }}
          className="absolute right-3 text-text-secondary hover:text-text-primary p-0.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
