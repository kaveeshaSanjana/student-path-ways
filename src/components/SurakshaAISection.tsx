import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain3D } from './Brain3D';
import { ArrowRight, Shield, Brain, Zap, Target } from 'lucide-react';

export const SurakshaAISection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background via-background/80 to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <Shield className="w-4 h-4" />
                Suraksha AI Technology
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                AI-Powered Student
                <span className="text-primary block">Protection & Learning</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Revolutionary artificial intelligence that creates a protective learning environment 
                while optimizing educational experiences. Our advanced neural networks monitor, 
                adapt, and enhance student safety and academic performance in real-time.
              </p>
            </div>

            {/* Key features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border">
                <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Smart Learning</h3>
                  <p className="text-sm text-muted-foreground">Adaptive AI algorithms personalize education paths</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Safety First</h3>
                  <p className="text-sm text-muted-foreground">Advanced protection systems ensure secure learning</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Real-time Analysis</h3>
                  <p className="text-sm text-muted-foreground">Instant feedback and performance optimization</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border">
                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Precision Learning</h3>
                  <p className="text-sm text-muted-foreground">Targeted interventions for maximum impact</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="group">
                Experience Suraksha AI
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Safety Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">45%</div>
                <div className="text-sm text-muted-foreground">Learning Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Monitoring</div>
              </div>
            </div>
          </div>

          {/* Right side - 3D Brain */}
          <div className="relative h-[500px] lg:h-[600px]">
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-3xl"></div>
            <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-background border border-primary/20">
              <Brain3D />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-primary/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/4 -right-2 w-6 h-6 bg-primary/30 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};