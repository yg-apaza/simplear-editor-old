import { Support } from "../../../interfaces/support";

let ArtoolkitSupport: Support;

ArtoolkitSupport = {
  framework: "artoolkit",
  resources: {
    poly: true,
    pfmarker: true,
    pnmarker: false
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

export default ArtoolkitSupport;