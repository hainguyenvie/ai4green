import { useState } from "react";
import { Link } from "wouter";
import { Plus, Filter, Heart, Camera, Users, Star, Eye, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import type { Submission } from "@shared/schema";

export default function CommunityPage() {
  const [filter, setFilter] = useState('all');

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['/api/submissions', { public: true }],
    queryFn: async () => {
      const response = await fetch('/api/submissions?public=true');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },
  });

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    // Add filtering logic based on project type
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary-green] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community projects...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for demonstration since we don't have actual submissions yet
  const mockSubmissions = [
    {
      id: 1,
      title: "Solar Pizza Oven Challenge",
      author: "Sarah M., Age 12",
      description: "I made a solar oven that actually cooked a mini pizza! Used cardboard boxes and aluminum foil. It reached 150°F on a sunny day. Amazing to see renewable energy in action!",
      photos: ["https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"],
      categories: ["Solar Energy", "Physics", "Cooking"],
      likes: 247,
      featured: true
    },
    {
      id: 2,
      title: "Micro Hydro Generator",
      author: "Alex T., Age 14",
      description: "Built a working water wheel generator using plastic bottles and a small motor. Generated enough electricity to light up 3 LEDs! Great lesson on renewable energy.",
      photos: ["https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"],
      categories: ["Hydroelectric", "Electronics", "Engineering"],
      likes: 189,
      featured: true
    },
    {
      id: 3,
      title: "Earthquake Simulator",
      author: "Maya P., Age 13",
      description: "Created an earthquake simulation table and tested different building designs. Triangle structures worked best! Learned so much about engineering and geology.",
      photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"],
      categories: ["Geology", "Structural Engineering", "Testing"],
      likes: 156,
      featured: true
    },
    {
      id: 4,
      title: "Dancing Can Robot",
      author: "Jordan K.",
      description: "Made a robot that dances to music using aluminum cans and a vibration motor!",
      photos: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"],
      categories: ["Robotics"],
      likes: 23,
      featured: false
    },
    {
      id: 5,
      title: "Air Quality Monitor",
      author: "Emma L.",
      description: "Built an air quality sensor using recycled plastic containers and Arduino!",
      photos: ["https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150"],
      categories: ["Environmental"],
      likes: 41,
      featured: false
    }
  ];

  const featuredProjects = mockSubmissions.filter(p => p.featured);
  const recentProjects = mockSubmissions.filter(p => !p.featured);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            <span>Cộng Đồng AI 4 Green</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
            Triển Lãm Cộng Đồng
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Khám phá những dự án STEM tuyệt vời được tạo ra bởi học sinh trên khắp thế giới
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan">
              <Button className="btn-primary group">
                <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Tạo Dự Án Mới
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="btn-secondary">
                  <Filter className="h-5 w-5 mr-2" />
                  Lọc Dự Án
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>Tất Cả Dự Án</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('water')}>Dự Án Nước</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('energy')}>Dự Án Năng Lượng</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('robotics')}>Robot Học</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[--primary-green]">2,847</div>
              <div className="text-gray-600">Projects Shared</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[--success-green]">1,234</div>
              <div className="text-gray-600">Active Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-500">567</div>
              <div className="text-gray-600">Teachers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">15,423</div>
              <div className="text-gray-600">Materials Recycled</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-amber-500 mr-2">⭐</span>
            Featured Projects
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={project.photos[0]}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-amber-500">
                    ⭐ Featured
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">by <strong>{project.author}</strong></p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="bg-[--accent-green] text-[--text-dark-green] text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="h-4 w-4 text-red-500 mr-1" />
                      {project.likes} likes
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-[--primary-green] mr-2">🕒</span>
            Recent Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <img
                  src={project.photos[0]}
                  alt={project.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <CardContent className="p-3">
                  <h4 className="font-bold mb-1">{project.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">by <strong>{project.author}</strong></p>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="secondary" className="bg-[--accent-green] text-[--text-dark-green] text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Heart className="h-3 w-3 text-red-500 mr-1" />
                    {project.likes} likes
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No submissions state */}
        {submissions.length === 0 && (
          <Card>
            <CardContent className="py-20 text-center">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Community Projects Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your amazing STEM project with the community!
              </p>
              <Link href="/scan">
                <Button className="bg-[--primary-green] hover:bg-[--secondary-green]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {mockSubmissions.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
