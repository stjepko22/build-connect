import { AxiosError } from 'axios';
import IGetJobsQuery from '@/api/models/jobs/IGetJobsQuery';
import { IJobResponse } from '@/api/models/jobs/IJobResponse';
import RootStore from '@/core/stores/RootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { IJob } from '@/modules/marketplace/jobs/models/IJob';
import { JobStatus } from '@/modules/marketplace/jobs/models/JobStatus';
import JobService from '@/modules/marketplace/jobs/services/JobService';
import { makeAutoObservable, runInAction } from 'mobx';

type UserRole = 'INVESTITOR' | 'IZVODJAC';

export default class JobStore {
  rootStore: RootStore;
  jobService: JobService;
  jobs: IJob[] = [];

  isLoading = false;
  isLoadingJobs = false;
  isLoadingJobDetails = false;
  jobsError: string | null = null;
  selectedJobError: string | null = null;
  createJobTitle = '';
  createJobDescription = '';
  createJobLocation = '';
  createJobBudget = '';
  createJobCategory: JobCategory | '' = '';
  createJobDeadline = '';
  editJobId = '';
  editJobTitle = '';
  editJobDescription = '';
  editJobLocation = '';
  editJobBudget = '';
  editJobCategory: JobCategory | '' = '';
  editJobDeadline = '';
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
    this.jobService = new JobService();
    makeAutoObservable(this);
  }

  createJob = async (jobData: Omit<IJob, 'id' | 'createdAt' | 'investitorId' | 'status'>) => {
    const user = this.rootStore.authenticationStore.user;
    if (!user) {
      runInAction(() => {
        this.jobsError = 'Morate biti prijavljeni za objavu oglasa.';
      });
      return false;
    }

    this.isLoading = true;
    this.jobsError = null;

    try {
      const response = await this.jobService.createJobAsync(
        {
          title: jobData.title,
          description: jobData.description,
          category: jobData.category,
          location: jobData.location,
          budget: jobData.budget,
          deadline: jobData.deadline,
        }
      );

      runInAction(() => {
        this.upsertJob(this.mapJobResponseToModel(response.data));
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.jobsError = this.getApiErrorMessage(error, 'Objava oglasa nije uspjela.');
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  updateJob = async (jobId: string, jobData: Omit<IJob, 'id' | 'createdAt' | 'investitorId' | 'status'>) => {
    const user = this.rootStore.authenticationStore.user;
    if (!user) {
      runInAction(() => {
        this.jobsError = 'Morate biti prijavljeni za azuriranje oglasa.';
      });
      return false;
    }

    this.isLoading = true;
    this.jobsError = null;

    try {
      const response = await this.jobService.updateJobAsync(jobId, {
        title: jobData.title,
        description: jobData.description,
        category: jobData.category,
        location: jobData.location,
        budget: jobData.budget,
        deadline: jobData.deadline,
      });

      const updatedJob = this.mapJobResponseToModel(response.data);

      runInAction(() => {
        this.upsertJob(updatedJob);
        this.initializeEditJobForm(updatedJob);
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.jobsError = this.getApiErrorMessage(error, 'Azuriranje oglasa nije uspjelo.');
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  loadJobs = async (query: IGetJobsQuery = {}) => {
    this.isLoadingJobs = true;
    this.jobsError = null;

    try {
      const response = await this.jobService.getJobsAsync(query);
      runInAction(() => {
        this.jobs = response.data.map(this.mapJobResponseToModel);
      });
    } catch (error) {
      runInAction(() => {
        this.jobsError = this.getApiErrorMessage(error, 'Dohvat poslova nije uspio.');
      });
    } finally {
      runInAction(() => {
        this.isLoadingJobs = false;
      });
    }
  };

  loadJobById = async (jobId: string) => {
    if (!jobId.trim()) {
      return null;
    }

    this.isLoadingJobDetails = true;
    this.selectedJobError = null;

    try {
      const response = await this.jobService.getJobAsync(jobId);
      const job = this.mapJobResponseToModel(response.data);

      runInAction(() => {
        this.upsertJob(job);
      });

      return job;
    } catch (error) {
      runInAction(() => {
        this.selectedJobError = this.getApiErrorMessage(error, 'Dohvat detalja posla nije uspio.');
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoadingJobDetails = false;
      });
    }
  };

  closeJob = async (jobId: string) => {
    this.isLoading = true;
    this.jobsError = null;

    try {
      const response = await this.jobService.closeJobAsync(jobId);
      const closedJob = this.mapJobResponseToModel(response.data);

      runInAction(() => {
        this.upsertJob(closedJob);
      });

      return closedJob;
    } catch (error) {
      runInAction(() => {
        this.jobsError = this.getApiErrorMessage(error, 'Zatvaranje oglasa nije uspjelo.');
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  completeJob = async (jobId: string) => {
    this.isLoading = true;
    this.jobsError = null;

    try {
      const response = await this.jobService.completeJobAsync(jobId);
      const completedJob = this.mapJobResponseToModel(response.data);

      runInAction(() => {
        this.upsertJob(completedJob);
      });

      return completedJob;
    } catch (error) {
      runInAction(() => {
        this.jobsError = this.getApiErrorMessage(error, 'Zavrsetak posla nije uspio.');
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  deleteJob = async (jobId: string) => {
    this.isLoading = true;
    this.jobsError = null;

    try {
      await this.jobService.deleteJobAsync(jobId);

      runInAction(() => {
        this.jobs = this.jobs.filter((job) => job.id !== jobId);
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.jobsError = this.getApiErrorMessage(error, 'Brisanje oglasa nije uspjelo.');
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  setCreateJobTitle = (value: string) => { this.createJobTitle = value; };
  setCreateJobDescription = (value: string) => { this.createJobDescription = value; };
  setCreateJobLocation = (value: string) => { this.createJobLocation = value; };
  setCreateJobBudget = (value: string) => { this.createJobBudget = value; };
  setCreateJobCategory = (value: JobCategory | '') => { this.createJobCategory = value; };
  setCreateJobDeadline = (value: string) => { this.createJobDeadline = value; };
  setEditJobTitle = (value: string) => { this.editJobTitle = value; this.jobsError = null; };
  setEditJobDescription = (value: string) => { this.editJobDescription = value; this.jobsError = null; };
  setEditJobLocation = (value: string) => { this.editJobLocation = value; this.jobsError = null; };
  setEditJobBudget = (value: string) => { this.editJobBudget = value; this.jobsError = null; };
  setEditJobCategory = (value: JobCategory | '') => { this.editJobCategory = value; this.jobsError = null; };
  setEditJobDeadline = (value: string) => { this.editJobDeadline = value; this.jobsError = null; };
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

  initializeEditJobForm = (job: IJob) => {
    this.editJobId = job.id;
    this.editJobTitle = job.title;
    this.editJobDescription = job.description;
    this.editJobLocation = job.location;
    this.editJobBudget = job.budget?.toString() || '';
    this.editJobCategory = job.category;
    this.editJobDeadline = job.deadline;
    this.jobsError = null;
  };

  resetEditJobForm = () => {
    this.editJobId = '';
    this.editJobTitle = '';
    this.editJobDescription = '';
    this.editJobLocation = '';
    this.editJobBudget = '';
    this.editJobCategory = '';
    this.editJobDeadline = '';
    this.jobsError = null;
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

  get isEditJobFormValid() {
    return (
      this.editJobTitle.trim().length > 0 &&
      this.editJobDescription.trim().length > 0 &&
      this.editJobLocation.trim().length > 0 &&
      this.editJobCategory.trim().length > 0 &&
      this.editJobDeadline.trim().length > 0
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

    const isCreated = await this.createJob({
      title: this.createJobTitle,
      description: this.createJobDescription,
      location: this.createJobLocation,
      budget: this.createJobBudget ? Number(this.createJobBudget) : undefined,
      category: this.createJobCategory as JobCategory,
      deadline: this.createJobDeadline,
    });

    if (!isCreated) {
      return false;
    }

    this.resetCreateJobForm();
    return true;
  };

  submitEditJobForm = async () => {
    if (!this.editJobId.trim()) {
      this.jobsError = 'Oglas nije dostupan za uredjivanje.';
      return false;
    }

    if (!this.isEditJobFormValid) {
      this.jobsError = 'Provjerite obavezna polja oglasa.';
      return false;
    }

    const isCategoryValid = JOB_CATEGORIES.includes(this.editJobCategory as JobCategory);
    if (!isCategoryValid) {
      this.jobsError = 'Odabrana kategorija nije podrzana.';
      return false;
    }

    return this.updateJob(this.editJobId, {
      title: this.editJobTitle,
      description: this.editJobDescription,
      location: this.editJobLocation,
      budget: this.editJobBudget ? Number(this.editJobBudget) : undefined,
      category: this.editJobCategory as JobCategory,
      deadline: this.editJobDeadline,
    });
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

  getJobById = (jobId: string) => {
    return this.jobs.find((job) => job.id === jobId);
  };

  canEditJob = (job: IJob) => {
    return job.status === 'OPEN' || job.status === 'CLOSED';
  };

  canCloseJob = (job: IJob) => {
    return job.status === 'OPEN';
  };

  canDeleteJob = (job: IJob) => {
    return job.status === 'OPEN' || job.status === 'CLOSED';
  };

  canCompleteJob = (job: IJob, acceptedContractorId?: string, currentUserId?: string) => {
    return (
      job.status === 'IN_PROGRESS' &&
      Boolean(acceptedContractorId) &&
      Boolean(currentUserId) &&
      acceptedContractorId === currentUserId
    );
  };

  getJobStatusLabel = (status: JobStatus) => {
    switch (status) {
      case 'OPEN':
        return 'Otvoren';
      case 'CLOSED':
        return 'Zatvoren';
      case 'IN_PROGRESS':
        return 'U radu';
      case 'COMPLETED':
        return 'Zavrsen';
      default:
        return status;
    }
  };

  getJobStatusColor = (status: JobStatus): 'default' | 'warning' | 'primary' | 'success' => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'CLOSED':
        return 'warning';
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      default:
        return 'default';
    }
  };

  private mapJobResponseToModel = (jobResponse: IJobResponse): IJob => {
    return {
      ...jobResponse,
      category: jobResponse.category as JobCategory,
      createdAt: new Date(jobResponse.createdAt),
    };
  };

  private upsertJob = (job: IJob) => {
    const existingJobIndex = this.jobs.findIndex((existingJob) => existingJob.id === job.id);

    if (existingJobIndex === -1) {
      this.jobs = [job, ...this.jobs];
      return;
    }

    const nextJobs = [...this.jobs];
    nextJobs[existingJobIndex] = job;
    this.jobs = nextJobs;
  };

  private getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallbackMessage;
  };
}
