export interface Opportunity {
    id: string;
    title: string;
    category: string;
    description: string;
    mentor: string;
    deadline: string;
    image: string;
    categoryColor: string;
    tags?: string[];
    duration?: string;
    startDate?: string;
}

export const opportunities: Opportunity[] = [
    {
        id: "1",
        title: "Genetic Medicine Fellowship",
        category: "Data Science",
        description: "Explore gene therapy approaches for rare genetic diseases with our multidisciplinary team.",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=1471&auto=format&fit=crop",
        categoryColor: "bg-[#00D1FF]",
        tags: ["Genetic Medicine", "Fellowship", "Data Science"],
        duration: "12 Months",
        startDate: "August 2026"
    },
    {
        id: "2",
        title: "Neuroscience Laboratory Position",
        category: "Neurology",
        description: "Investigate neural mechanics and brain plasticity implementing advanced imaging techniques and optogenetics.",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1631&auto=format&fit=crop",
        categoryColor: "bg-[#00D1FF]",
        tags: ["Neuroscience", "Laboratory", "Neurology"],
        duration: "6 Months",
        startDate: "June 2026"
    },
    {
        id: "3",
        title: "AI in Healthcare Research Position",
        category: "Data Science",
        description: "Develop predictive learning models for early disease detection and patient outcome prediction using multi-modal health data.",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1470&auto=format&fit=crop",
        categoryColor: "bg-[#00D1FF]",
        tags: ["AI", "Healthcare", "Data Science"],
        duration: "24 Months",
        startDate: "January 2027"
    },
    {
        id: "4",
        title: "Clinical Research in Cardiovascular Medicine",
        category: "Cardiology",
        description: "Joint-cutting edge cardiovascular research and investigating novel treatment approaches for heart failure and arrhythmias.",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1480&auto=format&fit=crop",
        categoryColor: "bg-[#00D1FF]",
        tags: ["Oncology", "Medicine"], // As per detail image
        duration: "2 Months",
        startDate: "July 2026"
    },
    {
        id: "5",
        title: "Autoimmune Disease Research",
        category: "Neurology",
        description: "Investigate novel therapeutic targets for autoimmune conditions using cutting-edge single-cell technology.",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1532187863486-abf9d3a3ae19?q=80&w=1470&auto=format&fit=crop",
        categoryColor: "bg-[#00D1FF]",
        tags: ["Immunology", "Neurology"],
        duration: "18 Months",
        startDate: "September 2026"
    },
    {
        id: "6",
        title: "Global Health Initiative Research Fellow",
        category: "Public Health",
        description: "Contribute to research improving healthcare access and outcomes in underserved communities across multiple continents.",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1470&auto=format&fit=crop",
        categoryColor: "bg-[#00D1FF]",
        tags: ["Global Health", "Public Health"],
        duration: "12 Months",
        startDate: "October 2026"
    }
];
