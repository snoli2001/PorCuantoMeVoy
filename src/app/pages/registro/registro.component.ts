import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

import {AuthService} from "../../services/auth.service";
import {UserModel} from "../models/user.model";

import Swal from "sweetalert2";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  user: UserModel;
  remindMe = false;
  constructor(private  auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit(form : NgForm){
    if(form.invalid) {return};

    Swal.fire({
      // title: 'Error!',
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info',
      confirmButtonText: 'ok',
    });
    Swal.showLoading();

    this.auth.newUser(this.user).subscribe(response => {

      console.log(response);
      Swal.close();
      this.router.navigateByUrl('/home');

      if(this.remindMe){
        localStorage.setItem('email',this.user.email);
      }

      },(err) => {

      console.log(err.error.error.message);

      Swal.fire({
        title: 'Error al autenticar',
        text: err.error.error.message,
        icon: 'error',
        confirmButtonText: 'ok',
      });
      }
    );

  }

}
