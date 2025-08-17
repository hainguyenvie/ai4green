import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Trophy, Camera, Star, Shield, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CompletedProject {
  projectId: number;
  completedAt: string;
  duration: string;
}

export default function SubmissionPage() {
  const { toast } = useToast();
  const [completedProject, setCompletedProject] = useState<CompletedProject | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "My Amazing Water Filter!",
    difficulty: "medium",
    satisfaction: "5",
    safety: "very-safe",
    feedback: "",
    learningOutcomes: [] as string[],
    shareWithCommunity: true,
    shareWithTeacher: false,
    shareOnSocial: false,
  });

  useEffect(() => {
    const project = sessionStorage.getItem('completedProject');
    if (project) {
      setCompletedProject(JSON.parse(project));
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/submissions', {
        projectId: completedProject?.projectId,
        title: formData.title,
        photos: uploadedPhotos,
        difficulty: formData.difficulty,
        satisfaction: parseInt(formData.satisfaction),
        safety: formData.safety,
        feedback: formData.feedback,
        learningOutcomes: formData.learningOutcomes,
        shareWithCommunity: formData.shareWithCommunity,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Submitted! 🎉",
        description: "Congratulations! You'll receive a digital certificate via email.",
      });
      // Clear session data
      sessionStorage.removeItem('completedProject');
      sessionStorage.removeItem('scannedMaterials');
      // Navigate to community
      setTimeout(() => {
        window.location.href = '/community';
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Unable to submit your project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const mockPhotos = [
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    ];
    setUploadedPhotos(mockPhotos);
    toast({
      title: "Photos Uploaded",
      description: "Successfully uploaded 2 project photos.",
    });
  };

  const handleLearningOutcomeChange = (outcome: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: checked 
        ? [...prev.learningOutcomes, outcome]
        : prev.learningOutcomes.filter(o => o !== outcome)
    }));
  };

  const handleSubmit = () => {
    if (!completedProject) {
      toast({
        title: "No Project Data",
        description: "Please complete a project before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-[--secondary-green]">Home</Link></li>
            <li>/</li>
            <li><Link href="/project/1" className="hover:text-[--secondary-green]">Project</Link></li>
            <li>/</li>
            <li className="text-[--primary-green] font-medium">Project Submission</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="feature-icon mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
              <Trophy className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Congratulations!</h1>
            <p className="text-xl text-gray-600">
              You've completed your Water Filtration System project. Share your achievement with the community!
            </p>
            {completedProject && (
              <p className="text-sm text-gray-500 mt-2">
                Completed in {completedProject.duration} • {new Date(completedProject.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Project Photos Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Share Your Project Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedPhotos.length === 0 ? (
                <div className="upload-zone">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload photos of your finished water filter</h3>
                  <p className="text-gray-600 mb-6">Show off your creation and help other students learn!</p>
                  <Button onClick={handlePhotoUpload} className="bg-[--primary-green] hover:bg-[--secondary-green]">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos/Videos
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {uploadedPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Project photo ${index + 1}`}
                        className="rounded-lg shadow-sm w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                  <Button variant="outline" onClick={handlePhotoUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload More Photos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Feedback Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Project Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Difficulty Rating */}
              <div>
                <Label className="text-base font-semibold">How challenging was this project?</Label>
                <RadioGroup 
                  value={formData.difficulty} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  className="flex flex-wrap gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy" className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      😊 Easy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      🤔 Medium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard" className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      😓 Challenging
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Satisfaction Rating */}
              <div>
                <Label className="text-base font-semibold">How satisfied are you with your results?</Label>
                <RadioGroup 
                  value={formData.satisfaction} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, satisfaction: value }))}
                  className="flex justify-between items-center mt-2"
                >
                  <span className="text-sm text-gray-600">Not satisfied</span>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-1">
                        <RadioGroupItem value={rating.toString()} id={`star${rating}`} />
                        <Label htmlFor={`star${rating}`} className="text-xl">
                          {'⭐'.repeat(rating)}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Very satisfied</span>
                </RadioGroup>
              </div>

              {/* Safety Rating */}
              <div>
                <Label className="text-base font-semibold mb-3 block">How safe did you feel during the project?</Label>
                <RadioGroup 
                  value={formData.safety} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, safety: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-safe" id="very-safe" />
                    <Label htmlFor="very-safe" className="flex items-center">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      Very safe - I followed all safety guidelines
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mostly-safe" id="mostly-safe" />
                    <Label htmlFor="mostly-safe" className="flex items-center">
                      <Shield className="h-4 w-4 text-yellow-500 mr-2" />
                      Mostly safe - Had minor concerns
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unsafe" id="unsafe" />
                    <Label htmlFor="unsafe" className="flex items-center">
                      <Shield className="h-4 w-4 text-red-500 mr-2" />
                      Felt unsafe - Need better safety guidance
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Written Feedback */}
              <div>
                <Label htmlFor="feedback" className="text-base font-semibold">Tell us about your experience</Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="What did you learn? What was the most interesting part? Any suggestions for improvement?"
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Learning Outcomes */}
              <div>
                <Label className="text-base font-semibold mb-3 block">What did you learn from this project? (Check all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Water filtration principles',
                    'Engineering design process',
                    'Environmental science concepts',
                    'Creative recycling',
                    'Problem-solving skills',
                    'Teamwork and collaboration'
                  ].map((outcome) => (
                    <div key={outcome} className="flex items-center space-x-2">
                      <Checkbox
                        id={outcome}
                        checked={formData.learningOutcomes.includes(outcome)}
                        onCheckedChange={(checked) => handleLearningOutcomeChange(outcome, checked as boolean)}
                      />
                      <Label htmlFor={outcome} className="text-sm">{outcome}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Share Your Achievement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 mb-4">
                Help inspire other students by sharing your project with the RecyCool community!
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="share-community"
                    checked={formData.shareWithCommunity}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithCommunity: checked as boolean }))}
                  />
                  <div>
                    <Label htmlFor="share-community" className="font-medium">Share with RecyCool Community</Label>
                    <p className="text-sm text-gray-600">Your project will be visible to other students and teachers for inspiration</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="share-teacher"
                    checked={formData.shareWithTeacher}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithTeacher: checked as boolean }))}
                  />
                  <div>
                    <Label htmlFor="share-teacher" className="font-medium">Send to my teacher</Label>
                    <p className="text-sm text-gray-600">Automatically notify your teacher about your completed project</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="share-social"
                    checked={formData.shareOnSocial}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareOnSocial: checked as boolean }))}
                  />
                  <div>
                    <Label htmlFor="share-social" className="font-medium">Generate social media post</Label>
                    <p className="text-sm text-gray-600">Create a shareable post for platforms like Instagram or Twitter</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="project-title" className="text-base font-semibold">Give your project a title</Label>
                <Input
                  id="project-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a creative title for your project"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="bg-[--success-green] hover:bg-[--primary-green] px-8"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Project
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600 mt-2">You'll receive a digital certificate after submission!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
