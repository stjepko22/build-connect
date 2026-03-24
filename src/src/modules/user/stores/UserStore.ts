import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { IUserProfileResponse } from '@/api/models/users/IUserProfileResponse';
import RootStore from '@/core/stores/RootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { IUserProfile } from '@/modules/user/models/IUserProfile';
import { LegalType } from '@/modules/user/models/LegalType';
import UserService from '@/modules/user/services/UserService';

type ContractorLegalTypeFilter = 'ALL' | LegalType;

export default class UserStore {
  rootStore: RootStore;
  userService: UserService;
  users: IUserProfile[] = [];
  isLoadingUsers = false;
  userListError: string | null = null;
  selectedUserError: string | null = null;
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
    this.userService = new UserService();
    makeAutoObservable(this);
  }

  loadUsers = async (role?: 'INVESTITOR' | 'IZVODJAC') => {
    this.isLoadingUsers = true;
    this.userListError = null;

    try {
      const response = await this.userService.getUsersAsync({ role });

      runInAction(() => {
        this.replaceUsers(response.data.map(this.mapUserResponseToModel), role);
      });
    } catch (error) {
      console.error('Load users failed:', error);
      runInAction(() => {
        this.userListError = this.getApiErrorMessage(error, 'Dohvat korisnika nije uspio.');
      });
    } finally {
      runInAction(() => {
        this.isLoadingUsers = false;
      });
    }
  };

  loadContractors = async () => {
    this.isLoadingUsers = true;
    this.userListError = null;

    try {
      const response = await this.userService.getContractorsAsync();

      runInAction(() => {
        this.replaceUsers(response.data.map(this.mapUserResponseToModel), 'IZVODJAC');
      });
    } catch (error) {
      console.error('Load contractors failed:', error);
      runInAction(() => {
        this.userListError = this.getApiErrorMessage(error, 'Dohvat izvodaca nije uspio.');
      });
    } finally {
      runInAction(() => {
        this.isLoadingUsers = false;
      });
    }
  };

  loadUserById = async (id: string) => {
    if (!id.trim()) {
      return null;
    }

    this.isLoadingUsers = true;
    this.selectedUserError = null;

    try {
      const response = await this.userService.getUserAsync(id);
      const user = this.mapUserResponseToModel(response.data);

      runInAction(() => {
        this.upsertUser(user);
      });

      return user;
    } catch (error) {
      console.error('Load user failed:', error);
      runInAction(() => {
        this.selectedUserError = this.getApiErrorMessage(error, 'Dohvat korisnika nije uspio.');
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoadingUsers = false;
      });
    }
  };

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
    return this.users.find((user) => user.id === id);
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

  private mapUserResponseToModel = (userResponse: IUserProfileResponse): IUserProfile => {
    return {
      ...userResponse,
      serviceCategories: userResponse.serviceCategories as JobCategory[] | undefined,
      joinedAt: new Date(userResponse.joinedAt),
    };
  };

  private replaceUsers = (users: IUserProfile[], role?: 'INVESTITOR' | 'IZVODJAC') => {
    if (!role) {
      this.users = users;
      return;
    }

    const filteredExistingUsers = this.users.filter((user) => user.role !== role);
    this.users = [...filteredExistingUsers, ...users];
  };

  private upsertUser = (user: IUserProfile) => {
    const existingUserIndex = this.users.findIndex((existingUser) => existingUser.id === user.id);

    if (existingUserIndex === -1) {
      this.users = [user, ...this.users];
      return;
    }

    const nextUsers = [...this.users];
    nextUsers[existingUserIndex] = user;
    this.users = nextUsers;
  };

  private getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallbackMessage;
  };
}
