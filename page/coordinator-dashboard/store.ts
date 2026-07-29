// Helper store for coordinator dashboard mock data persistence

export interface IResearchSubmission {
  id: number;
  study_title: string;
  study_descritions: string;
  research_objectives: string;
  perposed_methodology: string;
  mentor_name: string;
  mentor_email: string;
  created_at: string;
  status: "pending" | "approved" | "declined";
  dead_line?: string;
  start_date?: string;
  end_date?: string;
  submission_proof?: string;
}

export interface IOpportunityApplication {
  id: number;
  researcher_name: string;
  researcher_email: string;
  opportunity_title: string;
  mentor_name: string;
  created_at: string;
  status: "pending" | "accepted" | "declined";
}

const DEFAULT_SUBMISSIONS: IResearchSubmission[] = [
  {
    id: 101,
    study_title: "Machine Learning Solutions in Cardiovascular Disease Risk Prediction",
    study_descritions: "This study aims to develop and test machine learning algorithms to predict cardiovascular disease risk using structured electronic health records and demographic variables.",
    research_objectives: "1. Construct predictive ML models.\n2. Evaluate accuracy metrics against standard cardiovascular risk indices.\n3. Implement a web dashboard prototype.",
    perposed_methodology: "We will use historical data from EHR databases. Algorithms like Random Forest, XGBoost, and neural networks will be evaluated. Metrics will include AUROC and F1 score.",
    mentor_name: "Dr. Sarah Jenkins",
    mentor_email: "sarah.jenkins@publicationhub.co",
    created_at: "2026-06-20T10:15:30Z",
    status: "pending"
  },
  {
    id: 102,
    study_title: "Impact of Microplastics on Coastal Marine Food Webs",
    study_descritions: "Investigating the bioaccumulation rates of microplastics in trophic levels of coastal marine organisms off the Northern Atlantic coast.",
    research_objectives: "Analyze microplastic ingestion rates in key fish species and zooplankton over seasonal cycles.",
    perposed_methodology: "Field sampling, physical identification via stereomicroscopy, and chemical profiling using FTIR spectroscopy.",
    mentor_name: "Prof. David Vance",
    mentor_email: "david.vance@publicationhub.co",
    created_at: "2026-06-22T08:30:00Z",
    status: "approved",
    dead_line: "2026-09-22",
    start_date: "2026-06-22",
    end_date: "2026-09-22"
  },
  {
    id: 103,
    study_title: "Quantum Dot Solar Cells: Efficiency and Stability Analyses",
    study_descritions: "Synthesizing novel halide perovskite quantum dots to evaluate their power conversion efficiency and long-term thermal stability in ambient air conditions.",
    research_objectives: "Improve power conversion efficiency above 15% and minimize moisture-based degradation.",
    perposed_methodology: "Spin-coating deposition of quantum dot thin films followed by optical absorption profiling and device J-V curves under simulated sunlight.",
    mentor_name: "Dr. Alan Mercer",
    mentor_email: "alan.mercer@publicationhub.co",
    created_at: "2026-06-18T14:40:00Z",
    status: "pending"
  },
  {
    id: 104,
    study_title: "Autonomous Swarm Robotics in Urban Search and Rescue",
    study_descritions: "Design of decentralized coordination algorithms enabling small robot swarms to locate survivors in simulated collapsed building environments.",
    research_objectives: "Implement navigation policies that maintain connection graph connectivity under physical obstacles.",
    perposed_methodology: "ROS-based simulated evaluations followed by physical drone swarm trials inside indoor motion-capture arenas.",
    mentor_name: "Dr. Linus Cho",
    mentor_email: "linus.cho@publicationhub.co",
    created_at: "2026-06-15T09:00:00Z",
    status: "approved",
    dead_line: "2026-09-15",
    start_date: "2026-06-15",
    end_date: "2026-09-15",
    submission_proof: "proof_paper_draft.pdf"
  },
  {
    id: 105,
    study_title: "Sociological Shifts in Remote Work Teams Post-2024",
    study_descritions: "An assessment of trust, productivity decay, and micro-collaboration architectures across fully remote versus hybrid corporate setups.",
    research_objectives: "Define indices of collaboration quality and benchmark trust over virtual communication platforms.",
    perposed_methodology: "Survey-based qualitative interviews alongside network activity analysis in Slack, Teams, and Jira.",
    mentor_name: "Prof. Emily Watson",
    mentor_email: "emily.watson@publicationhub.co",
    created_at: "2026-06-10T11:20:00Z",
    status: "declined"
  }
];

const DEFAULT_APPLICATIONS: IOpportunityApplication[] = [
  {
    id: 501,
    researcher_name: "Alice Montgomery",
    researcher_email: "alice.m@gmail.com",
    opportunity_title: "Quantum Dot Solar Cells Optimization",
    mentor_name: "Dr. Alan Mercer",
    created_at: "2026-06-23T11:00:00Z",
    status: "pending"
  },
  {
    id: 502,
    researcher_name: "Robert Chen",
    researcher_email: "robert.c@gmail.com",
    opportunity_title: "Microplastics Field Sampling Studies",
    mentor_name: "Prof. David Vance",
    created_at: "2026-06-24T16:10:00Z",
    status: "accepted"
  },
  {
    id: 503,
    researcher_name: "Maria Vasilev",
    researcher_email: "maria.v@gmail.com",
    opportunity_title: "Cardiovascular Risk ML Analysis",
    mentor_name: "Dr. Sarah Jenkins",
    created_at: "2026-06-24T09:30:00Z",
    status: "pending"
  }
];

// LocalStorage helpers
export const getSubmissions = (): IResearchSubmission[] => {
  if (typeof window === "undefined") return DEFAULT_SUBMISSIONS;
  const stored = localStorage.getItem("coordinator_submissions");
  if (!stored) {
    localStorage.setItem("coordinator_submissions", JSON.stringify(DEFAULT_SUBMISSIONS));
    return DEFAULT_SUBMISSIONS;
  }
  return JSON.parse(stored);
};

export const saveSubmissions = (data: IResearchSubmission[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("coordinator_submissions", JSON.stringify(data));
};

export const getApplications = (): IOpportunityApplication[] => {
  if (typeof window === "undefined") return DEFAULT_APPLICATIONS;
  const stored = localStorage.getItem("coordinator_applications");
  if (!stored) {
    localStorage.setItem("coordinator_applications", JSON.stringify(DEFAULT_APPLICATIONS));
    return DEFAULT_APPLICATIONS;
  }
  return JSON.parse(stored);
};

export const saveApplications = (data: IOpportunityApplication[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("coordinator_applications", JSON.stringify(data));
};

export const getStats = () => {
  const subs = getSubmissions();
  const apps = getApplications();

  return {
    totalSubmissions: subs.length,
    pendingSubmissions: subs.filter(s => s.status === "pending").length,
    approvedSubmissions: subs.filter(s => s.status === "approved").length,
    declinedSubmissions: subs.filter(s => s.status === "declined").length,
    totalApplications: apps.length,
    pendingApplications: apps.filter(a => a.status === "pending").length,
    acceptedApplications: apps.filter(a => a.status === "accepted").length,
  };
};
