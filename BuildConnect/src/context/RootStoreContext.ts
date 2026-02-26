import { createContext } from 'react';
import { RootStore } from '@/stores/RootStore';

const RootStoreContext = createContext<RootStore | null>(null);

export default RootStoreContext;
