import { Support } from "../../../interfaces/support";

let VuforiaSupport: Support;

VuforiaSupport = {
  framework: "vuforia",
  resources: {
    poly: true,
    pfmarker: false,
    pnmarker: true
  },
  objects: {
    marker_augment_resource: true
  },
  events: {
    marker_is_detected: false,
    resource_is_selected: false
  },
  actions: {
    augment_resource: false,
    rotate_resource: false
  }
}

export default VuforiaSupport;