"use client";

import { Suspense, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"; // Removido 'vs' pois não estava sendo usado
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { useStudio } from "@/providers/studio-provider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VersionSwitcher } from "./version-switcher";
import { NewButton } from "./new-button";
import { PromptInput } from "./prompt-input";
import { OptionsButton } from "./options-button";
// import toast from "react-hot-toast"; // Não usado diretamente aqui
// import AppLogo from "@/components/AppLogo"; // Não usado diretamente aqui
import { cn } from "@/lib/utils";
import ModelSelector from "@/components/model-selector";
// import { useState } from "react"; // Não usado diretamente aqui
import { MODEL_OPTIONS } from "@/utils/models";

// Definindo um tema base escuro para o iframe
const iframeDarkThemeStyles = `
  body {
    background-color: #171717; /* Ex: zinc-900 */
    color: #e5e5e5; /* Ex: neutral-200 */
    margin: 0;
    font-family: sans-serif; /* Adiciona uma fonte base */
  }
  /* Você pode adicionar mais estilos globais para o iframe aqui */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #262626; /* neutral-800 */
  }
  ::-webkit-scrollbar-thumb {
    background: #525252; /* neutral-600 */
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #737373; /* neutral-500 */
  }
`;

export default function StudioView() {
	return (
		<Suspense fallback={<div className="h-screen w-screen bg-black flex items-center justify-center text-white">Carregando Studio...</div>}>
			<HomeContent />
		</Suspense>
	);
}

function HomeContent() {
	const {
		history,
		historyIndex,
		navigateHistory,
		currentHtml,
		isOverlayOpen,
		setIsOverlayOpen,
		getFormattedOutput,
		iframeRef,
		// sessionId, // Não usado
		// setStudioMode, // Não usado
		isApplying,
		isGenerating,
		isStreaming,
		streamingContent,
		// streamingComplete, // Não usado
		// resetStreamingState, // Não usado
		model,
		setModel,
	} = useStudio();

	return (
		// Mantido pt-20, assumindo um header fixo acima desta view
		<main className="h-screen flex flex-col overflow-hidden pt-20 text-neutral-200 bg-neutral-950 z-10">
			{/* Top Input Bar */}
			{/* Aumentada a opacidade e usado um cinza mais escuro */}
			<div className="p-4 z-20 relative bg-neutral-900/80 backdrop-blur-md lg:border-b border-purple-500/30 flex-shrink-0 shadow-lg">
				<div className="flex flex-col gap-4">
					{/* Mobile Layout */}
					<div className="flex flex-col gap-4 lg:hidden">
						<div className="flex items-center justify-between gap-2 mb-1">
							<NewButton />
							<VersionSwitcher
								className="justify-center flex-1" // Corrigido typo "fl</Button>ex-1"
								currentVersion={historyIndex + 1}
								totalVersions={history.length}
								onPrevious={() => navigateHistory("prev")}
								onNext={() => navigateHistory("next")}
							/>
							<OptionsButton />
						</div>
						<div className="flex flex-col gap-2">
							<div className="w-full">
								<PromptInput />
							</div>
							<div className="w-full">
								<ModelSelector
									options={MODEL_OPTIONS}
									onChange={setModel}
									initialModel={model}
								/>
							</div>
						</div>
					</div>

					{/* Desktop Layout */}
					<div className="hidden lg:flex items-center gap-4">
						<NewButton />
						<VersionSwitcher
							currentVersion={historyIndex + 1}
							totalVersions={history.length}
							onPrevious={() => navigateHistory("prev")}
							onNext={() => navigateHistory("next")}
						/>
						<div className="flex-1">
							<PromptInput />
						</div>
						<ModelSelector
							options={MODEL_OPTIONS}
							onChange={setModel}
							initialModel={model}
						/>
						<OptionsButton />
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Column - Code View or Streaming Content */}
				{/* Usado um fundo mais opaco e consistente */}
				<div className="w-1/2 p-4 border-r border-purple-500/30 overflow-auto lg:block hidden bg-neutral-900/70 backdrop-blur-md">
					<div className="relative h-full">
						<div
							className={cn(
								"absolute top-0 left-0 h-[2px] bg-cyan-500 animate-loader",
								isGenerating || isApplying ? "opacity-100" : "opacity-0",
							)}
						/>
						
						{isStreaming ? (
							<div
								// Fundo consistente com o SyntaxHighlighter
								className="h-full rounded font-mono text-sm overflow-auto p-4 bg-neutral-950 text-cyan-200 border border-neutral-700"
							>
								<div className="flex items-center mb-4">
									<div className="h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></div>
									<span className="text-xs text-cyan-300/80">
										Gerando seu site...
									</span>
								</div>
								<div className="whitespace-pre-wrap">
									{streamingContent || "Pensando..."}
								</div>
							</div>
						) : (
							// vscDarkPlus já tem um fundo escuro. CustomStyle para preencher e arredondar.
							<SyntaxHighlighter
								language="html"
								style={vscDarkPlus} // Este estilo já define um fundo escuro
								className="h-full rounded" // Removido bg-black/30 daqui, vscDarkPlus cuida disso.
								customStyle={{ 
									margin: 0, 
									height: "100%", 
									width: "100%",
									// background: "transparent", // Deixe vscDarkPlus definir ou defina um específico aqui
									borderRadius: "0.375rem", // Tailwind's rounded-md
									// Se vscDarkPlus não for escuro o suficiente ou não cobrir tudo:
									// background: "#1e1e1e", // Exemplo de fundo escuro explícito
								}}
								codeTagProps={{
                  style: { fontFamily: '"Fira Code", "Consolas", monospace' } // Exemplo de fonte monoespaçada
                }}
							>
								{currentHtml || "<!-- HTML preview will appear here -->"}
							</SyntaxHighlighter>
						)}
						
						<div className="absolute bottom-4 left-4">
							<CopyButton code={currentHtml} />
						</div>
					</div>
				</div>

				{/* Right Column - Preview */}
				{/* Usado um fundo mais opaco e consistente */}
				<div className="lg:w-1/2 w-full overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
					<div className="h-full p-4 relative">
						{(isStreaming || isGenerating) && (
							<div
								// Fundo e borda consistentes
								className="lg:hidden block mb-4 rounded shadow-md p-4 bg-neutral-950 border border-purple-500/30 text-cyan-200"
							>
								<div className="flex items-center mb-2">
									<div className="h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></div>
									<span className="text-xs text-cyan-300/80">
										{isStreaming ? "Gerando seu site..." : "Processando..."}
									</span>
								</div>
								{isStreaming && (
									<div className="whitespace-pre-wrap font-mono text-xs max-h-[200px] overflow-auto">
										{streamingContent || "Pensando..."}
									</div>
								)}
							</div>
						)}
						
						<div className="absolute top-6 right-6 flex gap-2 z-10">
							<ReloadButton iframeRef={iframeRef} />
						</div>
						<iframe
							title="Studio Preview"
							ref={iframeRef}
							// srcDoc com tema escuro e tailwind
							srcDoc={`<!DOCTYPE html>
                        <html>
                          <head>
                            <title>Preview</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              ${iframeDarkThemeStyles}
                            </style>
                          </head>
                          <body>
                            ${currentHtml}
                          </body>
                        </html>`}
							className="w-full h-full border border-purple-500/40 rounded-md shadow-lg bg-transparent" // bg-transparent para o iframe em si, o srcDoc cuida do fundo
							style={{ minHeight: "100%", minWidth: "100%", overflow: "auto" }}
						/>
					</div>
				</div>

				{/* Sliding Debug Overlay */}
				{/* Mantido bg-gray-900/90 que é bem escuro, ajustado texto e borda */}
				<div
					className={`fixed top-0 right-0 h-screen w-full md:w-[60vw] bg-neutral-950/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 overflow-hidden z-50 text-neutral-200 border-l border-purple-500/40 ${isOverlayOpen ? "translate-x-0" : "translate-x-full"}`}
				>
					<div className="h-full flex flex-col p-6">
						<div className="flex justify-between items-center mb-6 flex-shrink-0">
							<h2 className="font-semibold text-lg text-cyan-300">Prompt Detalhado</h2>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOverlayOpen(false)}
								className="text-neutral-400 hover:text-cyan-300 hover:bg-purple-500/20"
							>
								<X size={20} />
							</Button>
						</div>
						<pre className="flex-1 text-sm bg-black/50 p-4 rounded-md overflow-auto whitespace-pre-wrap border border-purple-500/30 text-neutral-300 font-mono">
							{getFormattedOutput()}
						</pre>
					</div>
				</div>
			</div>
		</main>
	);
}