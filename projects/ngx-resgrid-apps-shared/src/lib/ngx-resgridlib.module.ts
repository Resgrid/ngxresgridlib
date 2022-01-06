import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConversationPipe } from './directives/conversation.directive';
import { GroupByPipe } from './directives/groupBy.directive';
import { OrderByPipe } from './directives/orderBy.directive';
import { RGTimeAgoPipe } from './directives/rgTimeAgo.directive';
import { RGTimeAgoUTCPipe } from './directives/rgTimeAgoUtc.directive';
import { TruncatePipe } from './directives/truncate.directive';
import { ResgridASConfiguration, ResgridConfig } from './resgrid-config';
import { HttpInterceptorModule } from './interceptors/http.interceptor.module';

/**
 * @internal
 */
 export function directives() {
  return [
    OrderByPipe, 
    GroupByPipe, 
    TruncatePipe, 
    RGTimeAgoPipe, 
    RGTimeAgoUTCPipe, 
    ConversationPipe,
  ];
}

@NgModule({
  declarations: directives(), 
  imports: [
    HttpInterceptorModule
  ],
  exports: directives()})
export class NgxResgridLibModule {
    static forRoot(configuration: ResgridASConfiguration) : ModuleWithProviders<NgxResgridLibModule> {
    return <ModuleWithProviders<NgxResgridLibModule>>({
      ngModule: NgxResgridLibModule,
      providers: [
        { 
          provide: ResgridConfig,
          useFactory: () => {
            let config = new ResgridConfig();
            config.baseApiUrl = configuration.baseApiUrl;
            config.apiVersion = configuration.apiVersion;
            config.clientId = configuration.clientId;
            config.googleApiKey = configuration.googleApiKey;
            config.channelUrl = configuration.channelUrl;
            config.channelHubName = configuration.channelHubName;
            config.logLevel = configuration.logLevel;

            return (config);
          }
        }
      ]
    });
  }
 }
