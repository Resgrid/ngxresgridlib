export class ProtocolResultData  {
    public ProtocolId: string = '';
    public DepartmentId: number = 0;
    public Name: string = '';
    public Code: string = '';
    public IsDisabled: string = '';
    public Description: string = '';
    public ProtocolText: string = '';
    public CreatedOn: string = '';
    public CreatedByUserId: string = '';
    public UpdatedOn: string = '';
    public MinimumWeight: number = 0;
    public UpdatedByUserId: string = '';
    public State: number = 0;
    public Triggers: ProtocolTriggerResultData[] = [];  
    public Questions: ProtocolTriggerQuestionResultData[] = [];
    public Attachments: ProtocolTriggerAttachmentResultData[] = [];
}

export class ProtocolTriggerResultData  {
    public ProtocolTriggerId: string = '';
    public Type: number = 0;
    public StartsOn: string = '';
    public EndsOn: string = '';
    public Priority: string = '';
    public Geofence: string = '';
}

export class ProtocolTriggerQuestionResultData  {
    public ProtocolTriggerQuestionId: string = '';
    public Question: string = '';
    public Answers: ProtocolQuestionAnswerResultData[] = [];
}

export class ProtocolQuestionAnswerResultData  {
    public ProtocolQuestionAnswerId: string = '';
    public Answer: string = '';
    public Weight: number = 0;
}

export class ProtocolTriggerAttachmentResultData  {
    public ProtocolTriggerAttachmentId: string = '';
    public FileName: string = '';
    public FileType: string = '';
}