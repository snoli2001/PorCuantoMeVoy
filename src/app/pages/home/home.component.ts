import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseModel} from "../models/course.model";
import {CoursesService} from "../../services/courses.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses: CourseModel[] = [];
  loading = false;
  id: string;
  constructor(private auth: AuthService, private  router: Router
              , private coursesService: CoursesService,private activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

  this.loading = true;
  this.coursesService.getCourses(this.id)
    .subscribe( ( resp: CourseModel[] ) => {
    this.courses = resp;
    this.loading = false;
  });

  }

  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
  deleteCourse( course: CourseModel, i:number ){
    Swal.fire({
      title: '¿Está Seguro?',
      text: `Está seguro que desea borrar a ${course.name}`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if( resp.value ) {
        this.courses.splice(i, 1);
        this.coursesService.deleteCourse( this.id,course.id).subscribe();
      }
    });
  }
}
