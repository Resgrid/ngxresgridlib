import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DepartmentVoiceChannelResultData } from "../../models/v4/voice/departmentVoiceResultData";

@Component({
  selector: "app-resgrid-voice-footer",
  templateUrl: "./voice-footer.component.html",
  styleUrls: ["./voice-footer.component.scss"],
})
export class VoiceFooterComponent implements OnInit {
  public selectedChannel: DepartmentVoiceChannelResultData = new DepartmentVoiceChannelResultData();
  public isTransmitting: boolean = false;
  public availableChannels: DepartmentVoiceChannelResultData[] = new Array<DepartmentVoiceChannelResultData>();
  public channel: DepartmentVoiceChannelResultData = new DepartmentVoiceChannelResultData();

  private participants: number = 0;

  constructor(private ref: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    

  }

  ngOnDestroy(): void {
    
  }

  public toggleTransmitting() {
    if (this.isTransmitting) {
      this.stopTransmitting();
    } else {
      this.startTransmitting();
    }
  }

  public startTransmitting(): void {
    
  }

  public stopTransmitting(): void {
    
  }

  public stopTransmittingLeave(): void {
   
  }

  public onChannelChange(channel: DepartmentVoiceChannelResultData) {
    if (channel.Id === '') {
      
    } else {
      
    }
  }
}
