import { observable, action } from 'mobx';

class TestStore {
  @observable show;

  constructor() {
    this.show = true;
    this.change = this.change.bind(this)
  }

  change() {
    this.show = !this.show;
  }
}

export default new TestStore();
