
import RootStoreContext from '@/context/RootStoreContext';
import {useContext} from 'react';

export const useRootStore = () => {
    return useContext(RootStoreContext);
}