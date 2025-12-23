import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 mt-auto border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <a 
            href="https://www.aad.org/public/diseases/a-z" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Learn about skin conditions
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            <strong>Medical Disclaimer:</strong> SkinSpot is an educational tool and does not provide medical diagnoses. 
            The analysis provided is for informational purposes only and should not replace professional medical advice. 
            Always consult a qualified healthcare provider for skin concerns.
          </p>
        </div>
      </div>
    </footer>
  );
}
