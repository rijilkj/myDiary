import { Component, NgZone, trigger, state, style, animate, transition } from '@angular/core';
import { NoteService } from '../services';
 import { AuthService } from '../services';

@Component({
	
	selector: 'notes-container',
  	templateUrl: 'app/containers/notes/template.html',
  	styleUrls: ['app/containers/notes/styles.css','app/ui/noteCreator/styles.css'],
  	animations: [
    trigger('loadingNotationDiv', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]

})

export class NotesContainer{

    delete:boolean= false;
    col_xs:string = "col-xs-6";
    screenWidth:number=1366;
    token: string= '';
    userName: string= '';
    notes=[];
    showDialog:boolean = false;
    showSearch:boolean = false;
    indexOfNotesArray:number=null;
    notePagination:number =1;
    isLoadingContent:boolean= false;
    searchKey:any ='';

    updateNote={
    	_id   : '',
		title: '',
		value: '',
		color: 'white' ,
		token:''
		 
	};
	colors: string[] = ['#8DA44C', '#7ED8D4', '#D7A1E5', '#ED8FBA','#9398A9','#ffffff','#DAF7A6', '#f5fc7b'];  

	constructor(private noteService: NoteService,private ngZone: NgZone,private auth: AuthService){
		
	this.token= window.localStorage.getItem(this.auth.JWT_KEY);
    this.userName= window.localStorage.getItem(this.auth.USER);
	window.onresize = (e) =>
    {
        ngZone.run(() => {
            this.screenWidth = window.innerWidth;
             
        });
        if (this.screenWidth>640){
        	this.col_xs  = "col-xs-6";	
        }else{
        	this.col_xs  = "col-xs-12";	
        }
    };
	this.noteService.getNotes(this.token,0)
	.subscribe(resp => this.notes= resp.notes);

	 }

	onNoteChecked(note) {
	    note.token=this.token;
     	this.noteService.completeNote(note)
		 .subscribe(note => {
 
	 		const i = this.notes.findIndex(localNote => localNote._id === note._id);
	 		
	 		this.notes.splice(i,1);
	 		this.delete=true;
	 		setTimeout(() => { this.delete= !this.delete; }, 3000);
	 		})
	}

	onDialogBoxChecked(showDialog) {
		this.showDialog=showDialog.showNoteDialogStatus;
		this.indexOfNotesArray = this.notes.findIndex((item) => item._id === showDialog.note_id);
		if (typeof this.indexOfNotesArray != null) {
			this.updateNote= this.notes[this.indexOfNotesArray];
		}
		 
	}

	onCreateNote (note)
	{
		note.token=this.token;
		this.noteService.createNote(note)
		 .subscribe(note => this.notes.unshift(note));
	}

	onUpdateNote () {

		this.updateNote.token=this.token;
		this.noteService.updateNote(this.updateNote)
		 .subscribe(note => this.onUpdateNoteCallback());
    }

    onUpdateNoteCallback(){
    	this.notes[this.indexOfNotesArray]=this.updateNote;
    	this.showDialog=!this.showDialog;
    }

    onColorSelect(color: string){
		this.updateNote.color= color;
	}

	onScroll () {
		 this.isLoadingContent= true;

		 if(this.showSearch){
		 	this.noteService.getFilteredNotes(this.token, this.notePagination, this.searchKey)
			.subscribe(resp => this.mergeNoteArray(this.notes,resp.notes));
		 }else{
		 	this.noteService.getNotes(this.token, this.notePagination)
	    	.subscribe(resp => this.mergeNoteArray(this.notes,resp.notes));
         }
    }

    mergeNoteArray(noteArray,newList) {
		    var arr3 = [];
			for(var i in noteArray){
		  		  var shared = false;
		   		  for (var j in newList)
		          if (newList[j]._id == noteArray[i]._id) {
		           shared = true;
		           break;
		       }
		       if(!shared) 
		       	  arr3.push(noteArray[i])
		   }

		   arr3 = arr3.concat(newList);
		   this.notes=arr3;
		   this.notePagination++;
		   this.isLoadingContent= false;
    }	
     /* method to display search box **/
     showSearchBox()  {
     	this.notes=[];
     	this.notePagination  =1;
		this.showSearch=true;  
     }

     showSearchMode(status)  {
		this.showSearch=status;  
		this.noteService.getNotes(this.token,0)
			.subscribe(resp => this.notes= resp.notes);
    }

     setSearchKey(searchKey) {
     	this.notes=[];
     	this.notePagination =1;
     	this.searchKey=searchKey;
		this.noteService.getFilteredNotes(this.token, 0, this.searchKey)
			.subscribe(resp => this.notes= resp.notes);

	 }
 
};