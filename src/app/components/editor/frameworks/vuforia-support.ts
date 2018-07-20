import { Support } from "../../../interfaces/support";

let VuforiaSupport: Support;

VuforiaSupport = {
  framework: "vuforia",
  resources: {
    poly: true,
    marker: true
  },
  events: {
    marker_is_detected: true
  },
  actions: {
    augment_resource: true
  }
}

export default VuforiaSupport;