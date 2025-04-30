// ================================================
// FILE: src/components/AppLogo.tsx (Force black logo)
// ================================================
import { cn } from "@/lib/utils";
// REMOVE: import { useTheme } from "next-themes"; // Remove useTheme
import Image from "next/image";
import React from "react";

export default function AppLogo({ className, size = 80 }: { className?: string; size?: number }) {
	// REMOVE: const { resolvedTheme, theme } = useTheme();
	// REMOVE: const [mounted, setMounted] = React.useState(false);

	// REMOVE: React.useEffect(() => {
	// REMOVE: 	setMounted(true);
	// REMOVE: }, []);

	// Always use the black logo
	const logoSrc = "/groqlabs_logo-black.png";

	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			<Image
				src={logoSrc}
				alt="Groq"
				width={size}
				height={size}
				style={{ width: 'auto', height: size/3.41333333333 }}
			/>
		</div>
	);
}