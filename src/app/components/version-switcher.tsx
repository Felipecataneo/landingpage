import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
interface VersionSwitcherProps {
	currentVersion: number;
	totalVersions: number;
	onPrevious: () => void;
	onNext: () => void;
	className?: string;
}

export function VersionSwitcher({
	currentVersion,
	totalVersions,
	onPrevious,
	onNext,
	className = "",
}: VersionSwitcherProps) {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<Button
				variant="ghost"
				size="icon"
				onClick={onPrevious}
				disabled={currentVersion <= 1}
				aria-label="Versões anteriores"
			>
				<ChevronLeft size={20} />
			</Button>
			<span className="text-sm dark:text-gray-400 text-gray-600 min-w-[80px] text-center">
				Versão {currentVersion} de {totalVersions}
			</span>
			<Button
				variant="ghost"
				size="icon"
				onClick={onNext}
				disabled={currentVersion >= totalVersions}
				aria-label="Próxima Versão"
			>
				<ChevronRight size={20} />
			</Button>
		</div>
	);
}
