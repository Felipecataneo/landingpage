"use client";

import { Suspense, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	vscDarkPlus,
	vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { type HistoryEntry, useStudio } from "@/providers/studio-provider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VersionSwitcher } from "./version-switcher";
import { NewButton } from "./new-button";
import { PromptInput } from "./prompt-input";
import { OptionsButton } from "./options-button";
import toast from "react-hot-toast";
import AppLogo from "@/components/AppLogo";
import { cn } from "@/lib/utils";
import ModelSelector from "@/components/model-selector";
import { useState } from "react";
import { MODEL_OPTIONS } from "@/utils/models";

export default function StudioView() {
	return (
		<Suspense>
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
		sessionId,
		setStudioMode,
		isApplying,
		isGenerating,
		isStreaming,
		streamingContent,
		streamingComplete,
		resetStreamingState,
		model,
		setModel,
	} = useStudio();

	return (
		<main className="h-screen flex flex-col overflow-hidden pt-20 text-white z-10">
			{/* Top Input Bar */}
			<div className="p-4 bg-black/30 backdrop-blur-sm lg:border-b border-purple-500/20 flex-shrink-0">
				<div className="flex flex-col gap-4">
					{/* Mobile Layout */}
					<div className="flex flex-col gap-4 lg:hidden">
						{/* Top Row - Controls */}
						<div className="flex items-center justify-between gap-2 mb-1">
							<NewButton />
							<VersionSwitcher
								className="justify-center fl</Button>ex-1"
								currentVersion={historyIndex + 1}
								totalVersions={history.length}
								onPrevious={() => navigateHistory("prev")}
								onNext={() => navigateHistory("next")}
							/>
							<OptionsButton />
						</div>
						{/* Bottom Row - Input and Model */}
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
				<div className="w-1/2 p-4 border-r border-purple-500/20 overflow-auto lg:block hidden bg-black/20 backdrop-blur-sm">
					<div className="relative h-full">
						<div
							className={cn(
								"absolute top-0 left-0 h-[2px] bg-cyan-500 animate-loader",
								isGenerating || isApplying ? "opacity-100" : "opacity-0",
							)}
						/>
						
						{isStreaming ? (
							// Streaming content view
							<div
								className="h-full rounded font-mono text-sm overflow-auto p-4 bg-black/30 text-cyan-100"
							>
								<div className="flex items-center mb-4">
									<div className="h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></div>
									<span className="text-xs text-cyan-200/70">
										Gerando seu site...
									</span>
								</div>
								<div className="whitespace-pre-wrap">
									{streamingContent || "Pensando..."}
								</div>
							</div>
						) : (
							// Code view with dark theme that fits our color scheme
							<SyntaxHighlighter
								language="html"
								style={vscDarkPlus}
								className="h-full rounded bg-black/30"
								customStyle={{ 
									margin: 0, 
									height: "100%", 
									width: "100%",
									background: "rgba(0,0,0,0.3)",
									borderRadius: "0.5rem"
								}}
							>
								{currentHtml || "<!-- HTML preview will appear here -->"}
							</SyntaxHighlighter>
						)}
						
						{/* CopyButton */}
						<div className="absolute bottom-4 left-4">
							<CopyButton code={currentHtml} />
						</div>
					</div>
				</div>

				{/* Right Column - Preview */}
				<div className="lg:w-1/2 w-full overflow-hidden bg-black/10 backdrop-blur-sm">
					<div className="h-full p-4 relative">
						{/* Mobile Code View - Only shown when streaming or generating */}
						{(isStreaming || isGenerating) && (
							<div
								className="lg:hidden block mb-4 rounded shadow-sm p-4 bg-black/30 border border-purple-500/20 text-cyan-100"
							>
								<div className="flex items-center mb-2">
									<div className="h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></div>
									<span className="text-xs text-cyan-200/70">
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
						
						{/* ReloadButton */}
						<div className="absolute top-6 right-6 flex gap-2 z-10">
							<ReloadButton iframeRef={iframeRef} />
						</div>
						<iframe
							title="Studio Preview"
							ref={iframeRef}
							srcDoc={`<!DOCTYPE html><html><head><title>Preview</title><script src="https://cdn.tailwindcss.com"></script><style>body{background-color:#ffffff;margin:0;}</style></head><body>${currentHtml}</body></html>`}
							className="w-full h-full border border-purple-500/20 rounded shadow-md"
							style={{ minHeight: "100%", minWidth: "100%", overflow: "auto" }}
						/>
					</div>
				</div>

				{/* Sliding Debug Overlay */}
				<div
					className={`fixed top-0 right-0 h-screen w-full md:w-[60vw] bg-gray-900/90 backdrop-blur-lg shadow-lg transform transition-transform duration-300 overflow-hidden z-50 text-white border-l border-purple-500/30 ${isOverlayOpen ? "translate-x-0" : "translate-x-full"}`}
				>
					<div className="h-full flex flex-col p-4">
						<div className="flex justify-between items-center mb-4 flex-shrink-0">
							<h2 className="font-medium text-cyan-200">Prompt</h2>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOverlayOpen(false)}
								className="text-gray-300 hover:text-white"
							>
								<X size={16} />
							</Button>
						</div>
						<pre className="flex-1 text-sm bg-black/20 p-4 rounded overflow-auto whitespace-pre-wrap border border-purple-500/20">
							{getFormattedOutput()}
						</pre>
					</div>
				</div>
			</div>
			
			{/* Footer Stat Section */}
			<div className="flex flex-col md:flex-row w-full max-w-3xl mx-auto px-4 md:px-0 bg-black/20 backdrop-blur-sm border-t border-purple-500/20">
				{/* Logo section */}
				<div className="md:w-1/2 md:pr-4 md:border-r md:border-purple-500/20 flex items-center justify-center md:justify-end py-2">
					<span className="hidden md:inline text-sm text-cyan-200/70">
						Powered by
					</span>
					<AppLogo className="scale-75" size={100} />
				</div>
				{/* Stats section */}
				<div className="md:w-1/2 md:pl-4 flex items-center justify-center md:justify-start py-2">
					<div className="text-sm text-cyan-200/70 text-center md:text-left">
						{/* Only show stats if usage data is available in history */}
						{history[historyIndex]?.usage && (
							<span>
								{(history[historyIndex].usage.total_time * 1000).toFixed(0)}ms •{" "}
								{history[historyIndex].usage.total_time > 0 ? Math.round(
									history[historyIndex].usage.total_tokens /
										history[historyIndex].usage.total_time,
								) : 0}{" "}
								tokens/sec •{" "}
								<a
									rel="noreferrer"
									target="_blank"
									className="underline text-cyan-300 hover:text-cyan-400"
									href="https://console.groq.com/docs/models"
								>
									Criado com Groq!
								</a>
							</span>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}