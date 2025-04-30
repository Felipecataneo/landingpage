// ================================================
// FILE: src/components/AppgenUI/main-view.tsx (Simplified)
// ================================================
import { useEffect } from "react";
import PromptView from "./prompt-view";
import StudioView from "./studio-view";
import { useStudio } from "@/providers/studio-provider";
// REMOVE: import GalleryListing from "./gallery-listing";

export default function MainView() {
	const { studioMode, setStudioMode } = useStudio();

    // Keep this effect if you want to use the ?source= param
    // to link into the studio view directly (though loading from source is removed)
    // If you keep it, the page will just start in studio mode.
    // If you want to *load* HTML from a source, you'd need to re-implement that logic
    // without the gallery/supabase dependency, which might mean embedding the HTML
    // directly in the URL param or fetching from a different source.
    // Given the request to remove persistence, let's simplify: the ?source= param
    // will just force the view into studio mode, it won't load any specific content.
	useEffect(() => {
		if (location.search.startsWith("?source=")) {
			setStudioMode(true);
		}
	}, [setStudioMode]);


	if (studioMode) {
		return <StudioView />;
	}

    // Prompt view will be the default if not forced into studio mode
	return <PromptView />;
}