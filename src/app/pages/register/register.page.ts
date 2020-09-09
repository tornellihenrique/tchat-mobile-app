import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(15)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    const phone = this.getPhoneNumber(this.registerForm.get('phone').value || '');
    this.authService.register({ ...this.registerForm.value, phone }).subscribe();
  }

  private getPhoneNumber(phone: string) {
    return phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
  }
}
