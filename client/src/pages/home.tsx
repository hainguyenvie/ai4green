import { Link } from "wouter";
import { Camera, Users, Book, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Transform Waste into STEM Learning
              </h1>
              <p className="text-xl mb-8 opacity-90">
                AI 4 Green uses artificial intelligence to identify recyclable materials and creates 
                personalized STEM lesson plans, turning everyday waste into engaging educational experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/scan">
                  <Button size="lg" variant="secondary" className="bg-white text-[--primary-green] hover:bg-gray-100">
                    <Camera className="h-5 w-5 mr-2" />
                    Start AI Scan
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[--primary-green]">
                    <Users className="h-5 w-5 mr-2" />
                    Explore Community
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Students working on STEM projects with recycled materials"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How AI 4 Green Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to transform waste into learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="feature-icon">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Scan Materials</h3>
              <p className="text-gray-600">
                Upload photos of recyclable materials using our AI-powered scanner
              </p>
            </div>
            <div className="text-center">
              <div className="feature-icon">
                <div className="text-2xl">🤖</div>
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI identifies materials and suggests creative STEM projects
              </p>
            </div>
            <div className="text-center">
              <div className="feature-icon">
                <Book className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Learn & Create</h3>
              <p className="text-gray-600">
                Follow guided lesson plans with step-by-step instructions
              </p>
            </div>
            <div className="text-center">
              <div className="feature-icon">
                <Share2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">4. Share Results</h3>
              <p className="text-gray-600">
                Share your creations with the learning community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-xl text-gray-600 mb-8">
                  Join thousands of educators and students transforming waste into wonderful STEM learning experiences.
                </p>
                <Link href="/scan">
                  <Button size="lg" className="bg-[--primary-green] hover:bg-[--secondary-green]">
                    <Play className="h-5 w-5 mr-2" />
                    Begin Your First Scan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
