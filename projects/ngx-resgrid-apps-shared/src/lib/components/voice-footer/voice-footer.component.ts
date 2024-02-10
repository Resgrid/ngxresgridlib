import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DepartmentVoiceChannelResultData } from "../../models/v4/voice/departmentVoiceResultData";
import { LiveKitService } from "../../services/livekit.service";
import { IRGPluginOptionRoom } from "../../models/plugin/rgPluginOptions";
import { AuthService } from "../../services/v4/auth.service";
import { Subscription } from "rxjs";
import { SvgIconRegistryService } from "angular-svg-icon";

@Component({
  selector: "app-resgrid-voice-footer",
  templateUrl: "./voice-footer.component.html",
  styleUrls: ["./voice-footer.component.scss"]
})
export class VoiceFooterComponent implements OnInit {
  public isTransmitting: boolean = false;
  public isVisible: boolean = false;
  private isInitialized: boolean = false;
  private isLoggedInSubscription$: Subscription | undefined = undefined;
  public selectedRoom: IRGPluginOptionRoom | null = null;
  public rooms: IRGPluginOptionRoom[] = [];
  private defaultRoom: IRGPluginOptionRoom = { id: '', name: 'Select a Channel', token: ''};

  constructor(private ref: ChangeDetectorRef, public livekitService: LiveKitService, 
    private authService: AuthService, private svgRegistry: SvgIconRegistryService) {
      this.rooms.push(this.defaultRoom);
      this.selectedRoom = this.defaultRoom;
  }

  ngOnInit(): void {
    this.initSvgs();
    this.livekitService.handleDevicesChanged();

    this.isLoggedInSubscription$ = this.authService.loggedIn$?.subscribe((isLoggedIn) => {
      this.rooms = [];
      this.rooms.push(this.defaultRoom);

      if (isLoggedIn && !this.isInitialized) {
        this.isInitialized = true;
        
        this.livekitService.init().subscribe((data) => {
          if (data) {
            if (data.canConnectToVoiceApiToken) {
              this.rooms = this.rooms.concat(data.rooms);

              this.livekitService.canConnectToVoice().subscribe((canConnectResult) => {
                if (canConnectResult && canConnectResult.Data) {
                  this.isVisible = canConnectResult.Data.CanConnect;
                } else {
                  this.isVisible = false;
                }
              });
            }
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    
  }

  public async toggleTransmitting() {
    if (this.isTransmitting) {
      await this.stopTransmitting();
    } else {
      await this.startTransmitting();
    }
  }

  public async startTransmitting() {
    this.isTransmitting = await this.livekitService.toggleAudio(false);
  }

  public async stopTransmitting() {
    this.isTransmitting = await this.livekitService.toggleAudio(true);
  }

  public stopTransmittingLeave(): void {
   
  }

  public async onChannelChange(room: IRGPluginOptionRoom) {
    if (room.id === '') {
     
    } else {
      await this.livekitService.connect(room);
    }
  }

  private initSvgs() {
    // From: https://www.svgrepo.com/
    this.svgRegistry.addSvg("micOn", '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#37e22e"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M15 6H13M15 10H13M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="#28d924" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>');
    this.svgRegistry.addSvg("micOff", '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M15 6H13M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" stroke="#d51c29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>'); 
  }
}
