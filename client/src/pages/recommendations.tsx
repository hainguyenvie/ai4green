import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, getDifficultyColor } from "@/lib/utils";
import type { Project, Material } from "@shared/schema";

export default function RecommendationsPage() {
  const [scannedMaterials, setScannedMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const materials = sessionStorage.getItem('scannedMaterials');
    if (materials) {
      setScannedMaterials(JSON.parse(materials));
    }
  }, []);

  const materialTypes = scannedMaterials.map(m => m.type.toLowerCase().replace(/\s+/g, '_'));

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const response = await fetch(`/api/projects?materials=${materialTypes.join(',')}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  const materialsSummary = scannedMaterials
    .map(m => `${m.quantity} ${m.name}${m.quantity > 1 ? 's' : ''}`)
    .join(', ');

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary-green] mx-auto mb-4"></div>
              <p className="text-gray-600">Finding perfect STEM projects for your materials...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-[--secondary-green]">Home</Link></li>
            <li>/</li>
            <li><Link href="/scan" className="hover:text-[--secondary-green]">Scan</Link></li>
            <li>/</li>
            <li className="text-[--primary-green] font-medium">STEM Recommendations</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Recommended STEM Projects</h1>
              <p className="text-gray-600 text-lg">
                Based on your materials: {materialsSummary || "Various recyclable materials"}
              </p>
            </div>
            <Link href="/scan">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scan
              </Button>
            </Link>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any projects matching your materials. Try scanning different items or check back later for new projects.
                </p>
                <Link href="/scan">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Try Another Scan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="h-full hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={getProjectImage(project.title)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-[--accent-green] text-[--text-dark-green]">
                          {project.category}
                        </Badge>
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                        {project.rating && (
                          <Badge variant="outline">
                            ⭐ {project.rating}/5
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(project.duration)}
                      </div>
                      <Link href={`/lesson-plan/${project.id}`}>
                        <Button className="bg-[--primary-green] hover:bg-[--secondary-green]">
                          <Book className="h-4 w-4 mr-2" />
                          View Lesson Plan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getProjectImage(title: string): string {
  const imageMap: Record<string, string> = {
    "Water Filtration System": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    "Simple Electric Motor": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    "Earthquake-Resistant Building": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    "Recycled Materials Robot": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    "pH Testing Laboratory": "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    "Solar Oven": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
  };
  
  return imageMap[title] || "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
}
