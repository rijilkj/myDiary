import { 
	Component,
	Output,
   EventEmitter,
   OnChanges, 
    trigger, 
    state, 
    style, 
    animate, 
    transition
 } from '@angular/core';


@Component ({

  selector : 'note-creator',
  templateUrl: 'app/ui/noteCreator/template.html',
  styleUrls: ['app/ui/noteCreator/styles.css'],
  animations: [
    trigger('noteCreater', [
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


export class NoteCreator {

 
  
	@Output() createNote = new EventEmitter();

	colors: string[] = ['#8DA44C', '#7ED8D4', '#D7A1E5', '#ED8FBA','#9398A9','#ffffff','#DAF7A6', '#f5fc7b'];  
	 
	newNote={
		title: '',
		value: '',
		color: 'white' 
		 
	};
       
	fullForm: boolean = false;

	onCreateNote () {

		const {title, value, color } = this.newNote;
	
        if (title && value) {
		  	    this.createNote.emit({title, value, color });
		    }	

		this.reset();
		this.toggle(false);
	};

	reset () {

	  this.newNote={
		title:'',
		value:'',
		color:'white' 
	  };
    };

	onColorSelect(color: string){
		this.newNote.color= color;
	}

	toggle (value : boolean){
	   this.fullForm = value;
	}
	
}

