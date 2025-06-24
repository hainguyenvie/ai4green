import { Link } from "wouter";
import { Scan, Lightbulb, Users, Sparkles, ArrowRight, Play, BookOpen, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4">
          <div className="hero-content grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-emerald-100">
                  <Recycle className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">AI 4 Green Platform</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Biến Rác Thải Thành
                  <span className="block text-emerald-200">Học Liệu STEM</span>
                </h1>
                <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
                  Sử dụng trí tuệ nhân tạo để quét, nhận diện vật liệu tái chế và tạo ra những kế hoạch bài học STEM 
                  cá nhân hóa, biến rác thải hàng ngày thành trải nghiệm giáo dục thú vị.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/scan">
                  <Button size="lg" className="btn-primary group">
                    <Scan className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Bắt Đầu Quét AI
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" className="btn-secondary">
                    <Users className="h-5 w-5 mr-2" />
                    Khám Phá Cộng Đồng
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-emerald-100">
                <div className="text-center">
                  <div className="text-2xl font-bold">2,847+</div>
                  <div className="text-sm opacity-80">Dự Án Đã Tạo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1,234+</div>
                  <div className="text-sm opacity-80">Học Sinh Tham Gia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">567+</div>
                  <div className="text-sm opacity-80">Giáo Viên</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="glass-card p-8">
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Học sinh làm dự án STEM với vật liệu tái chế"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">AI đang phân tích...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Quy Trình Hoạt Động</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
              AI 4 Green Hoạt Động Như Thế Nào?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Bốn bước đơn giản để biến rác thải thành kiến thức học tập
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card text-center group">
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <Scan className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">1. Quét Vật Liệu</h3>
              <p className="text-slate-600 leading-relaxed">
                Chụp ảnh các vật liệu tái chế bằng camera và AI sẽ tự động nhận diện
              </p>
            </div>
            <div className="feature-card text-center group">
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">2. Phân Tích AI</h3>
              <p className="text-slate-600 leading-relaxed">
                AI nhận diện vật liệu và đề xuất các dự án STEM sáng tạo phù hợp
              </p>
            </div>
            <div className="feature-card text-center group">
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">3. Học & Tạo</h3>
              <p className="text-slate-600 leading-relaxed">
                Làm theo kế hoạch bài học chi tiết với hướng dẫn từng bước
              </p>
            </div>
            <div className="feature-card text-center group">
              <div className="feature-icon group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">4. Chia Sẻ</h3>
              <p className="text-slate-600 leading-relaxed">
                Chia sẻ sáng tạo của bạn với cộng đồng học tập toàn cầu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Những công nghệ tiên tiến giúp bạn tận dụng tối đa vật liệu tái chế
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Scan className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Scan & Tùy Chỉnh</h3>
                <p className="text-slate-600">
                  Sử dụng YOLOv8 được tinh chỉnh để nhận diện vật liệu Việt Nam. 
                  Bạn có thể chỉnh sửa, thêm hoặc xóa vật liệu theo ý muốn.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Kế Hoạch Bài Học Thông Minh</h3>
                <p className="text-slate-600">
                  AI tự động tạo kế hoạch bài học chi tiết với phân bổ thời gian cụ thể, 
                  mục tiêu học tập và câu hỏi tư duy.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Cộng Đồng Tương Tác</h3>
                <p className="text-slate-600">
                  Chia sẻ sản phẩm, nhận phản hồi và học hỏi từ cộng đồng giáo viên 
                  và học sinh trên toàn thế giới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Sẵn Sàng Bắt Đầu?
            </h3>
            <p className="text-xl text-slate-300 mb-10">
              Tham gia cùng hàng nghìn giáo viên và học sinh đang biến rác thải thành 
              những trải nghiệm học tập STEM tuyệt vời.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scan">
                <Button size="lg" className="btn-primary group">
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Bắt Đầu Quét Đầu Tiên
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/community">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                  <Users className="h-5 w-5 mr-2" />
                  Xem Cộng Đồng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
