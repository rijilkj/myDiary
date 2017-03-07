import {Injectable} from '@angular/core';
import {ApiService} from './api';
import {AuthService} from './auth';
import {URLSearchParams} from '@angular/http';
@Injectable()
export class NoteService {

        deleteParams= {_id:''};
        createPath: string ='/createNote';
        getPath: string ='/getNotes';
        filterPath: string ='/getFilteredNotes';
        updatePath: string ='/updateNote';
        deleteNote: string ='/deleteNote';
        token: string= '';
        constructor(private api: ApiService, private auth: AuthService){
            this.token= window.localStorage.getItem(this.auth.JWT_KEY);

        }

        createNote(note) {

          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('title', note.title);
          urlSearchParams.append('value', note.value);
          urlSearchParams.append('color', note.color);
          urlSearchParams.append('token', note.token);
          let params = urlSearchParams.toString();

          return this.api.post(this.createPath, params)
        }

        updateNote(note) {

          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('_id', note._id);
          urlSearchParams.append('title', note.title);
          urlSearchParams.append('value', note.value);
          urlSearchParams.append('color', note.color);
          urlSearchParams.append('token', note.token);
          let params = urlSearchParams.toString();

          return this.api.post(this.updatePath, params)
        }


        getNotes(token,paginationNo) {

         return this.api.get(`${this.getPath}?token=${token}&pagination=${paginationNo}`);
        }

        getFilteredNotes(token,paginationNo,searchKey) {

         return this.api.get(`${this.filterPath}?token=${token}&pagination=${paginationNo}&search_key=${searchKey}`);
        }

        completeNote(note) {

          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('_id', note._id);
          urlSearchParams.append('title', note.title);
          urlSearchParams.append('value', note.value);
          urlSearchParams.append('color', note.color);
          urlSearchParams.append('token', note.token);
          let params = urlSearchParams.toString();
          
           return this.api.post(`${this.deleteNote}`, params)
           .map((res: any) => res);
        }
}