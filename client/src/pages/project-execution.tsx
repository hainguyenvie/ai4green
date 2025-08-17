import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, CheckCircle, Flag, Book, MessageCircle, Send, Clock, AlertCircle, Target, Lightbulb, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

interface ProjectExecutionPageProps {
  params: { id: string };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Timer {
  minutes: number;
  seconds: number;
  isRunning: boolean;
}

export default function ProjectExecutionPage({ params }: ProjectExecutionPageProps) {
  const projectId = parseInt(params.id);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState<Timer>({ minutes: 0, seconds: 0, isRunning: true });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Xin chào! Tôi ở đây để giúp bạn với dự án này. Bạn đã chuẩn bị đầy đủ vật liệu chưa? Hãy nhớ an toàn là ưu tiên hàng đầu khi sử dụng dụng cụ!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          let newSeconds = prev.seconds + 1;
          let newMinutes = prev.minutes;
          if (newSeconds >= 60) {
            newMinutes += 1;
            newSeconds = 0;
          }
          return { ...prev, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning]);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setTimer({ minutes: 0, seconds: 0, isRunning: false });
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: getAIResponse(chatInput),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const getAIResponse = (input: string): string => {
    const responses = [
      "Đó là một câu hỏi rất hay! Để tôi giúp bạn với bước này.",
      "An toàn rất quan trọng! Hãy đảm bảo có người lớn giám sát khi cần thiết.",
      "Bạn đang làm rất tốt! Hãy tiếp tục theo hướng dẫn từng bước một.",
      "Nếu có gì đó không hoạt động, hãy thử kiểm tra lại các bước trước để đảm bảo mọi thứ được thiết lập đúng.",
      "Đừng lo lắng nếu phải thử vài lần - đó là một phần của quá trình học tập!",
      "Hãy kiên nhẫn và cẩn thận. Khoa học cần thời gian để hiểu rõ!",
      "Nếu bạn gặp khó khăn, hãy nhớ rằng việc thử nghiệm và sai lầm là cách chúng ta học hỏi."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const askQuickQuestion = (type: string) => {
    const questions = {
      safety: "Tôi cần lưu ý những biện pháp an toàn nào trong dự án này?",
      science: "Bạn có thể giải thích các khái niệm khoa học liên quan đến bước này không?",
      troubleshoot: "Dự án của tôi không hoạt động như mong đợi. Có thể có vấn đề gì?"
    };
    setChatInput(questions[type as keyof typeof questions] || '');
  };

  const nextStep = () => {
    if (project && currentStep < project.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finishProject = () => {
    sessionStorage.setItem('completedProject', JSON.stringify({
      projectId: project?.id,
      completedAt: new Date().toISOString(),
      duration: `${timer.minutes}:${timer.seconds.toString().padStart(2, '0')}`
    }));
    // Navigate to submission page
    window.location.href = '/submission';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary-green] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
            <Link href="/recommendations">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = project.steps[currentStep];
  const progress = ((currentStep + 1) / project.steps.length) * 100;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Lightbulb className="h-4 w-4" />
                  <span>Bước 5: Làm Theo Hướng Dẫn</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Tiến độ</span>
                  <div className="w-32">
                    <Progress value={progress} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                  <p className="text-gray-600 text-lg">
                    Bước {currentStep + 1} trong tổng số {project.steps.length} bước
                  </p>
                </div>
              </div>
            </div>

            {/* Current Step Content */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start mb-6">
                  <div className="bg-[--primary-green] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                    {currentStep + 1}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold mb-2">{currentStepData.title}</h2>
                    <p className="text-gray-600 text-lg">{currentStepData.description}</p>
                  </div>
                </div>

                {/* Enhanced Visual Guidance */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <img
                      src={currentStepData.imageUrl || `https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300`}
                      alt={`Hướng dẫn bước ${currentStep + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-sm"
                    />
                    {/* Video placeholder */}
                    <Button variant="outline" className="w-full" onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      Xem Video Hướng Dẫn
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-emerald-600" />
                        Những gì bạn sẽ làm:
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                          <span className="text-sm">Thu thập vật liệu một cách an toàn</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                          <span className="text-sm">Thực hiện theo hướng dẫn từng bước</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                          <span className="text-sm">Hoàn thành danh sách kiểm tra</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                          <span className="text-sm">Nhờ trợ giúp khi cần thiết</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Safety Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Lưu Ý An Toàn
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Luôn có người lớn giám sát khi sử dụng dụng cụ</li>
                        <li>• Đeo kính bảo hộ nếu cần thiết</li>
                        <li>• Rửa tay sau khi hoàn thành mỗi bước</li>
                        <li>• Giữ khu vực làm việc sạch sẽ và ngăn nắp</li>
                      </ul>
                    </div>
                    
                    {/* Materials for this step */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2 flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Vật Liệu Cho Bước Này
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.materials.slice(0, 3).map((material, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-800">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Step Checklist */}
                {currentStepData.checklist && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4 flex items-center text-blue-900">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Danh Sách Kiểm Tra Bước {currentStep + 1}
                    </h3>
                    <div className="space-y-3">
                      {currentStepData.checklist.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-3 border border-blue-100">
                          <Checkbox
                            id={`check-${currentStep}-${index}`}
                            checked={checkedItems[`${currentStep}-${index}`] || false}
                            onCheckedChange={(checked) => 
                              setCheckedItems(prev => ({ 
                                ...prev, 
                                [`${currentStep}-${index}`]: checked as boolean 
                              }))
                            }
                            className="mt-1"
                          />
                          <label 
                            htmlFor={`check-${currentStep}-${index}`}
                            className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                          >
                            {item}
                          </label>
                          {checkedItems[`${currentStep}-${index}`] && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Progress indicator for checklist */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">
                          Hoàn thành: {Object.keys(checkedItems).filter(key => 
                            key.startsWith(`${currentStep}-`) && checkedItems[key]
                          ).length} / {currentStepData.checklist.length}
                        </span>
                        {Object.keys(checkedItems).filter(key => 
                          key.startsWith(`${currentStep}-`) && checkedItems[key]
                        ).length === currentStepData.checklist.length && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Hoàn thành!
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    className="flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Bước Trước
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {currentStep === project.steps.length - 1 ? (
                      <Button 
                        onClick={finishProject}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                        size="lg"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Hoàn Thành Dự Án
                      </Button>
                    ) : (
                      <Button 
                        onClick={nextStep} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center"
                        size="lg"
                      >
                        Bước Tiếp Theo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Project Timer */}
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1 flex items-center text-emerald-800">
                      <Clock className="h-5 w-5 mr-2" />
                      Thời Gian Thực Hiện
                    </h3>
                    <p className="text-sm text-emerald-600">Theo dõi thời gian làm dự án của bạn</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Dự kiến: {project.duration} phút
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-emerald-800">
                        {timer.minutes.toString().padStart(2, '0')}:
                        {timer.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {timer.isRunning ? 'Đang chạy' : 'Đã dừng'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" onClick={toggleTimer}>
                        {timer.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetTimer}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />
                    Trợ Lý AI Học Tập
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Chat Messages */}
                  <div className="h-80 overflow-y-auto mb-4 space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="chat-message">
                        <div className="flex items-start">
                          <div className={`rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 flex-shrink-0 ${
                            message.sender === 'ai' 
                              ? 'bg-[--primary-green] text-white' 
                              : 'bg-gray-400 text-white'
                          }`}>
                            {message.sender === 'ai' ? '🤖' : '👤'}
                          </div>
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1">
                              {message.sender === 'ai' ? 'AI Assistant' : 'You'}
                            </p>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything about the project..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-grow"
                    />
                    <Button size="sm" onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Help Buttons */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Quick Help:</p>
                    <div className="space-y-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={() => askQuickQuestion('safety')}
                      >
                        Safety Tips
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={() => askQuickQuestion('science')}
                      >
                        Science Concepts
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={() => askQuickQuestion('troubleshoot')}
                      >
                        Troubleshooting
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/lesson-plan/${project.id}`}>
                    <Button variant="outline" className="w-full">
                      <Book className="h-4 w-4 mr-2" />
                      Review Lesson Plan
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={finishProject}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Finish Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
