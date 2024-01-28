import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConversationPipe } from './directives/conversation.directive';
import { GroupByPipe } from './directives/groupBy.directive';
import { OrderByPipe } from './directives/orderBy.directive';
import { RGTimeAgoPipe } from './directives/rgTimeAgo.directive';
import { RGTimeAgoUTCPipe } from './directives/rgTimeAgoUtc.directive';
import { TruncatePipe } from './directives/truncate.directive';
import { ResgridASConfiguration, ResgridConfig } from './resgrid-config';
import { HttpInterceptorModule } from './interceptors/http.interceptor.module';
import { WebCacheProvider } from './providers/webcache.provider';
import { VoiceFooterComponent } from './components/voice-footer/voice-footer.component';
import { FormsModule } from '@angular/forms';

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
    VoiceFooterComponent
  ];
}

@NgModule({
  declarations: directives(),
  imports: [HttpInterceptorModule, FormsModule],
  exports: directives(),
})
export class NgxResgridLibModule {
  static forRoot(
    configuration: ResgridASConfiguration
  ): ModuleWithProviders<NgxResgridLibModule> {

    //if (configuration && !configuration.cacheProvider) {
    //  configuration.cacheProvider = new WebCacheProvider();
    //}

    return <ModuleWithProviders<NgxResgridLibModule>>{
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
            config.realtimeGeolocationHubName = configuration.realtimeGeolocationHubName;
            config.logLevel = configuration.logLevel;
            config.isMobileApp = configuration.isMobileApp;

            return config;
          },
        },
        { 
          provide: 'RG_CACHE_PROVIDER', 
          useValue: configuration.cacheProvider 
        },
      ],
    };
  }
}
