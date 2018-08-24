import { Injectable, NgZone } from '@angular/core';
import { Interaction } from '../interfaces/interaction';
import { Resource } from '../interfaces/resource';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  //  Events emitted
  public static WAITING_VIEWER: string = 'waiting_viewer';
  public static PROJECT_OPENED: string = 'project_opened';
  public static PROJECT_CLOSED: string = 'project_closed';
  public static INTERACTIONS_APPROVED: string = 'interactions_approved';
  public static INTERACTIONS_REJECTED: string = 'interactions_rejected';
  public static RESOURCE_CREATED: string = 'resource_created';
  public static RESOURCE_DELETED: string = 'resource_deleted';
  public static RESOURCE_RENAMED: string = 'resource_renamed';

  // Events consumed
  public static VIEWER_READY: string = 'viewer_ready';
  public static FRAMEWORK_READY: string = 'framework_ready';

  constructor(
    private zone: NgZone
  ) {}

  private on(channel: string, listener: Function): void {
  }

  private send(channel: string, ...args): void {
  }

  public onViewerReady(listener: Function) {
    this.on(IpcService.VIEWER_READY, listener);
  }

  public onFrameworkReady(listener: Function) {
    this.on(IpcService.FRAMEWORK_READY, listener);
  }

  public sendWaitingViewer() {
    this.send(IpcService.WAITING_VIEWER, {});
  }

  public sendProjectOpened(framework: string) {
    this.send(IpcService.PROJECT_OPENED, {framework: framework});
  }

  public sendProjectClosed() {
    this.send(IpcService.PROJECT_CLOSED, {});
  }

  public sendInteractionsApproved(interactions: Array<Interaction>) {
    this.send(IpcService.INTERACTIONS_APPROVED, {interactions: interactions});
  }

  public sendInteractionsRejected() {
    this.send(IpcService.INTERACTIONS_REJECTED, {});
  }

  public sendResourceCreated(resource: Resource) {
    this.send(IpcService.RESOURCE_CREATED, {resource: resource});
  }

}
