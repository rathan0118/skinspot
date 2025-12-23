import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (imageBase64: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-skin", {
        body: { imageBase64 },
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze image");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.analysis) {
        setAnalysis(data.analysis);
        toast({
          title: "Analysis Complete",
          description: "Your skin analysis is ready to view.",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze the image. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen flex flex-col surface-gradient">
      <Header />
      
      <main className="flex-1 px-4 pb-12">
        {!analysis ? (
          <>
            <Hero />
            <ImageUpload onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />
          </>
        ) : (
          <div className="py-8">
            <div className="max-w-2xl mx-auto mb-8">
              <Button
                variant="ghost"
                onClick={handleNewAnalysis}
                className="mb-6 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Analysis Results
              </h2>
              <p className="text-muted-foreground">
                Here's what our AI detected in your image
              </p>
            </div>
            <AnalysisResult analysis={analysis} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
