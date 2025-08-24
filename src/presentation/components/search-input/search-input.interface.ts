export interface SearchResult {
  id: string;
  label: string;
  subtitle?: string;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  results?: SearchResult[];
  isLoading?: boolean;
  className?: string;
  showResults?: boolean;
  onShowResultsChange?: (show: boolean) => void;
}
