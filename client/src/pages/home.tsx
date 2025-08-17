import { Link } from "wouter";
import { Scan, Lightbulb, Users, Sparkles, ArrowRight, Play, BookOpen, Recycle, CheckCircle, Camera, Edit, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const usageSteps = [
  { icon: <Upload className="w-8 h-8 text-emerald-500" />, text: "Tải/chụp ảnh vật liệu tái chế" },
  { icon: <Lightbulb className="w-8 h-8 text-yellow-500" />, text: "AI nhận diện & phân loại vật liệu" },
  { icon: <Edit className="w-8 h-8 text-blue-500" />, text: "Chỉnh sửa, xác nhận vật liệu" },
  { icon: <BookOpen className="w-8 h-8 text-purple-500" />, text: "Duyệt sản phẩm & kế hoạch bài học" },
  { icon: <CheckCircle className="w-8 h-8 text-emerald-600" />, text: "Chọn dự án thực hiện" },
  { icon: <Camera className="w-8 h-8 text-pink-500" />, text: "Làm theo hướng dẫn, chụp ảnh sản phẩm" },
  { icon: <Users className="w-8 h-8 text-emerald-700" />, text: "Chia sẻ lên cộng đồng & phản hồi" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="hero-content grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8 lg:pl-16"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <Recycle className="h-6 w-6" />
                  <span className="text-base font-semibold uppercase tracking-wide">RecyCool Platform</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
                  Biến Rác Thải Thành
                  <span className="block text-emerald-600">Học Liệu STEM</span>
                </h1>
                <p className="text-lg lg:text-2xl text-slate-700 leading-relaxed">
                  Sử dụng trí tuệ nhân tạo để quét, nhận diện vật liệu tái chế và tạo ra những kế hoạch bài học STEM 
                  cá nhân hóa, biến rác thải hàng ngày thành trải nghiệm giáo dục thú vị.
                </p>
              </motion.div>
              <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link href="/scan">
                  <Button size="lg" className="btn-primary group flex items-center">
                    <Scan className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Bắt Đầu Quét AI
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" className="btn-secondary flex items-center !text-emerald-700 !border-emerald-600 !bg-white hover:!bg-emerald-50">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="whitespace-nowrap">Khám Phá Cộng Đồng</span>
                  </Button>
                </Link>
              </motion.div>
              <motion.div className="flex items-center space-x-8 text-slate-900" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
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
              </motion.div>
            </motion.div>
            <motion.div
              className="relative flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div className="glass-card p-6 md:p-8 w-full max-w-md mx-auto" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Học sinh làm dự án STEM với vật liệu tái chế"
                  className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
                />
              </motion.div>
              <motion.div className="absolute left-1/2 -translate-x-1/2 -bottom-8 glass-card p-3 flex items-center space-x-3 shadow-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">AI đang phân tích...</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-5 w-5" />
              <span>Quy Trình Hoạt Động</span>
            </div>
                          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-slate-900">
              RecyCool Hoạt Động Như Thế Nào?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Bốn bước đơn giản để biến rác thải thành kiến thức học tập
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10 flex-wrap">
            {usageSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center bg-emerald-50 rounded-xl p-6 shadow-sm w-48 mb-4 md:mb-0">
                <div className="mb-3">{step.icon}</div>
                <div className="text-base font-semibold text-slate-800 text-center">{step.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-6 text-slate-900">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Những công nghệ tiên tiến giúp bạn tận dụng tối đa vật liệu tái chế
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Scan className="h-7 w-7 text-white" />
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
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-white" />
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
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-white" />
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
            <h3 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white">
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
