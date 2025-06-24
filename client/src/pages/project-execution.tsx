import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, CheckCircle, Flag, Book, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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
      content: "Hi! I'm here to help you with your project. Do you have all your materials ready? Remember, safety first when handling tools!",
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
      "That's a great question! Let me help you with that step.",
      "Safety is important! Make sure you have adult supervision when needed.",
      "You're doing great! Keep following the instructions step by step.",
      "If something isn't working, try checking the previous steps to make sure everything is set up correctly.",
      "Don't worry if it takes a few tries - that's part of the learning process!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const askQuickQuestion = (type: string) => {
    const questions = {
      safety: "What safety precautions should I take during this project?",
      science: "Can you explain the science concepts involved in this step?",
      troubleshoot: "My project isn't working as expected. What could be wrong?"
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">{project.title}</h1>
                <p className="text-gray-600">
                  Step {currentStep + 1} of {project.steps.length}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <span className="text-sm text-gray-600">Progress</span>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
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

                {/* Visual Guidance */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img
                      src={`https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300`}
                      alt={`Step ${currentStep + 1} illustration`}
                      className="w-full h-48 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">What you'll do:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-[--success-green] mr-2" />
                        Gather your materials safely
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-[--success-green] mr-2" />
                        Follow the step instructions
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-[--success-green] mr-2" />
                        Complete the checklist below
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-[--success-green] mr-2" />
                        Ask for help if needed
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step Checklist */}
                {currentStepData.checklist && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Step Checklist
                    </h3>
                    <div className="space-y-2">
                      {currentStepData.checklist.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox
                            id={`check-${currentStep}-${index}`}
                            checked={checkedItems[`${currentStep}-${index}`] || false}
                            onCheckedChange={(checked) => 
                              setCheckedItems(prev => ({ 
                                ...prev, 
                                [`${currentStep}-${index}`]: checked as boolean 
                              }))
                            }
                          />
                          <label 
                            htmlFor={`check-${currentStep}-${index}`}
                            className="text-sm"
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={previousStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Step
                  </Button>
                  
                  {currentStep === project.steps.length - 1 ? (
                    <Button 
                      onClick={finishProject}
                      className="bg-[--success-green] hover:bg-[--primary-green]"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Finish Project
                    </Button>
                  ) : (
                    <Button onClick={nextStep} className="bg-[--primary-green] hover:bg-[--secondary-green]">
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Timer */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Project Timer</h3>
                    <p className="text-sm text-gray-600">Keep track of your project time</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-mono font-bold">
                      {timer.minutes.toString().padStart(2, '0')}:
                      {timer.seconds.toString().padStart(2, '0')}
                    </span>
                    <Button size="sm" variant="outline" onClick={toggleTimer}>
                      {timer.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetTimer}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
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
                    <MessageCircle className="h-4 w-4 mr-2 text-[--primary-green]" />
                    AI Learning Assistant
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
