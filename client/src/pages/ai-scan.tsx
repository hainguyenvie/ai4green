import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Upload, Camera, Search, Edit, ArrowRight, Trash2, Plus, Minus, Scan, CheckCircle, Lightbulb, BookOpen, ArrowLeft, Image as ImageIcon, Users } from "lucide-react";
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

// Demo/mock data
const mockDetection = [
  { id: 1, name: "Chai nhựa", quantity: 3 },
  { id: 2, name: "Lon nhôm", quantity: 2 },
  { id: 3, name: "Giấy carton", quantity: 5 },
];
const mockProducts = [
  {
    id: 1,
    name: "Mô hình xe đua tái chế",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Tạo xe đua từ chai nhựa, nắp chai và ống hút.",
    required: ["Chai nhựa", "Nắp chai", "Ống hút", "Que tre"],
  },
  {
    id: 2,
    name: "Đèn lồng sáng tạo",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description: "Làm đèn lồng từ lon nhôm và giấy carton.",
    required: ["Lon nhôm", "Giấy carton", "Kéo", "Bút màu"],
  },
  {
    id: 3,
    name: "Robot mini từ vật liệu tái chế",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "Lắp ráp robot mini từ nhiều loại vật liệu.",
    required: ["Chai nhựa", "Lon nhôm", "Giấy carton", "Nắp chai"],
  },
  {
    id: 4,
    name: "Thuyền nổi từ xốp và chai nhựa",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    description: "Chế tạo thuyền nổi từ xốp, chai nhựa và que tre.",
    required: ["Xốp", "Chai nhựa", "Que tre", "Băng dính"],
  },
  {
    id: 5,
    name: "Ống nhòm giấy carton",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description: "Làm ống nhòm từ lõi giấy vệ sinh và giấy carton.",
    required: ["Lõi giấy", "Giấy carton", "Băng dính", "Bút màu"],
  },
  {
    id: 6,
    name: "Đồng hồ mặt trời tái chế",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description: "Tạo đồng hồ mặt trời từ đĩa CD cũ và que tre.",
    required: ["Đĩa CD", "Que tre", "Bút dạ", "Giấy màu"],
  },
  {
    id: 7,
    name: "Chậu cây mini từ lon nhôm",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Tái chế lon nhôm thành chậu cây nhỏ xinh.",
    required: ["Lon nhôm", "Đất trồng", "Cây nhỏ", "Sơn màu"],
  },
];
const lessonPlan = {
  topic: "Hệ thống giám sát chất lượng không khí",
  overview: `Hiện nay, ô nhiễm không khí đang trở thành một trong những vấn đề nghiêm trọng nhất đối với sức khỏe cộng đồng trên toàn thế giới... (rút gọn cho demo, dùng nội dung bạn gửi ở bản thật)`,
  practicalPurpose: "Nêu rõ tính thực tiễn và mục đích của chủ đề...",
  assessment: "Bảng kiểm đánh giá các năng lực...",
  topicTable: [
    ["Tên chủ đề", "Chế tạo hệ thống máy đo chất lượng không khí"],
    ["Thời gian", "18 tiết"],
    ["Lứa tuổi của HS", "Lớp 6"],
    ["Cấp độ", "Khó"],
    ["Giới thiệu chủ đề", "..."],
    ["Các nội dung STEM liên quan", "..."],
    ["Mục tiêu về kiến thức, kĩ năng", "..."],
    ["Những lưu ý an toàn khi thực hiện chủ đề", "..."],
    ["Chủ đề kết hợp những phương pháp dạy học nào?", "Dạy học theo quy trình Thiết kế kỹ thuật"],
  ],
  schedule: [
    [1, "Xác định và phân tích vấn đề - Thành lập nhóm", 2, "..."],
    [2, "Đề xuất ý tưởng & Tạo nguyên mẫu thử", 4, "..."],
    [3, "Kiểm tra; cải tiến và kế hoạch chế tạo sản phẩm", 4, "..."],
    [4, "Thử nghiệm sản phẩm", 2, "..."],
    [5, "Hoàn thiện sản phẩm", 3, "..."],
    [6, "Báo cáo sản phẩm", 1, "..."],
  ],
  activities: [
    {
      title: "Bài 1: Xác định và phân tích vấn đề - Thành lập nhóm",
      time: "2 tiết (90 phút)",
      objectives: {
        science: ["Hiểu rõ vai trò của không khí...", "Nắm được các vấn đề ô nhiễm không khí..."],
        technology: ["Sử dụng các công cụ, thiết bị để đo..."],
        math: ["Phân tích và biểu diễn dữ liệu đo được..."],
        attitude: ["Có ý thức bảo vệ môi trường không khí..."]
      },
      activities: [
        {
          name: "Hoạt động 1: Cần thở (10')",
          goal: "Giúp học sinh nhận thức rõ ràng về vai trò quan trọng của không khí đối với sự sống.",
          materials: "Một chiếc cốc thủy tinh trong suốt, một ngọn nến nhỏ, một đĩa nước, đồng hồ bấm giờ",
          content: "Giáo viên đặt câu hỏi mở... (rút gọn cho demo)"
        },
        // ... more activities
      ]
    },
    // ... more lessons
  ],
  appendix: [
    {
      title: 'Tiêu chí đánh giá poster tìm hiểu : "Ô nhiễm không khí"',
      table: [
        ["Tiêu chí", "Mức độ 1 (Cần cải thiện)", "Mức độ 2 (Khá)", "Mức độ 3 (Tốt)", "Mức độ 4 (Xuất sắc)"],
        ["Nội dung", "Nội dung chưa rõ ràng...", "Nội dung cơ bản...", "Nội dung đầy đủ...", "Nội dung sáng tạo..."]
        // ... more rows
      ]
    },
    // ... more appendix
  ]
};

