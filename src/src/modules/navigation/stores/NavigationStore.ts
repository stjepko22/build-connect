import { makeAutoObservable } from 'mobx';
import RootStore from '@/core/stores/RootStore';

export default class NavigationStore {
  rootStore: RootStore;
  isMobileSidebarOpen = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setMobileSidebarOpen = (value: boolean) => {
    this.isMobileSidebarOpen = value;
  };

  toggleMobileSidebar = () => {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  };
}
