type Resource = {
    poly: boolean,
    pfmarker: boolean,
    pnmarker: boolean
}

type Object =  {
    marker_augment_resource: boolean
}

type Event = {
    marker_is_detected: boolean,
    resource_is_selected: boolean
}

type Action = {
    augment_resource: boolean,
    rotate_resource: boolean
}

export interface Support {
    framework: string,
    resources: Resource,
    objects: Object,
    events: Event,
    actions: Action
}