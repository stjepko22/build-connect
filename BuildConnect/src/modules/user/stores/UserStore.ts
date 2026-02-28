import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/core/stores/RootStore';

export interface UserProfile {
  id: string;
  displayName: string;
  role: 'INVESTITOR' | 'IZVODJAC';
  email: string;
  bio: string;
  location: string;
  joinedAt: Date;
  skills?: string[];
}

export default class UserStore {
  rootStore: RootStore;
  
  // Mock baza korisnika
  users: UserProfile[] = [
    {
      id: 'investitor-1',
      displayName: 'Marko Marković',
      role: 'INVESTITOR',
      email: 'marko@test.com',
      bio: 'Tražim pouzdane izvođače za projekte renovacije stanova u Zagrebu.',
      location: 'Zagreb',
      joinedAt: new Date('2025-01-10')
    },
    {
      id: 'investitor-2',
      displayName: 'Ana Anić',
      role: 'INVESTITOR',
      email: 'ana@test.com',
      bio: 'Investitor s fokusom na moderne niskoenergetske kuće.',
      location: 'Split',
      joinedAt: new Date('2025-02-15')
    },
    {
      id: 'izvodjac-1',
      displayName: 'Ivan Ivić - Gradnja d.o.o.',
      role: 'IZVODJAC',
      email: 'ivan@gradnja.hr',
      bio: 'Specijalizirani za fasaderske radove i suhu gradnju. 15 godina iskustva.',
      location: 'Zagreb',
      joinedAt: new Date('2024-11-20'),
      skills: ['Fasada', 'Gips', 'Soboslikarstvo']
    }
  ];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  getUserById(id: string) {
    return this.users.find(u => u.id === id);
  }
}
