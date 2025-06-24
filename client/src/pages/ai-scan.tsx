import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Upload, Camera, Search, Edit, ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateSessionId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Material } from "@shared/schema";

interface IdentifiedMaterial {
  name: string;
  type: string;
  quantity: number;
}

export default function AIScanPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sessionId] = useState(() => generateSessionId());
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<IdentifiedMaterial[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { data: materials = [] } = useQuery<Material[]>({
    queryKey: ['/api/materials', sessionId],
    enabled: showResults,
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/scan', {});
      return response.json();
    },
    onSuccess: (data: IdentifiedMaterial[]) => {
      setScanResults(data);
      setShowResults(true);
      toast({
        title: "Scan Complete!",
        description: `Identified ${data.length} different materials.`,
      });
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Unable to process the scan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (material: IdentifiedMaterial) => {
      const response = await apiRequest('POST', '/api/materials', {
        name: material.name,
        type: material.type,
        quantity: material.quantity,
        scanSessionId: sessionId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials', sessionId] });
    },
  });

  const updateMaterialMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Material> }) => {
      const response = await apiRequest('PUT', `/api/materials/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials', sessionId] });
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials', sessionId] });
    },
  });

  const handleImageUpload = () => {
    // Simulate image upload
    const mockImages = [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    ];
    setUploadedImages(mockImages);
    toast({
      title: "Images Uploaded",
      description: "Successfully uploaded 2 images for scanning.",
    });
  };

  const handleCameraCapture = () => {
    // Simulate camera capture
    toast({
      title: "Camera Access",
      description: "Camera functionality would open device camera here.",
    });
    handleImageUpload();
  };

  const performScan = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload images before scanning.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      await scanMutation.mutateAsync();
      // Create materials in storage
      for (const material of scanResults) {
        await createMaterialMutation.mutateAsync(material);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const updateQuantity = (materialId: number, change: number) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      const newQuantity = Math.max(0, material.quantity + change);
      updateMaterialMutation.mutate({
        id: materialId,
        updates: { quantity: newQuantity }
      });
    }
  };

  const removeMaterial = (materialId: number) => {
    deleteMaterialMutation.mutate(materialId);
  };

  const confirmMaterials = () => {
    if (materials.length === 0) {
      toast({
        title: "No Materials",
        description: "Please scan some materials first.",
        variant: "destructive",
      });
      return;
    }

    // Store materials in sessionStorage for recommendations page
    sessionStorage.setItem('scannedMaterials', JSON.stringify(materials));
    setLocation('/recommendations');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-emerald-600 transition-colors">Trang Chủ</Link></li>
            <li>/</li>
            <li className="text-emerald-600 font-medium">Quét Vật Liệu AI</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scan className="h-4 w-4" />
              <span>Bước 1: Quét Vật Liệu</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
              Quét Vật Liệu AI Thông Minh
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Chụp ảnh các vật liệu tái chế hoặc tải lên hình ảnh để bắt đầu tạo dự án STEM của bạn
            </p>
          </div>

          {/* Upload Section */}
          <div className="project-card mb-8">
            <div className="p-8">
              <div className="scan-zone">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Kéo thả hình ảnh hoặc nhấn để chọn</h3>
                <p className="text-slate-600 mb-8 text-lg">Hỗ trợ file JPG, PNG, WebP tới 10MB</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleImageUpload} className="btn-primary group">
                    <Upload className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Tải Lên Hình Ảnh
                  </Button>
                  <Button onClick={handleCameraCapture} className="btn-secondary">
                    <Camera className="h-5 w-5 mr-2" />
                    Chụp Ảnh
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="project-card mb-8">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Hình Ảnh Đã Tải Lên</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Vật liệu ${index + 1}`}
                        className="rounded-xl shadow-lg w-full h-48 object-cover group-hover:shadow-xl transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scan Button */}
          {uploadedImages.length > 0 && !showResults && (
            <div className="text-center mb-8">
              <Button
                size="lg"
                onClick={performScan}
                disabled={isScanning}
                className="btn-primary group relative overflow-hidden"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Đang Quét Vật Liệu...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Bắt Đầu Quét AI
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Scan Results */}
          {showResults && materials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  Identified Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materials.map((material) => (
                    <div key={material.id} className="material-item">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{material.name}</h4>
                          <p className="text-sm text-gray-600">Type: {material.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(material.id, -1)}
                            disabled={material.quantity <= 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-bold mx-2 min-w-[20px] text-center">
                            {material.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(material.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => removeMaterial(material.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Add More Materials
                  </Button>
                  <Button 
                    onClick={confirmMaterials}
                    className="bg-[--primary-green] hover:bg-[--secondary-green]"
                  >
                    Confirm & Get Recommendations
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
