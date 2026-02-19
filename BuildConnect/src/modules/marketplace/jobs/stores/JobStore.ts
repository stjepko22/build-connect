import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/stores/RootStore';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  deadline: string;
  investitorId: string;
  createdAt: Date;
}

export class JobStore {
  rootStore: RootStore;
  jobs: Job[] = [];
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  addJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'investitorId'>) => {
    this.isLoading = true;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newJob: Job = {
          ...jobData,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date(),
          investitorId: this.rootStore.authenticationStore.user?.id || 'unknown'
        };
        this.jobs.push(newJob);
        this.isLoading = false;
        resolve();
      }, 1000);
    });
  };

  get allJobs() {
    return this.jobs;
  }
}