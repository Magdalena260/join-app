import { Component } from '@angular/core';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';
import { ProfileIcon } from '../../shared/components/profile-icon/profile-icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [LogoDark, ProfileIcon, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
