import { observable } from 'mobx';

class TestStore {
  @observable show;

  constructor() {
      this.show = true;
  }

  change() {
      this.show = !this.show;
  }
}

export default new TestStore();
