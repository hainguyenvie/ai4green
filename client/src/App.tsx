import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import HomePage from "@/pages/home";
import AIScanPage from "@/pages/ai-scan";
import RecommendationsPage from "@/pages/recommendations";
import LessonPlanPage from "@/pages/lesson-plan";
import ProjectExecutionPage from "@/pages/project-execution";
import SubmissionPage from "@/pages/submission";
import CommunityPage from "@/pages/community";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Navigation />
      <div className="pt-16">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/scan" component={AIScanPage} />
          <Route path="/recommendations" component={RecommendationsPage} />
          <Route path="/lesson-plan/:id" component={LessonPlanPage} />
          <Route path="/project/:id" component={ProjectExecutionPage} />
          <Route path="/submission" component={SubmissionPage} />
          <Route path="/community" component={CommunityPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
