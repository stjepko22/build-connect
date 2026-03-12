import { makeAutoObservable } from 'mobx';
import RootStore from '@/core/stores/RootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { IJob } from '@/modules/marketplace/jobs/models/IJob';

type UserRole = 'INVESTITOR' | 'IZVODJAC';

export default class JobStore {
  rootStore: RootStore;
  jobs: IJob[] = [
    {
      id: 'posao-1',
      title: 'Izrada fasade na obiteljskoj kuci',
      description: 'Potrebna izrada termo fasade (stiropor 10cm) na objektu od 200m2. Materijal osiguran.',
      category: 'Fasade',
      location: 'Zagreb',
      budget: 3500,
      deadline: '2026-05-01',
      investitorId: 'investitor-1',
      createdAt: new Date('2026-02-08'),
    },
    {
      id: 'posao-2',
      title: 'Postavljanje keramike u kupaonici',
      description: 'Potrebno postaviti 40m2 plocica u novogradnji. Podloga je spremna.',
      category: 'Keramika',
      location: 'Split',
      budget: 800,
      deadline: '2026-03-15',
      investitorId: 'investitor-2',
      createdAt: new Date('2026-02-09'),
    },
    {
      id: 'posao-3',
      title: 'Sanacija krova na poslovnom objektu',
      description: 'Potrebna zamjena dotrajale limarije i hidroizolacije na krovu povrsine 320m2.',
      category: 'Krovovi',
      location: 'Rijeka',
      budget: 6200,
      deadline: '2026-06-10',
      investitorId: 'investitor-1',
      createdAt: new Date('2026-02-10'),
    },
    {
      id: 'posao-4',
      title: 'Kompletna elektro instalacija stana',
      description: 'Novogradnja 85m2. Razvod ormara, uticnice, rasvjeta i priprema za pametni sustav.',
      category: 'Elektro',
      location: 'Zadar',
      budget: 2800,
      deadline: '2026-04-20',
      investitorId: 'investitor-2',
      createdAt: new Date('2026-02-11'),
    },
    {
      id: 'posao-5',
      title: 'Vodoinstalaterski radovi u kuci',
      description: 'Potrebna zamjena glavnih cijevi i ugradnja novih prikljucaka u dvije kupaonice.',
      category: 'Vodoinstalacije',
      location: 'Osijek',
      budget: 1900,
      deadline: '2026-04-02',
      investitorId: 'investitor-1',
      createdAt: new Date('2026-02-13'),
    },
    {
      id: 'posao-6',
      title: 'Ugradnja podnog grijanja',
      description: 'Projekt obuhvaca 110m2 prostora, pripremu podloge i test sustava prije glazure.',
      category: 'Grijanje',
      location: 'Varazdin',
      budget: 3400,
      deadline: '2026-05-18',
      investitorId: 'investitor-2',
      createdAt: new Date('2026-02-14'),
    },
    {
      id: 'posao-7',
      title: 'Renovacija ureda open-space',
      description: 'Rusenje pregradnih zidova, gletanje, bojanje i priprema instalacija za nove pozicije.',
      category: 'Renovacija',
      location: 'Zagreb',
      budget: 7600,
      deadline: '2026-05-30',
      investitorId: 'investitor-1',
      createdAt: new Date('2026-02-16'),
    },
    {
      id: 'posao-8',
      title: 'Izrada drvene vanjske stolarije',
      description: 'Potrebna izrada i montaza 6 prozora i 2 balkonska vrata od lameliranog drveta.',
      category: 'Stolarija',
      location: 'Pula',
      budget: 5100,
      deadline: '2026-06-25',
      investitorId: 'investitor-2',
      createdAt: new Date('2026-02-18'),
    },
    {
      id: 'posao-9',
      title: 'Priprema gradilista i grubi gradevinski radovi',
      description: 'Potrebna ekipa za iskope, oplatu i betoniranje temeljne ploce za obiteljsku kucu.',
      category: 'Gradnja',
      location: 'Sisak',
      budget: 12400,
      deadline: '2026-07-05',
      investitorId: 'investitor-1',
      createdAt: new Date('2026-02-20'),
    },
  ];

