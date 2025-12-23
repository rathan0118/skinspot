import { AlertCircle, CheckCircle, Clock, AlertTriangle, Info, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface Analysis {
  condition: string;
  confidence: string;
  severity: string;
  description: string;
  possibleCauses: string[];
  recommendations: string[];
  urgency: string;
  disclaimer: string;
}

interface AnalysisResultProps {
  analysis: Analysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild":
        return "bg-success/10 text-success border-success/20";
      case "moderate":
        return "bg-warning/10 text-warning border-warning/20";
      case "severe":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "routine":
        return <Clock className="w-4 h-4" />;
      case "soon":
        return <AlertTriangle className="w-4 h-4" />;
      case "urgent":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getConfidenceWidth = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "w-full";
      case "medium":
        return "w-2/3";
      case "low":
        return "w-1/3";
      default:
        return "w-1/2";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-up">
      {/* Main Result Card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-semibold text-foreground">
              {analysis.condition}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  getSeverityColor(analysis.severity)
                )}
              >
                {analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {getUrgencyIcon(analysis.urgency)}
                {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)} attention
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">AI Confidence</span>
            <span className="text-sm font-medium text-foreground capitalize">
              {analysis.confidence}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full hero-gradient rounded-full transition-all duration-500",
                getConfidenceWidth(analysis.confidence)
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-2">Observation</h4>
          <p className="text-muted-foreground leading-relaxed">{analysis.description}</p>
        </div>

        {/* Possible Causes */}
        {analysis.possibleCauses && analysis.possibleCauses.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">Possible Causes</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.possibleCauses.map((cause, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm"
                >
                  {cause}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="glass-card rounded-2xl p-4 border-warning/30 bg-warning/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            {analysis.disclaimer || "This analysis is for informational purposes only and should not replace professional medical advice. Please consult a dermatologist for accurate diagnosis and treatment."}
          </p>
        </div>
      </div>
    </div>
  );
}
