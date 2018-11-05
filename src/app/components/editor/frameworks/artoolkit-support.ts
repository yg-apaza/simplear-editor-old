import { Support } from "../../../interfaces/support";

let ArtoolkitSupport: Support;

ArtoolkitSupport = {
  framework: "artoolkit",
  resources: {
    poly: true,
    pfmarker: true,
    pnmarker: false
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

export default ArtoolkitSupport;