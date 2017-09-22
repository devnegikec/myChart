import {
  Component,
  OnInit
} from '@angular/core';
import * as _ from 'lodash';
import faker from 'faker';

@Component({
  selector: 'home',
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public data: any;
  public oldData = [];
  public oldKey = [];
  public config = {
    yAxisLabel: 'test',
    key: []
  }
  // constructor(
  // ) {}

  public ngOnInit() {
    this.updateData();
  }

  public updateData() {
    const keyCount = Math.floor(Math.random() * 3) + 1;
    const count = Math.floor(Math.random() * 6) + 4;
    const result = [];
    const keys = [];
    for(let i=0; i<= keyCount; i++) {
        keys.push(faker.commerce.product());
    }
    for(let j=0; j<= count; j++) {
      let values = [];
      _.forEach(keys, key=> values.push(parseInt(faker.commerce.price())));

      let temp = _.zipObject(keys, values);
          temp['month'] = faker.date.month();
      result.push(temp);
    }
    this.config.key = keys;
    this.data = result;
  }
}

