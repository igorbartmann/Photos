import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginGuard } from "../core/auth/login.guard";
import { HomeComponent } from "./home.component";
import { SignInComponent } from "./signin/signin.component";
import { SignUpComponent } from "./signup/signup.component";

const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent, 
        canActivate: [LoginGuard],
        children: [
            { path: '', component: SignInComponent , data: { title: 'Sign in' } },
            { path: 'signup', component: SignUpComponent , data: { title: 'Sign up' } },     
        ]
    },
];

@NgModule({
    imports: [ 
        // Dessa forma o router module já sabe as rotas da aplicação 
        // (é melhor do que apenas 'RouterModule' vazio que não saberá as configs).
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule { }