import { Shield, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center glow">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">
            SkinSpot
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-secondary-foreground">AI-Powered</span>
        </div>
      </div>
    </header>
  );
}
