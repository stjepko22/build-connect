import AuthenticationStore from '@/modules/authentication/stores/AuthenticationStore';
import RegistrationStore from '@/modules/authentication/stores/RegistrationStore';
import BidStore from '@/modules/marketplace/bids/stores/BidStore';
import JobStore from '@/modules/marketplace/jobs/stores/JobStore';
import ReviewStore  from '@/modules/marketplace/reviews/stores/ReviewStore';

export class RootStore {
    constructor() {
        this.authenticationStore = new AuthenticationStore(this);
        this.jobStore = new JobStore(this);
        this.bidStore = new BidStore(this);
        this.reviewStore = new ReviewStore(this);
        this.registrationStore = new RegistrationStore(this);
  }
  
  authenticationStore: AuthenticationStore;
  jobStore: JobStore;
  bidStore: BidStore;
  reviewStore: ReviewStore;
  registrationStore: RegistrationStore
}
