import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "./button";

interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function TagInput({ tags, onChange, placeholder = "Nhập tag và nhấn Enter...", className, ...props }: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("");

    const addTagIfValid = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTagIfValid();
        }
    };

    const handleBlur = () => {
        addTagIfValid();
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={cn("flex flex-wrap gap-2 p-2 border rounded-md bg-background", className)}>
            {tags.map((tag) => (
                <div
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-accent rounded-md text-white"
                >
                    <span>{tag}</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-accent-foreground/20"
                        onClick={() => removeTag(tag)}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
                {...props}
            />
        </div>
    );
} 