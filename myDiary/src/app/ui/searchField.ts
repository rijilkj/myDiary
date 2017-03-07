import { 
	Component,
	Output,
	Input,
    EventEmitter,
    OnChanges, 
    trigger, 
    state, 
    style, 
    animate, 
    transition
 } from '@angular/core';


@Component ({

  	selector : 'search-field',
  	templateUrl: 'app/ui/search/template.html',
  	styleUrls: ['app/ui/search/styles.css'],
   	animations: [
    	trigger('search', [
     	transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
	
})


export class SearchField {

	@Input() closable = true;
	@Input() SearchVisible: boolean=false;
	@Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() searchKeyProvider: EventEmitter<boolean> = new EventEmitter<boolean>();

    searchKey:any='';
    
	close() {
   	 	this.SearchVisible = false;
  	  	this.visibleChange.emit(this.SearchVisible);
    }
	getSearchKey() {
   	 	this.SearchVisible = false;
  	  	this.searchKeyProvider.emit(this.searchKey);
    }
  
}

