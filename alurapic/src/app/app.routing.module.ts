import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PhotoFormComponent } from "./photos/photo-form/photo-form.component";
import { PhotoListComponent } from "./photos/photo-list/photo-list.component";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { PhotoListResolver } from "./photos/photo-list/photo-list.resolver";
import { AuthGuard } from "./core/auth/auth.guard";
import { PhotoDetailsComponent } from "./photos/photo-details/photo-details.component";
import { GlobalErrorComponent } from "./errors/global-error/global-error.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},
    { path: 'home', loadChildren: () => import('./home/home.module').then(x => x.HomeModule)}, 
    { path: 'photos/list', component: PhotoListComponent, canActivate: [AuthGuard], resolve: {photos: PhotoListResolver }, data: { title: 'Timeline' } },
    { path: 'photos/form', component: PhotoFormComponent, canActivate: [AuthGuard] , data: { title: 'Photo upload' } },
    { path: 'photos/details/:id', component: PhotoDetailsComponent, canActivate: [AuthGuard] , data: { title: 'photo details' } },
    { path: 'not-found', component: NotFoundComponent , data: { title: 'Not found' } },
    { path: 'error', component: GlobalErrorComponent , data: { title: 'Error' } },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [ 
        // Dessa forma o router module já sabe as rotas da aplicação 
        // (é melhor do que apenas 'RouterModule' vazio que não saberá as configs).
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }