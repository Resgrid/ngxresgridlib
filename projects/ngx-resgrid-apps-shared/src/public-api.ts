/*
 * Public API Surface of ngx-resgrid-apps-shared
 */

export * from './lib/ngx-resgridlib.module';
export * from './lib/consts';
export * from './lib/resgrid-config';
export * from './lib/directives/conversation.directive';
export * from './lib/directives/groupBy.directive';
export * from './lib/directives/orderBy.directive';
export * from './lib/directives/rgTimeAgo.directive';
export * from './lib/directives/rgTimeAgoUtc.directive';
export * from './lib/directives/truncate.directive';
export * from './lib/providers/webcache.provider';
export * from './lib/services/v4/auth.service';
export * from './lib/services/v4/autofills.service';
export * from './lib/services/v4/calendar.service';
export * from './lib/services/v4/callFiles.service';
export * from './lib/services/v4/callNotes.service';
export * from './lib/services/v4/callPriorities.service';
export * from './lib/services/v4/callProtocols.service';
export * from './lib/services/v4/callTypes.service';
export * from './lib/services/v4/calls.service';
export * from './lib/services/v4/customStatuses.service';
export * from './lib/services/v4/config.service';
export * from './lib/services/v4/device.service';
export * from './lib/services/v4/dispatch.service';
export * from './lib/services/v4/forms.service';
export * from './lib/services/v4/groups.service';
export * from './lib/services/v4/health.service';
export * from './lib/services/v4/mapping.service';
export * from './lib/services/v4/messages.service';
export * from './lib/services/v4/notes.service';
export * from './lib/services/v4/personnel.service';
export * from './lib/services/v4/roles.service';
export * from './lib/services/v4/personnelStaffing.service';
export * from './lib/services/v4/personnelLocation.service';
export * from './lib/services/v4/personnelStatuses.service';
export * from './lib/services/v4/security.service';
export * from './lib/services/v4/shifts.service';
export * from './lib/services/v4/statuses.service';
export * from './lib/services/v4/templates.service';
export * from './lib/services/v4/unitLocation.service';
export * from './lib/services/v4/unitRoles.service';
export * from './lib/services/v4/unitStatus.service';
export * from './lib/services/v4/units.service';
export * from './lib/services/v4/voice.service';
export * from './lib/services/cache.service';
export * from './lib/services/custom-states.service';
export * from './lib/services/document.service';
export * from './lib/services/events.service';
export * from './lib/services/kazoo-voice.service';
export * from './lib/services/location.service';
export * from './lib/services/logger.service';
export * from './lib/services/signalr.service';
export * from './lib/services/realtime-geolocation.service';
export * from './lib/services/storage.service';
export * from './lib/services/types.service';
export * from './lib/services/uriEncoder.service';
export * from './lib/services/utils.service';
export * from './lib/services/window.service';
export * from './lib/models/v4/baseV4Request';
export * from './lib/models/gpsLocation';
export * from './lib/models/cacheable';
export * from './lib/models/cacheProvider';
export * from './lib/models/v4/auth/authState';
export * from './lib/models/v4/auth/authTokens';
export * from './lib/models/v4/auth/login';
export * from './lib/models/v4/auth/profile';
export * from './lib/models/v4/autofills/autofillsResult';
export * from './lib/models/v4/autofills/autofillsResultData';
export * from './lib/models/v4/calendar/calendarItemResult';
export * from './lib/models/v4/calendar/calendarItemResultData';
export * from './lib/models/v4/calendar/calendarItemsResult';
export * from './lib/models/v4/calendar/calendarItemTypeResultData';
export * from './lib/models/v4/calendar/calendarItemTypesResult';
export * from './lib/models/v4/calendar/setCalendarAttendingResult';
export * from './lib/models/v4/callFiles/callFileResultData';
export * from './lib/models/v4/callFiles/callFilesResult';
export * from './lib/models/v4/callFiles/saveCallFileResult';
export * from './lib/models/v4/callNotes/callNoteResultData';
export * from './lib/models/v4/callNotes/callNotesResult';
export * from './lib/models/v4/callNotes/saveCallNoteResult';
export * from './lib/models/v4/callPriorities/callPrioritiesResult';
export * from './lib/models/v4/callPriorities/callPriorityResultData';
export * from './lib/models/v4/callProtocols/callProtocolsResult';
export * from './lib/models/v4/callProtocols/callProtocolsResultData';
export * from './lib/models/v4/calls/activeCallsResult';
export * from './lib/models/v4/calls/callExtraDataResult';
export * from './lib/models/v4/calls/callExtraDataResultData';
export * from './lib/models/v4/calls/callResult';
export * from './lib/models/v4/calls/callResultData';
export * from './lib/models/v4/calls/closeCallResult';
export * from './lib/models/v4/calls/deleteCallResult';
export * from './lib/models/v4/calls/dispatchedEventResultData';
export * from './lib/models/v4/calls/saveCallResult';
export * from './lib/models/v4/calls/scheduledCallsResult';
export * from './lib/models/v4/calls/updateCallResult';
export * from './lib/models/v4/calls/updateDispatchTimeResult';
export * from './lib/models/v4/callTypes/callTypeResultData';
export * from './lib/models/v4/callTypes/callTypesResult';
export * from './lib/models/v4/configs/getConfigResult';
export * from './lib/models/v4/configs/getConfigResultData';
export * from './lib/models/v4/customStatuses/customStatusResultData';
export * from './lib/models/v4/customStatuses/customStatusesResult';
export * from './lib/models/v4/dispatch/getCallTemplatesResult';
export * from './lib/models/v4/dispatch/getCallTemplatesResultData';
export * from './lib/models/v4/dispatch/getPersonnelForCallGridResult';
export * from './lib/models/v4/dispatch/getPersonnelForCallGridResultData';
export * from './lib/models/v4/dispatch/getRolesForCallGridResult';
export * from './lib/models/v4/dispatch/getRolesForCallGridResultData';
export * from './lib/models/v4/dispatch/getSetUnitStateResult';
export * from './lib/models/v4/dispatch/getSetUnitStateResultData';
export * from './lib/models/v4/dispatch/newCallFormResult';
export * from './lib/models/v4/dispatch/newCallFormResultData';
export * from './lib/models/v4/dispatch/getGroupsForCallGridResult';
export * from './lib/models/v4/dispatch/getGroupsForCallGridResultData';
export * from './lib/models/v4/forms/formDataAutomationResult';
export * from './lib/models/v4/forms/formResult';
export * from './lib/models/v4/forms/formResultData';
export * from './lib/models/v4/groups/groupResult';
export * from './lib/models/v4/groups/groupsResult';
export * from './lib/models/v4/groups/groupsResultData';
export * from './lib/models/v4/health/healthResult';
export * from './lib/models/v4/health/healthResultData';
export * from './lib/models/v4/mapping/getMapDataAndMarkersData';
export * from './lib/models/v4/mapping/getMapDataAndMarkersResult';
export * from './lib/models/v4/mapping/getMapLayersResult';
export * from './lib/models/v4/mapping/getMapLayersResultData';
export * from './lib/models/v4/messages/deleteMessageResult';
export * from './lib/models/v4/messages/messageRecipientInput';
export * from './lib/models/v4/messages/messageResult';
export * from './lib/models/v4/messages/messageResultData';
export * from './lib/models/v4/messages/messagesResult';
export * from './lib/models/v4/messages/respondToMessageResult';
export * from './lib/models/v4/messages/sendMessageResult';
export * from './lib/models/v4/messages/getRecipientsResult';
export * from './lib/models/v4/messages/recipientsResultData';
export * from './lib/models/v4/notes/notesResult';
export * from './lib/models/v4/notes/noteResultData';
export * from './lib/models/v4/personnel/filterResultData';
export * from './lib/models/v4/personnel/getPersonnelFilterOptionsResult';
export * from './lib/models/v4/personnel/getAllPersonnelInfosResult';
export * from './lib/models/v4/personnel/personnelInfoResult';
export * from './lib/models/v4/personnel/personnelInfoResultData';
export * from './lib/models/v4/personnelLocation/personnelLocationResult';
export * from './lib/models/v4/personnelLocation/personnelLocationResultData';
export * from './lib/models/v4/personnelLocation/savePersonnelLocationInput';
export * from './lib/models/v4/personnelLocation/savePersonnelLocationResult';
export * from './lib/models/v4/personnelStatuses/getCurrentStatusResult';
export * from './lib/models/v4/personnelStatuses/getCurrentStatusResultData';
export * from './lib/models/v4/personnelStatuses/savePersonsStatusesInput';
export * from './lib/models/v4/personnelStatuses/savePersonsStatusesResult';
export * from './lib/models/v4/personnelStatuses/savePersonStatusInput';
export * from './lib/models/v4/personnelStatuses/savePersonStatusResult';
export * from './lib/models/v4/personnelStaffing/getCurrentStaffingResult';
export * from './lib/models/v4/personnelStaffing/getCurrentStaffingResultData';
export * from './lib/models/v4/personnelStaffing/savePersonsStaffingsInput';
export * from './lib/models/v4/personnelStaffing/savePersonsStaffingsResult';
export * from './lib/models/v4/personnelStaffing/savePersonStaffingInput';
export * from './lib/models/v4/personnelStaffing/savePersonStaffingResult';
export * from './lib/models/v4/roles/roleResultData';
export * from './lib/models/v4/roles/rolesResult';
export * from './lib/models/v4/security/departmentRightsResult';
export * from './lib/models/v4/security/departmentRightsResultData';
export * from './lib/models/v4/shifts/shiftDayResult';
export * from './lib/models/v4/shifts/shiftDayResultData';
export * from './lib/models/v4/shifts/shiftDaysResult';
export * from './lib/models/v4/shifts/shiftResult';
export * from './lib/models/v4/shifts/shiftResultData';
export * from './lib/models/v4/shifts/shiftsResult';
export * from './lib/models/v4/shifts/signupShiftDayResult';
export * from './lib/models/v4/statuses/statusesResult';
export * from './lib/models/v4/statuses/statusesResultData';
export * from './lib/models/v4/statuses/unitTypeStatusesResult';
export * from './lib/models/v4/statuses/unitTypeStatusResultData';
export * from './lib/models/v4/templates/callNoteTemplateResultData';
export * from './lib/models/v4/templates/callNoteTemplatesResult';
export * from './lib/models/v4/unitLocation/saveUnitLocationInput';
export * from './lib/models/v4/unitLocation/saveUnitLocationResult';
export * from './lib/models/v4/unitLocation/unitLocationResult';
export * from './lib/models/v4/unitLocation/unitLocationResultData';
export * from './lib/models/v4/unitRoles/unitRoleResultData';
export * from './lib/models/v4/unitRoles/unitRolesForUnitResult';
export * from './lib/models/v4/unitRoles/activeUnitRoleResultData';
export * from './lib/models/v4/unitRoles/activeUnitRolesResult';
export * from './lib/models/v4/unitRoles/setRoleAssignmentsForUnitResult';
export * from './lib/models/v4/unitRoles/setUnitRolesInput';
export * from './lib/models/v4/units/getUnitFilterOptionsResult';
export * from './lib/models/v4/units/unitInfoResult';
export * from './lib/models/v4/units/unitInfoResultData';
export * from './lib/models/v4/units/unitRoleData';
export * from './lib/models/v4/units/unitResultData';
export * from './lib/models/v4/units/unitsResult';
export * from './lib/models/v4/unitStatus/saveUnitStatusInput';
export * from './lib/models/v4/unitStatus/saveUnitStatusResult';
export * from './lib/models/v4/unitStatus/unitStatusResultData';
export * from './lib/models/v4/unitStatus/unitStatusesResult';
export * from './lib/models/v4/voice/departmentVoiceResult';
export * from './lib/models/v4/voice/departmentVoiceResultData';
export * from './lib/models/v4/voice/voiceSessionConnectionResult';
export * from './lib/models/v4/voice/voiceSessionConnectionResultData';
export * from './lib/models/v4/device/pushRegistrationResult';
export * from './lib/models/geo/Bounds';
export * from './lib/models/geo/Coordinate';
export * from './lib/models/geo/Ellipsoid';
export * from './lib/models/geo/GeometryInterface';
export * from './lib/models/geo/Line';
export * from './lib/models/geo/Polygon';
export * from './lib/models/geo/Polyline';
export * from './lib/models/geo/Distance/DistanceInterface';
export * from './lib/models/geo/Distance/Haversine';
export * from './lib/models/geo/Distance/Vincenty';