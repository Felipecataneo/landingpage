// ================================================
// FILE: src/components/CopyButton.tsx (Simplified Tooltip)
// ================================================
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
// REMOVE: import { Tooltip } from "react-tooltip"; // Remove if react-tooltip is gone
import { Button } from "./ui/button";

interface CopyButtonProps {
	code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

    // Simplified button without external Tooltip component
	return (
        <Button
            onClick={handleCopy}
            variant="outline"
            size="icon"
            // You can add a simple title for native tooltips
            title={copied ? "Copiado" : "Copy code"}
            className="relative text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
            <IoCopyOutline size={20} />
            {/* Optional: Add a visual indicator next to the button */}
            {/* {copied && <span className="text-xs absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-1 rounded">Copied!</span>} */}
        </Button>
	);
}