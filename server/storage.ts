import { users, materials, projects, submissions, type User, type InsertUser, type Material, type InsertMaterial, type Project, type InsertProject, type Submission, type InsertSubmission } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMaterialsBySession(sessionId: string): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  deleteMaterial(id: number): Promise<void>;
  updateMaterial(id: number, updates: Partial<InsertMaterial>): Promise<Material | undefined>;
  
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByMaterials(materialTypes: string[]): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getAllSubmissions(): Promise<Submission[]>;
  getSubmission(id: number): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getPublicSubmissions(): Promise<Submission[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private materials: Map<number, Material>;
  private projects: Map<number, Project>;
  private submissions: Map<number, Submission>;
  private currentUserId: number;
  private currentMaterialId: number;
  private currentProjectId: number;
  private currentSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.materials = new Map();
    this.projects = new Map();
    this.submissions = new Map();
    this.currentUserId = 1;
    this.currentMaterialId = 1;
    this.currentProjectId = 1;
    this.currentSubmissionId = 1;
    
    this.initializeProjects();
  }

  private initializeProjects() {
    const sampleProjects: InsertProject[] = [
      {
        title: "Water Filtration System",
        description: "Build a working water filter using plastic bottles and natural materials. Learn about environmental science, chemistry, and engineering principles.",
        category: "Environmental Science",
        difficulty: "Medium",
        duration: 45,
        ageRange: "8-12",
        rating: 5,
        materials: ["plastic_bottle", "sand", "gravel", "cotton", "charcoal"],
        steps: [
          {
            number: 1,
            title: "Prepare Your Materials",
            description: "Cut the plastic bottle in half. You'll use the top half (with the cap) as your filter housing. Remove the cap and set aside.",
            checklist: ["Materials gathered", "Safety equipment ready", "Workspace prepared"]
          },
          {
            number: 2,
            title: "Create Filter Layers",
            description: "Place a coffee filter or cloth at the bottle neck. Add layers of filtering materials in order: cotton balls, activated charcoal, fine sand, coarse sand, and small gravel.",
            checklist: ["Coffee filter placed", "Layers added in correct order", "Materials properly distributed"]
          },
          {
            number: 3,
            title: "Test Your Filter",
            description: "Create 'dirty water' by mixing soil and safe materials with clean water. Slowly pour this mixture through your filter and observe the results.",
            checklist: ["Test water prepared", "Filter tested", "Results recorded"]
          }
        ],
        objectives: [
          "Understand the principles of water filtration and purification",
          "Apply engineering design process to solve real-world problems",
          "Learn about environmental science and water quality",
          "Practice measurement and observation skills"
        ],
        concepts: {
          "Physics": "Gravity, particle size separation, surface tension, and flow dynamics",
          "Chemistry": "Adsorption, chemical filtration, pH levels, and contamination",
          "Engineering": "Design process, material selection, and system optimization",
          "Environmental Science": "Water quality, pollution sources, and conservation"
        },
        questions: [
          "Why do you think the layers are arranged in this specific order?",
          "What would happen if you reversed the order of the filtering materials?",
          "How could you improve your filter design to make it more effective?",
          "What are the limitations of this type of filtration system?",
          "How does this relate to water treatment plants in your community?"
        ]
      },
      {
        title: "Simple Electric Motor",
        description: "Create a basic electric motor using aluminum cans and simple electronics. Explore electromagnetism and energy conversion.",
        category: "Physics",
        difficulty: "Medium",
        duration: 30,
        ageRange: "10-14",
        rating: 4,
        materials: ["aluminum_can", "wire", "magnet", "battery"],
        steps: [
          {
            number: 1,
            title: "Prepare the Can",
            description: "Clean the aluminum can and create a stable base for your motor.",
            checklist: ["Can cleaned", "Base prepared", "Safety checked"]
          },
          {
            number: 2,
            title: "Wind the Coil",
            description: "Wrap wire around a cylindrical object to create an electromagnetic coil.",
            checklist: ["Coil wound properly", "Connections secured", "Coil tested"]
          }
        ],
        objectives: ["Understand electromagnetic principles", "Build a functional motor"],
        concepts: {
          "Physics": "Electromagnetism, energy conversion",
          "Engineering": "Motor design, electrical circuits"
        },
        questions: ["How does electricity create motion?", "What role do magnets play in motors?"]
      }
    ];

    sampleProjects.forEach(project => this.createProject(project));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMaterialsBySession(sessionId: string): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(material => material.scanSessionId === sessionId);
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.currentMaterialId++;
    const material: Material = { 
      ...insertMaterial, 
      id,
      createdAt: new Date()
    };
    this.materials.set(id, material);
    return material;
  }

  async deleteMaterial(id: number): Promise<void> {
    this.materials.delete(id);
  }

  async updateMaterial(id: number, updates: Partial<InsertMaterial>): Promise<Material | undefined> {
    const material = this.materials.get(id);
    if (material) {
      const updated = { ...material, ...updates };
      this.materials.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByMaterials(materialTypes: string[]): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => 
      materialTypes.some(type => project.materials.includes(type))
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values());
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date()
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getPublicSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(submission => submission.shareWithCommunity);
  }
}

export const storage = new MemStorage();