const steps = [
  { label: "Tải lên hình ảnh", icon: <Upload className="w-5 h-5" /> },
  { label: "Xác nhận vật liệu", icon: <Edit className="w-5 h-5" /> },
  { label: "Gợi ý sản phẩm & Kế hoạch bài học", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Chọn dự án", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Làm theo hướng dẫn", icon: <Lightbulb className="w-5 h-5" /> },
  { label: "Tải ảnh/video sản phẩm", icon: <Camera className="w-5 h-5" /> },
  { label: "Chia sẻ & phản hồi", icon: <Users className="w-5 h-5" /> },
];

export default function AiScanPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sessionId] = useState(() => generateSessionId());
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<IdentifiedMaterial[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [materials, setMaterials] = useState([
    { id: 1, name: "Chai nhựa", quantity: 3 },
    { id: 2, name: "Lon nhôm", quantity: 2 },
    { id: 3, name: "Giấy carton", quantity: 5 },
  ]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removeId, setRemoveId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: materialsData = [] } = useQuery<Material[]>({
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
    const material = materialsData.find(m => m.id === materialId);
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
    if (materialsData.length === 0) {
      toast({
        title: "No Materials",
        description: "Please scan some materials first.",
        variant: "destructive",
      });
      return;
    }

    // Store materials in sessionStorage for recommendations page
    sessionStorage.setItem('scannedMaterials', JSON.stringify(materialsData));
    setLocation('/recommendations');
  };

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // OpenAI Vision API integration
  const analyzeImageWithOpenAI = async (imageFile: File) => {
    if (!apiKey) {
      alert("OpenAI API key chưa được cấu hình. Vui lòng thêm VITE_OPENAI_API_KEY vào file .env");
      // Fallback to demo data
      setMaterials([
        { id: Date.now(), name: "Chai nhựa", quantity: 2 },
        { id: Date.now() + 1, name: "Lon nhôm", quantity: 1 },
        { id: Date.now() + 2, name: "Giấy carton", quantity: 3 },
      ]);
      setStep(2);
      return;
    }

    setIsAnalyzing(true);
    try {
      // Convert image to base64
      const base64Image = await convertToBase64(imageFile);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Phân tích hình ảnh này và nhận diện các vật liệu tái chế cùng với số lượng của chúng. Chỉ trả về một mảng JSON theo định dạng chính xác này: [{\"name\": \"tên_vật_liệu_tiếng_việt\", \"quantity\": số}]. Tập trung vào các vật liệu tái chế phổ biến như chai nhựa, lon nhôm, giấy carton, chai thủy tinh, túi nhựa, giấy, v.v."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the JSON response - handle markdown code blocks
      try {
        // Remove markdown code blocks if present
        let jsonString = content.trim();
        if (jsonString.startsWith('```json')) {
          jsonString = jsonString.replace(/```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonString.startsWith('```')) {
          jsonString = jsonString.replace(/```\s*/, '').replace(/\s*```$/, '');
        }
        
        const detectedMaterials = JSON.parse(jsonString);
        const materialsWithId = detectedMaterials.map((material: any, index: number) => ({
          id: Date.now() + index,
          name: material.name,
          quantity: material.quantity
        }));
        setMaterials(materialsWithId);
        setStep(2); // Move to confirmation step
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", content);
        // Fallback to demo data if parsing fails
        setMaterials([
          { id: Date.now(), name: "Chai nhựa", quantity: 2 },
          { id: Date.now() + 1, name: "Lon nhôm", quantity: 1 },
        ]);
        setStep(2);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Lỗi khi phân tích hình ảnh. Vui lòng thử lại.");
      // Fallback to demo data on error
      setMaterials([
        { id: Date.now(), name: "Chai nhựa", quantity: 2 },
        { id: Date.now() + 1, name: "Lon nhôm", quantity: 1 },
      ]);
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Handle image upload with OpenAI analysis
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
      setStep(1);
      
      // Store the file for later analysis
      (window as any).uploadedImageFile = file;
    }
  };

  // Trigger OpenAI analysis
  const startAIAnalysis = async () => {
    const file = (window as any).uploadedImageFile;
    if (file) {
      await analyzeImageWithOpenAI(file);
    }
  };

  // Stepper UI: always show all 7 steps in a single row, no horizontal scroll
  const Stepper = () => (
    <div className="w-full mb-8">
      <div className="flex flex-row flex-nowrap justify-between items-center w-full gap-0">
        {steps.map((s, idx) => (
          <div key={s.label} className="flex flex-col items-center flex-1 min-w-0 px-1">
            <div className={`rounded-full p-2 mb-1 ${idx === step ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>{s.icon}</div>
            <span className={`text-xs font-medium text-center break-words ${idx === step ? "text-emerald-700 underline underline-offset-4" : "text-slate-500"}`}>{`Bước ${idx + 1}: ${s.label}`}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Remove material with confirmation
  const handleRemoveMaterial = (id: number) => {
    setRemoveId(id);
    setShowRemoveConfirm(true);
  };
  const confirmRemoveMaterial = () => {
    setMaterials((prev) => prev.filter((m) => m.id !== removeId));
    setShowRemoveConfirm(false);
    setRemoveId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-10">
      <div className="max-w-2xl mx-auto">
        <Stepper />

        <Card className="p-8 shadow-xl">
          {/* Step 0: Upload */}
          {step === 0 && (
            <div className="flex flex-col items-center justify-center gap-6">
              <ImageIcon className="w-16 h-16 text-emerald-400 mb-2" />
              <h2 className="text-2xl font-bold mb-2 text-slate-900">Tải lên hình ảnh vật liệu</h2>
              <input type="file" accept="image/*" className="hidden" id="upload" onChange={handleImage} />
              <label htmlFor="upload">
                <Button className="btn-primary" asChild>
                  <span><Upload className="w-5 h-5 mr-2" /> Chọn hình ảnh</span>
                </Button>
              </label>
              {!apiKey && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg text-center max-w-md">
                  ⚠️ OpenAI API key chưa được cấu hình.<br/>
                  Tạo file <code>.env</code> và thêm:<br/>
                  <code className="bg-white px-2 py-1 rounded">VITE_OPENAI_API_KEY=your_key_here</code>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Preview */}
          {step === 1 && image && (
            <div className="flex flex-col items-center gap-6">
              <img src={image} alt="Preview" className="rounded-xl shadow-lg w-full max-w-xs mx-auto" />
              <div className="flex gap-4">
                <Button onClick={startAIAnalysis} className="btn-primary" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      AI đang phân tích...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4 mr-2" /> 
                      {apiKey ? "Bắt đầu phân tích AI" : "Sử dụng dữ liệu demo"}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Chọn lại
                </Button>
              </div>
              {!apiKey && (
                <div className="text-sm text-amber-600 text-center">
                  API key chưa có, sẽ sử dụng dữ liệu demo
                </div>
              )}
            </div>
          )}

          {/* Step 2: Confirm/Edit Materials */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-6">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-2" />
              <h2 className="text-2xl font-bold text-slate-900">AI đã nhận diện vật liệu</h2>
              
              {/* Show uploaded image for comparison */}
              {image && (
                <div className="w-full max-w-sm mx-auto">
                  <h3 className="text-sm font-medium text-slate-700 mb-2 text-center">Hình ảnh đã tải lên:</h3>
                  <img src={image} alt="Hình ảnh gốc" className="rounded-lg shadow-md w-full" />
                </div>
              )}
              
              <div className="bg-emerald-50 p-4 rounded-lg w-full max-w-lg">
                <div className="text-sm text-emerald-700 mb-2">✅ Phân tích hoàn tất!</div>
                <div className="text-sm text-slate-600">Vui lòng kiểm tra và chỉnh sửa nếu cần:</div>
              </div>
              
              <div className="w-full max-w-lg mx-auto">
                {/* Header row */}
                <div className="flex items-center gap-3 py-2 border-b-2 border-slate-300 bg-slate-50 rounded-t-lg px-3">
                  <div className="flex-1 min-w-0 text-sm font-semibold text-slate-700">
                    Tên vật liệu
                  </div>
                  <div className="w-20 text-center text-sm font-semibold text-slate-700">
                    Số lượng
                  </div>
                  <div className="w-10 text-center text-sm font-semibold text-slate-700">
                    Xóa
                  </div>
                </div>
                
                {/* Material rows */}
                {materials.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 py-3 border-b last:border-b-0 px-3 hover:bg-slate-50">
                    <input
                      className="border rounded px-3 py-2 flex-1 min-w-0 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="Nhập tên vật liệu..."
                      value={m.name}
                      onChange={e => setMaterials(prev => prev.map(x => x.id === m.id ? { ...x, name: e.target.value } : x))}
                    />
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-3 py-2 w-20 text-center text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      value={m.quantity}
                      onChange={e => setMaterials(prev => prev.map(x => x.id === m.id ? { ...x, quantity: Number(e.target.value) } : x))}
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleRemoveMaterial(m.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 w-10">
                      <span className="text-lg">×</span>
                    </Button>
                  </div>
                ))}
                
                {materials.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Chưa có vật liệu nào. Nhấn "Thêm vật liệu" để bắt đầu.
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setMaterials(prev => [...prev, { id: Date.now(), name: "Vật liệu mới", quantity: 1 }])}>
                + Thêm vật liệu
              </Button>
              <Button className="btn-primary mt-4" onClick={() => setStep(3)}>
                <ArrowRight className="w-4 h-4 mr-2" /> Gợi ý sản phẩm
              </Button>
            </div>
          )}

          {/* Step 3: Product Recommendation */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-6">
              <Lightbulb className="w-16 h-16 text-emerald-400 mb-2" />
              <h2 className="text-2xl font-bold text-slate-900">Gợi ý sản phẩm STEM</h2>
              <div className="grid grid-cols-1 gap-4 w-full">
                {mockProducts.map((p) => (
                  <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border shadow hover:shadow-lg transition cursor-pointer ${selectedProduct?.id === p.id ? "border-emerald-500 bg-emerald-50" : "bg-white"}`} onClick={() => setSelectedProduct(p)}>
                    <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="font-bold text-lg text-slate-900">{p.name}</div>
                      <div className="text-slate-600 text-sm mb-1">{p.description}</div>
                      <div className="text-xs text-slate-500">Cần: {p.required.join(", ")}</div>
                    </div>
                    {selectedProduct?.id === p.id && <CheckCircle className="text-emerald-500 w-6 h-6" />}
                  </div>
                ))}
              </div>
              <Button className="btn-primary mt-4" disabled={!selectedProduct} onClick={() => setStep(4)}>
                <ArrowRight className="w-4 h-4 mr-2" /> Xem kế hoạch bài học
              </Button>
            </div>
          )}

          {/* Step 4: Timed Lesson Blueprint */}
          {step === 4 && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto bg-white rounded-xl p-6 shadow">
              <h2 className="text-2xl font-bold text-emerald-700 mb-2">KẾ HOẠCH BÀI HỌC: {lessonPlan.topic}</h2>
              <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-1">I. Khái quát chủ đề</h3>
              <p className="text-slate-700 whitespace-pre-line">{lessonPlan.overview}</p>
              <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-1">1. Tính thực tiễn và mục đích của chủ đề</h3>
              <p className="text-slate-700 whitespace-pre-line">{lessonPlan.practicalPurpose}</p>
              <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-1">2. Cách thức kiểm tra, đánh giá trong chủ đề</h3>
              <p className="text-slate-700 whitespace-pre-line">{lessonPlan.assessment}</p>
              <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-1">3. Bảng mô tả chủ đề</h3>
              <table className="w-full text-sm border mb-4">
                <tbody>
                  {lessonPlan.topicTable.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="font-semibold p-2 w-1/3 bg-emerald-50">{row[0]}</td>
                      <td className="p-2">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-1">Khái quát lịch trình</h3>
              <table className="w-full text-sm border mb-4">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="p-2">STT</th><th className="p-2">Tên bài học</th><th className="p-2">Số tiết</th><th className="p-2">Nội dung chính</th>
                  </tr>
                </thead>
                <tbody>
                  {lessonPlan.schedule.map((row, i) => (
                    <tr key={i} className="border-b">
                      {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {lessonPlan.activities.map((lesson, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-lg font-semibold text-emerald-700 mt-4 mb-1">{lesson.title} <span className="text-slate-500 font-normal">({lesson.time})</span></h3>
                  <div className="mb-2">
                    <span className="font-semibold">Mục tiêu bài học:</span>
                    <ul className="list-disc ml-6 text-slate-700">
                      {lesson.objectives.science?.map((o, i) => <li key={i}><b>Khoa học:</b> {o}</li>)}
                      {lesson.objectives.technology?.map((o, i) => <li key={i}><b>Công nghệ:</b> {o}</li>)}
                      {lesson.objectives.math?.map((o, i) => <li key={i}><b>Toán học:</b> {o}</li>)}
                      {lesson.objectives.attitude?.map((o, i) => <li key={i}><b>Thái độ:</b> {o}</li>)}
                    </ul>
                  </div>
                  {lesson.activities.map((act, i) => (
                    <div key={i} className="mb-2">
                      <div className="font-semibold text-slate-900">{act.name}</div>
                      <div className="text-slate-700 text-sm"><b>Mục tiêu:</b> {act.goal}</div>
                      <div className="text-slate-700 text-sm"><b>Nguyên vật liệu:</b> {act.materials}</div>
                      <div className="text-slate-700 text-sm"><b>Nội dung hoạt động:</b> {act.content}</div>
                    </div>
                  ))}
                </div>
              ))}
              {lessonPlan.appendix.map((apx, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-1">{apx.title}</h3>
                  <table className="w-full text-sm border mb-4">
                    <tbody>
                      {apx.table.map((row, i) => (
                        <tr key={i} className="border-b">
                          {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </Card>

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
        {showResults && materialsData.length > 0 && (
          <div className="project-card">
            <div className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                <h3 className="text-2xl font-bold text-slate-900">Vật Liệu Đã Nhận Diện</h3>
                <div className="ml-auto">
                  <span className="status-badge bg-emerald-100 text-emerald-700">
                    {materialsData.length} vật liệu
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {materialsData.map((material) => (
                  <div key={material.id} className="material-card">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg text-slate-900">{material.name}</h4>
                        <p className="text-slate-600">Loại: {material.name}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-slate-600">Số lượng:</span>
                        <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(material.id, -1)}
                            disabled={material.quantity <= 0}
                            className="h-8 w-8 p-0 hover:bg-slate-200"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-bold text-lg mx-3 min-w-[30px] text-center text-slate-900">
                            {material.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(material.id, 1)}
                            className="h-8 w-8 p-0 hover:bg-slate-200"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() => handleRemoveMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
                <Button variant="outline" className="btn-secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Thêm Vật Liệu Khác
                </Button>
                <Button 
                  onClick={confirmMaterials}
                  className="btn-primary group"
                >
                  Xác Nhận & Nhận Đề Xuất
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
