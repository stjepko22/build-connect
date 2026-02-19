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
  // Dodajemo inicijalne podatke direktno u niz
  jobs: Job[] = [
    {
      id: 'posao-1',
      title: 'Izrada fasade na obiteljskoj kući',
      description: 'Potrebna izrada termo fasade (stiropor 10cm) na objektu od 200m2. Materijal osiguran, traže se samo ruke.',
      category: 'Fasada',
      location: 'Zagreb',
      budget: '3500',
      deadline: '2026-05-01',
      investitorId: 'investitor-1',
      createdAt: new Date()
    },
    {
      id: 'posao-2',
      title: 'Postavljanje keramike u kupaonici',
      description: 'Potrebno postaviti 40m2 pločica u novogradnji. Podloga je spremna, ljepilo i pločice su na lokaciji.',
      category: 'Keramika',
      location: 'Split',
      budget: '800',
      deadline: '2026-03-15',
      investitorId: 'investitor-2',
      createdAt: new Date()
    }
  ];
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