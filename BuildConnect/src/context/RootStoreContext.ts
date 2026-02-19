import { RootStore } from '@/stores/RootStore';
import { createContext } from 'react';

const RootStoreContext = createContext<RootStore>(new RootStore());

export default RootStoreContext;