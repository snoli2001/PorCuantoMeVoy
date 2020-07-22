import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CourseModel} from "../pages/models/course.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private url= 'https://login-app-73113.firebaseio.com'

  constructor(private http: HttpClient) { }

  createCourse( id: string, course: CourseModel ){
    return this.http.post(`${this.url}/${id}/courses.json`,course)
      .pipe( map( (resp: any) =>{
      course.id = resp.name;
      return course;
    }));
  }
  updateCourse( iduser:string, course : CourseModel){
    const courseTemp = {
      ... course
    };
    delete courseTemp.id;

    return this.http.put(`${this.url}/${iduser}/courses/${course.id}.json`, courseTemp);
  }

  getCourses( id: string ){
    return this.http.get(`${this.url}/${id}/courses.json`)
      .pipe(
        map( resp => this.createArray(resp))
      );
  }
  getCourse(idUser: string, idCourse: string ){
    return this.http.get(`${this.url}/${idUser}/courses/${idCourse}.json`)
  }

  deleteCourse(idUser: string, idCourse: string ){
    return this.http.delete(`${this.url}/${idUser}/courses/${idCourse}.json`);
  }

  createArray( courseObj: Object ){

    const courses: CourseModel[] = [];

    if( courseObj == null){ return []; };
    Object.keys(courseObj).forEach( key => {
      const course: CourseModel = courseObj[key];
      course.id = key;
      courses.push(course);
    });
    return courses;
  }

}
