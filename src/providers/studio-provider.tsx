// ================================================
// FILE: src/providers/studio-provider.tsx (Remove theme logic)
// ================================================
import { useState, useRef, useEffect, useCallback } from "react";
import { providerFactory } from "./provider-factory";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { constructPrompt } from "@/utils/prompt";
// REMOVE: import { useTheme } from "next-themes"; // Remove useTheme
import { EASTER_EGGS } from "@/data/easter-eggs";
import { MODEL_OPTIONS } from "@/utils/models";

export interface HistoryEntry {
	html: string;
	feedback: string;
	query: string;
	reasoning?: string;
	usage?: {
		total_time: number;
		total_tokens: number;
	};
}

const [StudioProvider, useStudio] = providerFactory(() => {
	const [query, setQuery] = useState("");
	const [studioMode, setStudioMode] = useState(false);
	const [triggerGeneration, setTriggerGeneration] = useState(false);
	const [currentHtml, setCurrentHtml] = useState("");
	const [currentFeedback, setCurrentFeedback] = useState("");
	const [isOverlayOpen, setIsOverlayOpen] = useState(false);
	const [mode, setMode] = useState<"query" | "feedback">("query");
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [sessionId] = useState(() => uuidv4());
	const [isGenerating, setIsGenerating] = useState(false);
	const [isApplying, setIsApplying] = useState(false);
	const [drawingData, setDrawingData] = useState<string | null>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	// REMOVE: const { resolvedTheme } = useTheme(); // Remove useTheme call

	const [feedbackHistory, setFeedbackHistory] = useState<string[]>([]);
	const [feedbackHistoryIndex, setFeedbackHistoryIndex] = useState(-1);
	const [model, setModel] = useState(() => {
		if (typeof window !== "undefined") {
			const storedModel = localStorage.getItem("selectedModel");
			if (storedModel && MODEL_OPTIONS.includes(storedModel)) {
				return storedModel;
			}
		}
		return MODEL_OPTIONS[0];
	});

	const [isStreaming, setIsStreaming] = useState(false);
	const [streamingContent, setStreamingContent] = useState("");
	const [streamingComplete, setStreamingComplete] = useState(false);

	// Effect to update localStorage when model changes (Keep)
	useEffect(() => {
		if (typeof window !== "undefined" && model) {
			localStorage.setItem("selectedModel", model);
		}
	}, [model]);

	// Helper function to reset streaming state (Keep)
	const resetStreamingState = () => {
		setIsStreaming(false);
		setStreamingContent("");
		setStreamingComplete(false);
	};

	// Generate HTML function (Simplified - Removed theme from API body)
	const generateHtml = useCallback(async () => {
		setIsGenerating(true);
		setIsStreaming(true);
		setStreamingContent("");
		setStreamingComplete(false);

		try {
			let currentQuery = query;
			const easterEgg = EASTER_EGGS.find(
				(egg) => egg.trigger.toLowerCase() === query.trim().toLowerCase()
			);
			if (easterEgg) {
				currentQuery = easterEgg.prompt;
				setQuery(currentQuery);
			}

			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: currentQuery,
					currentHtml,
					drawingData,
					// REMOVE: theme: resolvedTheme, // Removed theme from API body
					model: model,
					stream: true
				}),
			});

			if (!response.ok) {
                const errorData = await response.json();
				if (response.status === 400 && errorData.category) {
                    toast.error(
						<div>
							<p>{errorData.error}</p>
							<p className="text-sm text-gray-500 mt-1">
								Category: {errorData.category}
							</p>
						</div>,
						{ duration: 5000 },
					);
                } else {
                    toast.error(errorData.error || "Failed to generate HTML");
                }
				throw new Error(errorData.error || "Failed to generate HTML");
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			
			if (!reader) {
				throw new Error("Failed to get reader from response");
			}
			
			let reasoning = "";
			let done = false;
			let html = "";
			let usage = undefined;

			while (!done) {
				const { value, done: readerDone } = await reader.read();
				done = readerDone;
				
				if (value) {
					const text = decoder.decode(value);
					const lines = text.split("\n").filter(line => line.trim());
					
					for (const line of lines) {
						try {
							const data = JSON.parse(line);
							
							if (data.type === "chunk") {
								setStreamingContent(prev => prev + data.content);
								reasoning += data.content;
							} else if (data.type === "complete") {
								html = data.html;
                                if (data.usage) usage = data.usage;
								setStreamingComplete(true);
							} else if (data.type === "error") {
								throw new Error(data.error);
							}
						} catch (e) {
							console.error("Error parsing streaming response line:", line, e);
						}
					}
				}
			}
			
			const newEntry: HistoryEntry = {
				html,
				feedback: "",
				query: currentQuery,
				reasoning,
				usage,
			};
			
			const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
			setHistory(newHistory);
			setHistoryIndex(newHistory.length - 1);
			setCurrentHtml(html);
			setMode("feedback");
			setCurrentFeedback("");
			
		} catch (error) {
			console.error("Error generating HTML:", error);
		} finally {
			setIsGenerating(false);
			setIsStreaming(false);
		}
	}, [query, currentHtml, history, historyIndex, setHistory, setHistoryIndex, setCurrentHtml, setMode, setQuery, drawingData, model, resetStreamingState]);

	// Submit Feedback function (Simplified - Removed theme from API body)
	const submitFeedback = async () => {
		setIsApplying(true);
		setIsStreaming(true);
		setStreamingContent("");
		setStreamingComplete(false);

		try {
			const trimmedFeedback = currentFeedback.trim();
			if (!trimmedFeedback) {
				toast.error("Please enter feedback");
				setIsApplying(false);
				setIsStreaming(false);
				return;
			}

			setFeedbackHistory(prev => {
				const dedupedHistory = prev.filter(f => f !== trimmedFeedback);
				return [trimmedFeedback, ...dedupedHistory];
			});
			setFeedbackHistoryIndex(-1);

			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					currentHtml: history[historyIndex].html,
					feedback: trimmedFeedback,
					// REMOVE: theme: resolvedTheme, // Removed theme from API body
					model: model,
					stream: true,
				}),
			});

			if (!response.ok) {
                 const errorData = await response.json();
				if (response.status === 400 && errorData.category) {
                    toast.error(
						<div>
							<p>{errorData.error}</p>
							<p className="text-sm text-gray-500 mt-1">
								Category: {errorData.category}
							</p>
						</div>,
						{ duration: 5000 },
					);
                } else {
                    toast.error(errorData.error || "Failed to apply edit");
                }
				throw new Error(errorData.error || "Failed to apply edit");
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			
			if (!reader) {
				throw new Error("Failed to get reader from response");
			}
			
			let reasoning = "";
			let done = false;
			let html = "";
			let usage = undefined;

			while (!done) {
				const { value, done: readerDone } = await reader.read();
				done = readerDone;
				
				if (value) {
					const text = decoder.decode(value);
					const lines = text.split("\n").filter(line => line.trim());
					
					for (const line of lines) {
						try {
							const data = JSON.parse(line);
							
							if (data.type === "chunk") {
								setStreamingContent(prev => prev + data.content);
								reasoning += data.content;
							} else if (data.type === "complete") {
								html = data.html;
                                if (data.usage) usage = data.usage;
								setStreamingComplete(true);
							} else if (data.type === "error") {
								throw new Error(data.error);
							}
						} catch (e) {
							console.error("Error parsing streaming response line:", line, e);
						}
					}
				}
			}

			const newEntry: HistoryEntry = {
				html,
				feedback: "",
				query: history[historyIndex].query,
				reasoning,
				usage,
			};
			
			const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
			setHistory(newHistory);
			setHistoryIndex(newHistory.length - 1);
			setCurrentHtml(html);
			setCurrentFeedback("");
			setMode("feedback");

		} catch (error) {
			console.error("Error applying edit:", error);
		} finally {
			setIsApplying(false);
			setIsStreaming(false);
		}
	};

	// Navigate History (Keep)
	const navigateHistory = (direction: "prev" | "next") => {
		resetStreamingState();
		
		const newIndex = direction === "prev" ? historyIndex - 1 : historyIndex + 1;
		if (newIndex >= 0 && newIndex < history.length) {
			setHistoryIndex(newIndex);
			setCurrentHtml(history[newIndex].html);
			setCurrentFeedback(history[newIndex].feedback || "");
			setMode("feedback");
		}
	};

	// Get formatted output (Simplified - Removed theme from prompt construction)
	const getFormattedOutput = () => {
		return constructPrompt({
			query: historyIndex >= 0 ? history[historyIndex].query : query,
			currentFeedback,
			currentHtml,
			// REMOVE: theme: resolvedTheme, // Removed theme from prompt construction
            theme: "light", // Explicitly state light theme in prompt instructions
		});
	};

	// Keep other effects (Escape key, triggerGeneration, historyIndex change, unmount cleanup)

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsOverlayOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [setIsOverlayOpen]);

	useEffect(() => {
		if (triggerGeneration) {
			setTriggerGeneration(false);
			generateHtml();
		}
	}, [triggerGeneration, setTriggerGeneration, generateHtml]);

	useEffect(() => {
		if (history.length > 0 && historyIndex >= 0) {
			resetStreamingState();
		}
	}, [historyIndex, history.length]);

	useEffect(() => {
		return () => {
			resetStreamingState();
		};
	}, []);

	useEffect(() => {
		if (studioMode && history.length === 0) {
		}
	}, [studioMode, history.length]);


	return {
		query, setQuery,
		studioMode, setStudioMode,
		triggerGeneration, setTriggerGeneration,
		history, setHistory,
		historyIndex, setHistoryIndex,
		navigateHistory,
		mode, setMode,
		currentHtml, setCurrentHtml,
		currentFeedback, setCurrentFeedback,
		isOverlayOpen, setIsOverlayOpen,
		isGenerating, setIsGenerating,
		isApplying, setIsApplying,
		generateHtml, submitFeedback,
		getFormattedOutput,
		iframeRef,
		sessionId,
		drawingData, setDrawingData,
		feedbackHistory, setFeedbackHistory,
		feedbackHistoryIndex, setFeedbackHistoryIndex,
		model, setModel,
		isStreaming, setIsStreaming,
		streamingContent, setStreamingContent,
		streamingComplete, setStreamingComplete,
		resetStreamingState,
	};
});

export { StudioProvider, useStudio };