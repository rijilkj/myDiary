import { Component ,
         Input,
         Output,
         EventEmitter,
         trigger, state, style, animate, transition
 } from '@angular/core';

@Component({
	
	selector: 'note-card',
	templateUrl: 'app/ui/noteCard/template.html',
  	styleUrls: ['app/ui/noteCard/styles.css'],
  	animations: [
    trigger('dialog', [
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

export class NoteCard{
	showNoteDialog:boolean=false;
	@Input() note ={};
	@Output() checked = new EventEmitter();
	@Output() showNoteDialogFire = new EventEmitter();
	showCheck: boolean = false;
	showEdit: boolean = false;
 	noteLimitCount:number =50;
 	noteLimitCountFixed:number =this.noteLimitCount;
 	expand_text:string= '';
 	expandStatus:boolean= false;

 	constructor( ) {
			this.expand_text='read more...';
         }

	toggleCheck() {

	   this.showCheck= !this.showCheck;
	   this.showEdit= !this.showEdit;
    }

    toggleExpantion() {

	   this.expandStatus= !this.expandStatus;
	   if (!this.expandStatus){
           this.expand_text='read more...';
           this.noteLimitCount=50;

	   }else{
	   	   this.expand_text='Contract';
	   	   this.noteLimitCount=1;
	   }
    }

	onChecked(event) {
	  event.stopPropagation();
	 //event.preventDefault()
	 this.checked.emit(this.note);
	}
	onClickNoteDialogBox(event) {
		this.showNoteDialog = true;
		event.stopPropagation();
		var target = event.target || event.srcElement || event.currentTarget;
		var idAttr = target.attributes.id;
    	var value = idAttr.nodeValue;
    	var Id = value.split("_");
	 	//this.showNoteDialog = !this.showNoteDialog;
	 	var params = {
                  	 	showNoteDialogStatus : this.showNoteDialog,
                   		note_id : Id[1]
	 	             };
	 	this.showNoteDialogFire.emit(params);
	}
};