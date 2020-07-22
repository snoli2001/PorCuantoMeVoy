import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CourseModel} from "../models/course.model";
import {element} from "protractor";
import Swal from "sweetalert2";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CoursesService} from "../../services/courses.service";

@Component({
  selector: 'app-nuevo-curso',
  templateUrl: './nuevo-curso.component.html',
  styleUrls: ['./nuevo-curso.component.css']
})
export class NuevoCursoComponent implements OnInit {

  form: FormGroup;
  course = new CourseModel();
  idUser: string;
  idCourse: string;
  loading = true;

  constructor( private fb: FormBuilder
               ,private route : ActivatedRoute,private coursesService : CoursesService) {

    this.createForm();

    this.idUser = this.route.snapshot.paramMap.get('iduser');
     this.idCourse = this.route.snapshot.paramMap.get('idcourse');
      // console.log(this.idUser);
    if(this.idCourse != 'nuevo' ){
      this.coursesService.getCourse( this.idUser,this.idCourse)
        .subscribe( (resp : CourseModel) =>{

          if( resp.grades != undefined){
            for( let i=1; i<= (resp.grades.length-1);i++){
              this.addGrade();
            }
            this.loading = false;
          }


          this.course = resp;
          this.course.id = this.idCourse;

          this.form.reset(this.course);
          this.grades.reset(this.course.grades);


        });
    }
    else{
      this.loading = false;
    }
  }

  ngOnInit(): void {


  }
  // Getters
  get grades(){
    return this.form.get('grades') as FormArray;
  }
  get currentPercentage(){
    return this.form.get('currentPercentage').value;
  }
  get goal(){

    return this.form.get('goal').value;
  }
  get mission(){
    return this.form.get('mission').value
  }


  get average(){
    let av = 0;
    let cP = 0;
    if(this.grades.controls.length > 0) {
      this.grades.controls.forEach((element: any) => {
        if (Number(element.value.note) >= 0 && Number(element.value.weight) >= 0) {
          av += Number(element.value.note) * (Number(element.value.weight) / 100);
          cP +=   (Number(element.value.weight));

        }
      })
    }
    this.form.controls['average'].setValue(av);
    this.form.controls['currentPercentage'].setValue(cP);

    return av;
  }
  // validations

  get invalidName(){
    return this.form.get('name').invalid && this.form.get('name').touched;
  }
  get invalidGoal(){

    return this.form.get('goal').invalid && this.form.get('goal').touched;
  }
  get invalidCurrentPercentage(){
    return  this.form.get('currentPercentage').invalid;
  }


  //forms
  createForm(){

    this.form = this.fb.group( {
      id:[''],
      name: ['',[Validators.required, Validators.minLength(2)]],
      goal: ['',[Validators.required, Validators.min(0),Validators.max(20)]],
      grades: this.fb.array([this.createGrade()]),
      average: [''],
      currentPercentage: ['',Validators.max(100)],
      mission: [0]
    });
  }

  createGrade(): FormGroup {

      return this.fb.group({
      note: ['', [Validators.max(20), Validators.min(0)]],
      weight: ['', [Validators.max(100), Validators.min(0)]]
    });

  }



  addGrade(){
    this.form.controls['mission'].setValue(null);
    this.grades.push(this.createGrade());
  }

  deleteGrade(i:number){
    this.form.controls['mission'].setValue(null);
    this.grades.removeAt(i);
  }

  save(){

    if ( this.form.invalid ){

      return Object.values(this.form.controls).forEach( control => {

        if ( control instanceof FormGroup){
          Object.values(control.controls)
            .forEach( control => control.markAsTouched());
          return
        }else {
          control.markAsTouched();
          return
        }
      });
    }
    else{
      this.course = this.form.value;
      console.log(this.form.controls);
      Swal.fire({
        title: 'Espere',
        text: 'Guardando información',
        icon: 'info',
        allowOutsideClick: false
      })
      Swal.showLoading();
      let request: Observable<any>;
      if(this.course.id){
        request = this.coursesService.updateCourse(this.idUser, this.course);
        console.log('actualizando')
      } else {
        request = this.coursesService.createCourse(this.idUser,this.course);
        console.log('creando')

      }
      request.subscribe( resp => {
        Swal.fire({
          title: this.course.name,
          text: 'se actualizó correctamente',
          icon: 'success'
        });
      });
    }
  }
  calculate(){

    if(!this.form.invalid && this.currentPercentage <= 100)
    { this.form.controls['mission']
      .setValue(
        Number((this.goal - this.average) / ( 1 - (this.currentPercentage/100)))
      );
      let x = this.form.controls['mission'].value;
      if( x<=5 ) {
        Swal.fire({
          allowOutsideClick: false,
          // imageUrl: 'assets/images/LadeRonaldinho.jpeg',
          html: '<img src="assets/images/LadeRonaldinho.jpeg">',
          text: 'te vas por ' + this.form.controls['mission'].value.toFixed(2) + ' hiciste la de ronaldinho',
          // icon: 'info',
          confirmButtonText: 'ok',
        })
      } else if( x >5 && x <= 13 ) {
        Swal.fire({
          allowOutsideClick: false,
          // imageUrl: 'assets/images/cuto_laFe.jpg',
          html: '<img src="assets/images/cuto_laFe.jpg">',
          text: 'te vas por ' + this.form.controls['mission'].value.toFixed(2) + ' con fe',
          // icon: 'info',
          confirmButtonText: 'ok',
        })
      } else if(x >13 && x <= 20 ) {
        Swal.fire({
          allowOutsideClick: false,
          // imageUrl: 'assets/images/finHombreAraña.jpeg',
          html: '<img src="assets/images/finHombreArana.jpeg">',
          text: 'te vas por ' + this.form.controls['mission'].value.toFixed(2),
          // icon: 'info',
          confirmButtonText: 'ok',
        });
      } else if( x>20 ){
        Swal.fire({
          allowOutsideClick: false,
          // imageUrl: 'assets/images/fairPlay.jpeg',
          html: '<img src="assets/images/fairPlay.jpeg">',
          text: 'te vas por ' + this.form.controls['mission'].value.toFixed(2) + ' osea estas loco',
          // icon: 'info',
          confirmButtonText: 'ok',
        });
      }


    }
    else {
      this.form.controls['mission']
        .setValue(
          null
        );
    }


    if ( this.form.invalid ){
      this.grades.controls.forEach(grade => {

        grade.markAllAsTouched();

      });
      return Object.values(this.form.controls).forEach( control => {

        if ( control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAsTouched());
        }else {
          control.markAsTouched();

        }
      });
    }
    else{
      console.log(this.form.controls);
    }
  }

}
