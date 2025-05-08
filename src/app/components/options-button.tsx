// components/studio/options-button.tsx (ou o caminho correto)
"use client"; // Adicionado "use client" se ainda não estiver no topo do arquivo

import { Button } from "@/components/ui/button"; // Usaremos o componente Button para o Trigger
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStudio } from "@/providers/studio-provider";
import { Ellipsis } from "lucide-react";

export function OptionsButton({ className }: { className?: string }) {
	const { setIsOverlayOpen, isOverlayOpen } = useStudio();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{/*
				  Este Button (que é o trigger do dropdown) agora NÃO tem 'lg:hidden'.
				  Isso significa que ele aparecerá em TODAS as larguras de tela.
				  O StudioView.tsx já controla quando o OptionsButton como um todo é renderizado
				  para mobile ou desktop.
				*/}
				<Button
					variant="ghost" // 'ghost' tem fundo transparente. 'outline' teria uma borda para mais destaque.
					size="icon"      // Garante padding e tamanho consistentes para um botão de ícone.
					className={cn(
						// Classes de cor e feedback visual:
						"text-neutral-300 hover:text-cyan-400 focus:text-cyan-400", // Cores para o ícone
						"hover:bg-purple-500/10 focus:bg-purple-500/10 active:bg-purple-500/20", // Feedback de fundo
						className // Permite sobrescrever ou adicionar classes de fora, se necessário.
					)}
					aria-label="Mais opções"
				>
					<Ellipsis size={24} /> {/* Ícone um pouco maior para melhor toque/visual */}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end" // Alinha o menu à direita do trigger. Importante se o botão estiver no canto.
				// Adicionando classes para o estilo do dropdown em tema escuro
				// O z-index do DropdownMenuContent do shadcn/ui geralmente é z-50, o que é bom.
				className="bg-neutral-850 border-neutral-700 text-neutral-200 shadow-xl w-56" // Definindo uma largura
			>
				<DropdownMenuItem
					onClick={() => setIsOverlayOpen(!isOverlayOpen)}
					// Estilos para o item do menu
					className="cursor-pointer hover:!bg-purple-600/30 focus:!bg-purple-600/30 hover:!text-cyan-300 focus:!text-cyan-300"
				>
					{isOverlayOpen ? "Fechar Prompt Detalhado" : "Ver Prompt Detalhado"}
				</DropdownMenuItem>
				{/* Você pode adicionar mais DropdownMenuItems aqui se precisar */}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}