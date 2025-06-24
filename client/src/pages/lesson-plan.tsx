import { Link } from "wouter";
import { ArrowLeft, Target, Lightbulb, ListOrdered, Microscope, HelpCircle, ClipboardCheck, Play, Download, Share2, Clock, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, getDifficultyColor } from "@/lib/utils";
import type { Project } from "@shared/schema";

interface LessonPlanPageProps {
  params: { id: string };
}

export default function LessonPlanPage({ params }: LessonPlanPageProps) {
  const projectId = parseInt(params.id);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary-green] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lesson plan...</p>
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
            <h2 className="text-2xl font-bold mb-2">Lesson Plan Not Found</h2>
            <p className="text-gray-600 mb-6">The lesson plan you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-[--secondary-green]">Home</Link></li>
            <li>/</li>
            <li><Link href="/recommendations" className="hover:text-[--secondary-green]">Recommendations</Link></li>
            <li>/</li>
            <li className="text-[--primary-green] font-medium">Lesson Plan</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8">
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-[--accent-green] text-[--text-dark-green]">
                    {project.category}
                  </Badge>
                  <Badge className={getDifficultyColor(project.difficulty)}>
                    {project.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    Age {project.ageRange}
                  </Badge>
                </div>
              </div>
              <Link href="/recommendations">
                <Button variant="outline" className="mt-4 lg:mt-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
            </div>

            {/* Learning Objectives */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-[--primary-green]" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-2 w-2 bg-[--accent-green] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {objective}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Warm-up Activities */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                  Warm-up Activities (10 minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="lesson-step">
                  <h4 className="font-semibold mb-2">Discussion: Clean Water Access</h4>
                  <p className="mb-3">
                    Begin with a brief discussion about water quality around the world. Ask students where their tap water comes from and how it might be cleaned.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Discussion Prompt:</strong> "What do you think happens to water before it reaches your faucet?"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step-by-step Instructions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListOrdered className="h-5 w-5 mr-2 text-[--success-green]" />
                  Step-by-Step Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.steps.map((step, index) => (
                    <div key={index} className="lesson-step">
                      <div className="flex items-start">
                        <div className="bg-[--primary-green] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                          {step.number}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold mb-2">{step.title}</h4>
                          <p className="mb-4">{step.description}</p>
                          {step.imageUrl && (
                            <img
                              src={step.imageUrl}
                              alt={`Step ${step.number} illustration`}
                              className="rounded-lg mb-4 max-h-48 w-full object-cover"
                            />
                          )}
                          {step.checklist && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <h5 className="font-medium text-amber-800 mb-2">
                                ⚠️ Safety Note: Adult supervision required for cutting. Use appropriate tools and safety equipment.
                              </h5>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* STEM Concepts */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Microscope className="h-5 w-5 mr-2 text-blue-500" />
                  Related STEM Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(project.concepts).map(([subject, description]) => (
                    <div key={subject} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{subject}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Critical Thinking Questions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-amber-500" />
                  Critical Thinking Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {project.questions.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <span className="font-semibold text-[--primary-green] mr-3">{index + 1}.</span>
                      {question}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2 text-red-500" />
                  Assessment & Extension
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Assessment Criteria:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Successful construction of functional filter</li>
                      <li>• Accurate observations and data recording</li>
                      <li>• Understanding of scientific principles involved</li>
                      <li>• Ability to suggest improvements to design</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Extension Activities:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Test different filtering materials and compare effectiveness</li>
                      <li>• Research water treatment methods in different countries</li>
                      <li>• Design a larger-scale filtration system for your school garden</li>
                      <li>• Investigate local water quality and treatment facilities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Timer */}
              <div className="timer-display">
                <div className="flex justify-between items-center">
                  <span>Estimated Duration</span>
                  <span className="font-bold">{formatDuration(project.duration)}</span>
                </div>
              </div>

              {/* Materials Needed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Wrench className="h-4 w-4 mr-2" />
                    Materials Needed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.materials.map((material, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="h-2 w-2 bg-[--success-green] rounded-full mr-3"></div>
                        {material.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href={`/project/${project.id}`}>
                  <Button size="lg" className="w-full bg-[--success-green] hover:bg-[--primary-green]">
                    <Play className="h-4 w-4 mr-2" />
                    Start Project
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Lesson Plan
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with Class
                </Button>
              </div>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-bold text-[--primary-green]">{project.ageRange}</div>
                      <div className="text-xs text-gray-600">Age Range</div>
                    </div>
                    <div>
                      <div className="font-bold text-[--success-green]">{project.difficulty}</div>
                      <div className="text-xs text-gray-600">Difficulty</div>
                    </div>
                    <div>
                      <div className="font-bold text-amber-500">{project.rating || 5}★</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
