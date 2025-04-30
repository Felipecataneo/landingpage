// ================================================
// FILE: src/app/api/generate/route.ts (Simplified)
// ================================================
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { constructPrompt } from "@/utils/prompt";
// REMOVE: import { signHtml } from "@/server/signing"; // Signing not needed without persistence
// REMOVE: import {
// REMOVE: 	PRIMARY_MODEL,
// REMOVE: 	VANILLA_MODEL,
// REMOVE: 	PRIMARY_VISION_MODEL,
// REMOVE: 	FALLBACK_VISION_MODEL,
// REMOVE: 	getFallbackModel,
// REMOVE: 	getModelTemperature,
// REMOVE: 	getModelMaxTokens
// REMOVE: } from "@/utils/models"; // Simplify model imports
import {
	MAINTENANCE_GENERATION,
	MAINTENANCE_USE_VANILLA_MODEL, // Keep if you use vanilla model for maintenance
} from "@/lib/settings";
import { getModelTemperature, getModelMaxTokens, getModelConfig, MODEL_OPTIONS } from "@/utils/models"; // Use simplified models

const client = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

// Keep safety check if desired
async function checkContentSafety(
	content: string,
): Promise<{ safe: boolean; category?: string }> {
	try {
		const safetyCheck = await client.chat.completions.create({
			messages: [{ role: "user", content }],
			model: "llama-guard-3-8b",
			temperature: 0,
			max_tokens: 10,
		});

		const response = safetyCheck.choices[0]?.message?.content || "";
		const lines = response.trim().split("\n");

		return {
			safe: lines[0] === "safe",
			category: lines[0] === "unsafe" ? lines[1] : undefined,
		};
	} catch (error) {
		console.error("Error checking content safety:", error);
		// Default to safe if check fails to avoid blocking users unnecessarily
		return { safe: true, category: undefined };
	}
}

// Simplified vision completion - removed fallback logic as it's simpler now
async function tryVisionCompletion(imageData: string, model: string) {
	return await client.chat.completions.create({
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "Describe this UI drawing in detail",
					},
					{
						type: "image_url",
						image_url: {
							url: imageData,
						},
					},
				],
			},
		],
		model: model,
		temperature: getModelTemperature(model),
		max_tokens: 1024,
		top_p: 1,
		stream: false,
		stop: null,
	});
}

// Simplified text completion - removed fallback logic
async function tryCompletion(prompt: string, model: string, stream = false) {
    const modelToUse = MAINTENANCE_USE_VANILLA_MODEL && MODEL_OPTIONS.includes("llama-3.3-70b-versatile") ? "llama-3.3-70b-versatile" : model; // Apply vanilla model maintenance flag

    // Simple retry mechanism if the call fails
    try {
         return await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: modelToUse,
            temperature: getModelTemperature(modelToUse),
            max_tokens: getModelMaxTokens(modelToUse),
            top_p: 1,
            stream: stream,
            stop: null,
        });
    } catch (error) {
        console.error(`Attempt 1 failed for model ${modelToUse}:`, error);
        // Optional: Try a generic fallback model if the first attempt fails
        const genericFallback = "llama-3.3-70b-versatile"; // Example generic fallback
        if (modelToUse !== genericFallback && MODEL_OPTIONS.includes(genericFallback)) {
             try {
                 console.log(`Attempting fallback with ${genericFallback}`);
                 return await client.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: genericFallback,
                    temperature: getModelTemperature(genericFallback),
                    max_tokens: getModelMaxTokens(genericFallback),
                    top_p: 1,
                    stream: stream,
                    stop: null,
                });
            } catch (fallbackError) {
                console.error(`Fallback model ${genericFallback} also failed:`, fallbackError);
                throw fallbackError; // Throw the fallback error if it also fails
            }
        }
        throw error; // Throw the original error if no fallback attempted or fallback failed
    }
}


// Simplified drawing description - removed fallback logic
async function getDrawingDescription(imageData: string): Promise<string | null> {
	try {
        // Find the first available vision model
        const visionModel = MODEL_OPTIONS.find(modelName => getModelConfig(modelName).type === 'vision');
        if (!visionModel) {
            console.warn("No vision model available in MODEL_OPTIONS");
            return null; // No vision model available
        }
		const chatCompletion = await tryVisionCompletion(
			imageData,
			visionModel,
		);
		return chatCompletion.choices[0]?.message?.content || null;
	} catch (error) {
		console.error("Error processing drawing description:", error);
		// Return null or throw error depending on desired behavior if vision fails
		return null;
	}
}


