import { Support } from "../../../interfaces/support";

let VuforiaSupport: Support;

VuforiaSupport = {
  framework: "vuforia",
  resources: {
    poly: true,
    pfmarker: false,
    pnmarker: true
  },
  events: {
    marker_is_detected: true,
    resource_is_selected: true
  },
  actions: {
    augment_resource: true,
    rotate_resource: true
  }
}

export default VuforiaSupport;