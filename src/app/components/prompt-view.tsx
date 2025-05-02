import { MicrophoneButton } from "@/components/MicrophoneButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStudio } from "@/providers/studio-provider";
import { useState } from "react";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import ModelSelector from "@/components/model-selector";
import { MAINTENANCE_GENERATION } from "@/lib/settings";

export default function PromptView() {
	const {
		setStudioMode,
		query,
		setQuery,
		setTriggerGeneration,
		drawingData,
		model,
		setModel,
		resetStreamingState,
        isGenerating,
	} = useStudio();
	
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim() && !drawingData) {
			toast.error("Descreva seu site!");
			return;
		}
        if (isGenerating) return;

		resetStreamingState();
		setStudioMode(true);
		setTriggerGeneration(true);
	};

    const handleTranscription = (transcription: string) => {
		setQuery(transcription);
		resetStreamingState();
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	return (
		<div className="flex flex-col gap-6 items-center justify-center min-h-screen z-10">
			<div className="flex flex-col gap-3 items-center justify-center min-w-[50%] px-4 md:px-0 mt-10">
				<div>
					<h1 className="text-[2em] md:text-[3em] font-montserrat text-center text-white">
						Vamos ser criativos juntos!
					</h1>
					<h2 className="text-[1.2em] md:text-[1.4em] font-montserrat mb-4 md:mb-8 text-center text-cyan-200/70 flex items-center justify-center gap-2">
						criando um site utilizando Groq
						<img src="/Groq_Bolt.svg" alt="Groq Logo" className="w-8 h-8" />
					</h2>
				</div>
				
				{MAINTENANCE_GENERATION && (
					<div className="text-center text-gray-300 flex items-center gap-2 border border-groq rounded-full p-4 my-4 bg-black/30 backdrop-blur-sm">
						<Info className="h-5 w-5" />
						{"We're currently undergoing maintenance. We'll be back soon!"}
					</div>
				)}
				
				<form
					className="flex flex-col relative border-2 border-purple-500/30 border-solid rounded-lg p-4 w-full max-w-2xl bg-black/20 backdrop-blur-sm focus-within:border-cyan-400/70 transition-all duration-300"
					onSubmit={handleSubmit}
				>
					<Textarea
						disabled={MAINTENANCE_GENERATION || isGenerating}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full h-16 p-3 text-sm bg-transparent focus:outline-none resize-none border-none focus-visible:ring-0 text-white placeholder:text-gray-400"
						placeholder="Descreva seu site..."
						rows={3}
					/>
					
					<div className="flex justify-between items-center w-full mt-4">
						<div className="flex items-center gap-2 text-white">
							<MicrophoneButton
								onTranscription={handleTranscription}
								disabled={MAINTENANCE_GENERATION || isGenerating}
							/>
						</div>
						<div className="flex items-center gap-2 ml-auto">
							<ModelSelector
								onChange={(newModel) => {
									setModel(newModel);
								}}
								initialModel={model}
							/>
							<Button
								className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
								type="submit"
								disabled={MAINTENANCE_GENERATION || isGenerating}
							>
								Criar
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}