export async function POST(request: Request) {
	if (MAINTENANCE_GENERATION) {
		return NextResponse.json(
			{ error: "We're currently undergoing maintenance. We'll be back soon!" },
			{ status: 500 },
		);
	}

	try {
		const { query, currentHtml, feedback, theme, drawingData, model, stream = false } =
			await request.json();
		let finalQuery = query;
		if (drawingData) {
			const drawingDescription = await getDrawingDescription(drawingData);
            if (drawingDescription) {
                finalQuery = `${query}\n\nDrawing description: ${drawingDescription}`;
            } else if (!query) {
                // If there's only a drawing and description failed, handle it
                 return NextResponse.json(
                    { error: "Failed to interpret drawing. Please add a text description." },
                    { status: 400 },
                );
            }
		}

		const prompt = constructPrompt({
			...(finalQuery && { query: finalQuery }),
			currentHtml,
			currentFeedback: feedback,
			theme,
		});

		// Run safety check (Keep if desired)
		const safetyResult = await checkContentSafety(prompt);

		// Check safety result before proceeding
		if (!safetyResult.safe) {
			return NextResponse.json(
				{
					error:
						"Your request contains content that violates our community guidelines.",
					category: safetyResult.category,
				},
				{ status: 400 },
			);
		}

        const modelConfig = getModelConfig(model);
        if (modelConfig.type !== 'text') {
             return NextResponse.json(
                { error: `Selected model '${model}' is not a text generation model.` },
                { status: 400 },
            );
        }


		// If streaming is requested, return a streaming response
		if (stream) {
			const encoder = new TextEncoder();
			const streamingCompletion = await tryCompletion(prompt, model, true);
			
			const responseStream = new ReadableStream({
				async start(controller) {
					// Send initial message
					controller.enqueue(encoder.encode(JSON.stringify({ type: "start" }) + "\n"));
					
					try {
						let fullContent = "";
						
						// Handle streaming response
						for await (const chunk of streamingCompletion as any) {
							const content = chunk.choices[0]?.delta?.content || "";
							if (content) {
								fullContent += content;
								
								// Send just the new content chunk to the client
								controller.enqueue(
									encoder.encode(
										JSON.stringify({
											type: "chunk",
											content: content,
										}) + "\n"
									)
								);
							}
						}
						
						// Extract HTML content from between backticks if present
						let generatedHtml = fullContent;
						if (generatedHtml.includes("```html")) {
							const match = generatedHtml.match(/```html\n([\s\S]*?)\n```/);
							generatedHtml = match ? match[1] : generatedHtml;
						} else {
                           // If no code block, assume the whole response is HTML
                           // Optional: Add more robust parsing if needed
                        }
						
						// Send the final HTML and close the stream
						controller.enqueue(
							encoder.encode(
								JSON.stringify({
									type: "complete",
									html: generatedHtml,
									// REMOVE: signature: signHtml(generatedHtml), // No need to sign without persistence
								}) + "\n"
							)
						);
						controller.close();
					} catch (error) {
						console.error("Error in stream:", error);
						controller.enqueue(
							encoder.encode(
								JSON.stringify({
									type: "error",
									error: error instanceof Error ? error.message : "Error generating content",
								}) + "\n"
							)
						);
						controller.close();
					}
				},
			});
			
			return new Response(responseStream, {
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					"Connection": "keep-alive",
				},
			});
		} else {
			// Non-streaming response (kept for compatibility, but client uses stream: true)
			const chatCompletion = await tryCompletion(prompt, model, false) as any;
			let generatedHtml = chatCompletion.choices[0]?.message?.content || "";

			// Extract HTML content from between backticks if present
			if (generatedHtml.includes("```html")) {
				const match = generatedHtml.match(/```html\n([\s\S]*?)\n```/);
				generatedHtml = match ? match[1] : generatedHtml;
			}

			return NextResponse.json({
				html: generatedHtml,
				// REMOVE: signature: signHtml(generatedHtml),
				usage: chatCompletion.usage,
			});
		}
	} catch (error) {
		console.error("Error generating HTML:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Failed to generate HTML" },
			{ status: 500 },
		);
	}
}

