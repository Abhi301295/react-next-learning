import Input from "@/components/ui/Input";
import { memo } from "react";

interface SearchProps {
  onChange: (value: string) => void;
}

const Search = ({ onChange }: SearchProps) => {
  return (
    <Input
      id="search"
      label="Search users"
      type="text"
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search users"
    />
  );
};

export default memo(Search);
