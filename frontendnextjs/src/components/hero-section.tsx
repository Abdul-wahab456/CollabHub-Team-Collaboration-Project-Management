"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Streamline Your Team's
            <span className="text-primary"> Collaboration</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
            The all-in-one project management platform that brings your team
            together with powerful task management, real-time chat, file
            sharing, and insightful analytics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-8">
            <Button size="lg" className="h-12 px-8">
              <Link href="/auth/signup">Get Started Free</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-10 bg-transparent"
            >
              <Link href="/auth/login">
                <Play className="inline mr-2 h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
