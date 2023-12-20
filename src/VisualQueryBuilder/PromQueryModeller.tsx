
import { QueryModellerBase } from './LokiAndPromQueryModellerBase';

// We actually don't need PromQueryModeller cause we are using only renderLabels in LabelParamEditor, which is implemented in LokiAndPromQueryModellerBase
export class PromQueryModeller extends QueryModellerBase {
  constructor() {
    super(() => {
      return [];
    });
  }
}

export const promQueryModeller = new PromQueryModeller();
