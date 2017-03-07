import { NgModule,enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { App , providers, routes} from './app';
import { Main ,NotesContainer , About, Auth} from './app/containers';
import { TruncatePipe,UrlImage} from './app/pipes';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { 
		AppBar, 
		NoteCard, 
		NoteCreator, 
		ColorPicker ,
		DialogComponent,
		SearchField
} from './app/ui';
 
import {ResponsiveState, ResponsiveConfig, RESPONSIVE_DIRECTIVES} from 'responsive-directives-angular2';


@NgModule({

	declarations: [
		App ,
		Main,
		AppBar,
		NoteCard,
		NotesContainer,
		NoteCreator,
		ColorPicker,
		SearchField,
		About,
		Auth,
		DialogComponent,
		TruncatePipe,
		UrlImage
 
	],

	providers,
	
	imports: [
				BrowserModule,
				FormsModule,
				HttpModule,
				routes,
				InfiniteScrollModule
			],
	bootstrap:[App]
	
})

export class AppModule{};
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule, [
       ResponsiveState
       ]);
