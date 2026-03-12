import { makeAutoObservable } from 'mobx';
import RootStore from '@/core/stores/RootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { IUserProfile } from '@/modules/user/models/IUserProfile';
import { LegalType } from '@/modules/user/models/LegalType';

type ContractorLegalTypeFilter = 'ALL' | LegalType;

export default class UserStore {
  rootStore: RootStore;

  users: IUserProfile[] = [
    {
      id: 'investitor-1',
      displayName: 'Marko Markovic',
      role: 'INVESTITOR',
      legalType: 'FIRMA',
      email: 'marko@test.com',
      bio: 'Trazim pouzdane izvodace za projekte renovacije stanova u Zagrebu.',
      location: 'Zagreb',
      joinedAt: new Date('2025-01-10'),
    },
    {
      id: 'investitor-2',
      displayName: 'Ana Anic',
      role: 'INVESTITOR',
      legalType: 'FIRMA',
      email: 'ana@test.com',
      bio: 'Investitor s fokusom na moderne niskoenergetske kuce.',
      location: 'Split',
      joinedAt: new Date('2025-02-15'),
    },
    {
      id: 'izvodjac-1',
      displayName: 'Ivan Ivic - Gradnja d.o.o.',
      role: 'IZVODJAC',
      legalType: 'FIRMA',
      email: 'ivan@gradnja.hr',
      bio: 'Specijalizirani za fasaderske radove i suhu gradnju. 15 godina iskustva.',
      location: 'Zagreb',
      joinedAt: new Date('2024-11-20'),
      serviceCategories: ['Fasade', 'Gradnja', 'Renovacija'],
    },
    {
      id: 'izvodjac-2',
      displayName: 'Petar Horvat',
      role: 'IZVODJAC',
      legalType: 'FIZICKA_OSOBA',
      email: 'petar@majstor.hr',
      bio: 'Samostalni keramicar s fokusom na kupaonice i kuhinje.',
      location: 'Split',
      joinedAt: new Date('2024-10-12'),
      serviceCategories: ['Keramika', 'Renovacija'],
    },
    {
      id: 'izvodjac-3',
      displayName: 'Elektro Napon d.o.o.',
      role: 'IZVODJAC',
      legalType: 'FIRMA',
      email: 'info@napon.hr',
      bio: 'Elektro tim za stambene i poslovne objekte.',
      location: 'Zadar',
      joinedAt: new Date('2024-09-03'),
      serviceCategories: ['Elektro'],
    },
    {
      id: 'izvodjac-4',
      displayName: 'Krov Plus Obrt',
      role: 'IZVODJAC',
      legalType: 'FIRMA',
      email: 'kontakt@krovplus.hr',
      bio: 'Krovopokrivacki i limarski radovi na novogradnji i adaptacijama.',
      location: 'Rijeka',
      joinedAt: new Date('2024-08-19'),
      serviceCategories: ['Krovovi', 'Stolarija'],
    },
    {
      id: 'izvodjac-5',
      displayName: 'Nikola Vukovic',
      role: 'IZVODJAC',
      legalType: 'FIZICKA_OSOBA',
      email: 'nikola@vodomajstor.hr',
      bio: 'Vodoinstalater i monter sustava grijanja.',
      location: 'Osijek',
      joinedAt: new Date('2024-07-01'),
      serviceCategories: ['Vodoinstalacije', 'Grijanje'],
    },
  ];

  contractorSearchQuery = '';
  selectedContractorCategories: JobCategory[] = [];
  selectedContractorLocation = '';
  selectedContractorLegalType: ContractorLegalTypeFilter = 'ALL';
  minContractorRating = 0;
  defaultContractorCategoriesByRole: Record<'INVESTITOR' | 'IZVODJAC', JobCategory[]> = {
    INVESTITOR: ['Fasade'],
    IZVODJAC: [],
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setContractorSearchQuery = (value: string) => { this.contractorSearchQuery = value; };
  setSelectedContractorCategories = (value: JobCategory[]) => { this.selectedContractorCategories = value; };
  setSelectedContractorLocation = (value: string) => { this.selectedContractorLocation = value; };
  setSelectedContractorLegalType = (value: ContractorLegalTypeFilter) => { this.selectedContractorLegalType = value; };
  setMinContractorRating = (value: number) => { this.minContractorRating = value; };

  toggleSelectedContractorCategory = (category: JobCategory) => {
    if (this.selectedContractorCategories.includes(category)) {
      this.selectedContractorCategories = this.selectedContractorCategories.filter((item) => item !== category);
      return;
    }

    this.selectedContractorCategories = [...this.selectedContractorCategories, category];
  };

  resetContractorFilters = () => {
    this.contractorSearchQuery = '';
    this.selectedContractorCategories = [];
    this.selectedContractorLocation = '';
    this.selectedContractorLegalType = 'ALL';
    this.minContractorRating = 0;
  };

  initializeContractorFiltersForCurrentUser = () => {
    const role = this.rootStore.authenticationStore.user?.role;
    if (!role) {
      this.resetContractorFilters();
      return;
    }

    this.selectedContractorCategories = [...this.defaultContractorCategoriesByRole[role]];
  };

  saveCurrentContractorFiltersAsDefault = () => {
    const role = this.rootStore.authenticationStore.user?.role;
    if (!role) {
      return;
    }

    this.defaultContractorCategoriesByRole = {
      ...this.defaultContractorCategoriesByRole,
      [role]: [...this.selectedContractorCategories],
    };
  };

  get contractorLocations() {
    return Array.from(new Set(this.contractorProfiles.map((contractor) => contractor.location))).sort();
  }

  getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  get contractorProfiles() {
    return this.users.filter((user) => user.role === 'IZVODJAC');
  }

  getContractorAverageRating = (contractorId: string) => {
    const reviews = this.rootStore.reviewStore.reviews.filter((review) => review.revieweeId === contractorId);
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

  getContractorReviewCount = (contractorId: string) => {
    return this.rootStore.reviewStore.reviews.filter((review) => review.revieweeId === contractorId).length;
  };

  get filteredContractors() {
    const query = this.contractorSearchQuery.trim().toLowerCase();

    return this.contractorProfiles
      .filter((contractor) => {
        if (query) {
          const haystack = [contractor.displayName, contractor.bio, contractor.location, ...(contractor.serviceCategories || [])]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(query)) {
            return false;
          }
        }

        if (this.selectedContractorCategories.length > 0) {
          const serviceCategories = contractor.serviceCategories || [];
          const hasAnyCategory = this.selectedContractorCategories.some((category) => serviceCategories.includes(category));
          if (!hasAnyCategory) {
            return false;
          }
        }

        if (this.selectedContractorLocation && contractor.location !== this.selectedContractorLocation) {
          return false;
        }

        if (this.selectedContractorLegalType !== 'ALL' && contractor.legalType !== this.selectedContractorLegalType) {
          return false;
        }

        const avgRating = this.getContractorAverageRating(contractor.id);
        if (avgRating < this.minContractorRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => this.getContractorAverageRating(b.id) - this.getContractorAverageRating(a.id));
  }

  get availableServiceCategories() {
    return JOB_CATEGORIES;
  }
}
