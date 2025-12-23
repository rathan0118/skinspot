import { Scan, Lock, Clock, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="text-center py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6 animate-fade-up">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-secondary-foreground">
            Instant AI skin analysis
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Understand your skin with{" "}
          <span className="text-gradient">AI assistance</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Upload a photo of your skin concern and get instant AI-powered insights. 
          Our advanced analysis helps you understand potential conditions and next steps.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Scan className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Advanced AI Detection</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Private & Secure</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Results in Seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