  isLoading = false;
  createJobTitle = '';
  createJobDescription = '';
  createJobLocation = '';
  createJobBudget = '';
  createJobCategory: JobCategory | '' = '';
  createJobDeadline = '';
  jobSearchInputValue = '';
  jobSearchQuery = '';
  selectedJobCategories: JobCategory[] = [];
  defaultJobCategoryFiltersByRole: Record<UserRole, JobCategory[]> = {
    INVESTITOR: [],
    IZVODJAC: ['Fasade'],
  };
  myJobsTabValue = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  createJob = async (jobData: Omit<IJob, 'id' | 'createdAt' | 'investitorId'>) => {
    this.isLoading = true;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newJob: IJob = {
          ...jobData,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date(),
          investitorId: this.rootStore.authenticationStore.user?.id || 'unknown',
        };
        this.jobs.push(newJob);
        this.isLoading = false;
        resolve();
      }, 1000);
    });
  };

  setCreateJobTitle = (value: string) => { this.createJobTitle = value; };
  setCreateJobDescription = (value: string) => { this.createJobDescription = value; };
  setCreateJobLocation = (value: string) => { this.createJobLocation = value; };
  setCreateJobBudget = (value: string) => { this.createJobBudget = value; };
  setCreateJobCategory = (value: JobCategory | '') => { this.createJobCategory = value; };
  setCreateJobDeadline = (value: string) => { this.createJobDeadline = value; };
  setJobSearchInputValue = (value: string) => { this.jobSearchInputValue = value; };
  setJobSearchQuery = (value: string) => { this.jobSearchQuery = value; };
  setSelectedJobCategories = (categories: JobCategory[]) => { this.selectedJobCategories = categories; };
  setMyJobsTabValue = (value: number) => { this.myJobsTabValue = value; };

  resetCreateJobForm = () => {
    this.createJobTitle = '';
    this.createJobDescription = '';
    this.createJobLocation = '';
    this.createJobBudget = '';
    this.createJobCategory = '';
    this.createJobDeadline = '';
  };

  resetJobSearch = () => {
    this.jobSearchInputValue = '';
    this.jobSearchQuery = '';
  };

  resetSelectedJobCategories = () => {
    this.selectedJobCategories = [];
  };

  toggleSelectedJobCategory = (category: JobCategory) => {
    if (this.selectedJobCategories.includes(category)) {
      this.selectedJobCategories = this.selectedJobCategories.filter((item) => item !== category);
      return;
    }

    this.selectedJobCategories = [...this.selectedJobCategories, category];
  };

  initializeJobFiltersForCurrentUser = () => {
    const role = this.rootStore.authenticationStore.user?.role;
    if (!role) {
      this.selectedJobCategories = [];
      return;
    }

    this.selectedJobCategories = [...this.defaultJobCategoryFiltersByRole[role]];
  };

  saveCurrentJobFiltersAsDefault = () => {
    const role = this.rootStore.authenticationStore.user?.role;
    if (!role) {
      return;
    }

    this.defaultJobCategoryFiltersByRole = {
      ...this.defaultJobCategoryFiltersByRole,
      [role]: [...this.selectedJobCategories],
    };
  };

  resetAllJobFilters = () => {
    this.resetJobSearch();
    this.resetSelectedJobCategories();
  };

  resetMyJobsTab = () => {
    this.myJobsTabValue = 0;
  };

  get isCreateJobFormValid() {
    return (
      this.createJobTitle.trim().length > 0 &&
      this.createJobDescription.trim().length > 0 &&
      this.createJobLocation.trim().length > 0 &&
      this.createJobCategory.trim().length > 0 &&
      this.createJobDeadline.trim().length > 0
    );
  }

  submitCreateJobForm = async () => {
    if (!this.isCreateJobFormValid) {
      return false;
    }

    const isCategoryValid = JOB_CATEGORIES.includes(this.createJobCategory as JobCategory);
    if (!isCategoryValid) {
      return false;
    }

    await this.createJob({
      title: this.createJobTitle,
      description: this.createJobDescription,
      location: this.createJobLocation,
      budget: this.createJobBudget ? Number(this.createJobBudget) : undefined,
      category: this.createJobCategory as JobCategory,
      deadline: this.createJobDeadline,
    });

    this.resetCreateJobForm();
    return true;
  };

  get filteredJobs() {
    const query = this.jobSearchQuery.toLowerCase().trim();
    let filtered = this.jobs;

    if (this.selectedJobCategories.length > 0) {
      filtered = filtered.filter((job) => this.selectedJobCategories.includes(job.category));
    }

    if (!query) {
      return filtered;
    }

    return filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query)
    );
  }

  get allJobs() {
    return this.jobs;
  }
}
