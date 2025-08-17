import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Book, Lightbulb, ArrowRight, Users, BookOpen, Star, Play, CheckCircle, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, getDifficultyColor } from "@/lib/utils";
import type { Project, Material } from "@shared/schema";

// Helper function to map material types to Vietnamese names
const materialNameMap: Record<string, string> = {
  'plastic_bottle': 'Chai nhựa',
  'aluminum_can': 'Lon nhôm', 
  'cardboard': 'Giấy carton',
  'sand': 'Cát',
  'gravel': 'Sỏi',
  'cotton': 'Bông',
  'charcoal': 'Than hoạt tính',
  'wire': 'Dây điện',
  'magnet': 'Nam châm',
  'battery': 'Pin',
  'pet_plastic': 'Nhựa PET',
  'corrugated_cardboard': 'Carton gợn sóng',
  'beverage_can': 'Lon đồ uống'
};

// Helper function to analyze material requirements
function analyzeMaterialRequirements(project: Project, scannedMaterials: Material[]) {
  const currentMaterials = scannedMaterials.reduce((acc, material) => {
    const type = material.type.toLowerCase().replace(/\s+/g, '_');
    acc[type] = (acc[type] || 0) + material.quantity;
    return acc;
  }, {} as Record<string, number>);

  const requiredMaterials = project.materials.map(material => ({
    type: material,
    name: materialNameMap[material] || material,
    required: 1, // Default quantity needed
    available: currentMaterials[material] || 0,
    status: (currentMaterials[material] || 0) >= 1 ? 'sufficient' : 'lacking'
  }));

  const totalRequired = requiredMaterials.length;
  const totalAvailable = requiredMaterials.filter(m => m.status === 'sufficient').length;
  const completionPercentage = Math.round((totalAvailable / totalRequired) * 100);

  return {
    materials: requiredMaterials,
    completionPercentage,
    canComplete: totalAvailable === totalRequired
  };
}

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
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-emerald-600 transition-colors">Trang Chủ</Link></li>
            <li>/</li>
            <li><Link href="/scan" className="hover:text-emerald-600 transition-colors">Quét AI</Link></li>
            <li>/</li>
            <li className="text-emerald-600 font-medium">Đề Xuất STEM</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4" />
              <span>Bước 4: Chọn Dự Án</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
              Chọn Dự Án STEM Phù Hợp
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Dựa trên vật liệu của bạn: {materialsSummary || "Các vật liệu tái chế đa dạng"}
            </p>
            
            {/* Current Materials Summary */}
            <Card className="max-w-4xl mx-auto mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-emerald-600" />
                  Vật Liệu Hiện Có
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {scannedMaterials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2 bg-emerald-50 rounded-lg p-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium">{material.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {material.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Link href="/scan">
              <Button className="btn-secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay Lại Quét
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
            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {projects.map((project) => {
                const materialAnalysis = analyzeMaterialRequirements(project, scannedMaterials);
                
                return (
                  <Card key={project.id} className="h-full hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={getProjectImage(project.title)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <div className="flex items-center gap-2">
                            {materialAnalysis.canComplete ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Sẵn sàng
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Thiếu vật liệu
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        {/* Material Requirements */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2 text-gray-700">
                            Vật liệu cần thiết ({materialAnalysis.completionPercentage}% sẵn sàng):
                          </h4>
                          <div className="space-y-2">
                            {materialAnalysis.materials.map((material, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  {material.status === 'sufficient' ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                  )}
                                  <span className={material.status === 'sufficient' ? 'text-green-700' : 'text-orange-700'}>
                                    {material.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-600">{material.available}</span>
                                  <span className="text-gray-400">/</span>
                                  <span className="text-gray-600">{material.required}</span>
                                  {material.status === 'lacking' && (
                                    <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-700">
                                      Thiếu {material.required - material.available}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
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
                          <Button 
                            className={materialAnalysis.canComplete 
                              ? "bg-[--primary-green] hover:bg-[--secondary-green]" 
                              : "bg-gray-400 hover:bg-gray-500"
                            }
                          >
                            <Book className="h-4 w-4 mr-2" />
                            {materialAnalysis.canComplete ? "Bắt Đầu Dự Án" : "Xem Chi Tiết"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
