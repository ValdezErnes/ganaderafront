import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AltaComponent } from './alta/alta.component';
import { BajaComponent } from './baja/baja.component';
import { ReportesComponent } from './reportes/reportes.component';
import { VentaComponent } from './venta/venta.component';
import { MedicamentoComponent } from './medicamento/medicamento.component';
import { AlimentoComponent } from './alimento/alimento.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GanadoComponent } from './ganado/ganado.component';
import { RecuperarContraComponent } from './recuperar-contra/recuperar-contra.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
    {path:'login',
        component: LoginComponent,
    },
    {path : 'recuperarContra',
        component:RecuperarContraComponent
    },
    {path:'',
        component:DashboardComponent
    },{
        path:'alta',
        component:AltaComponent
    },{path : 'baja',
        component:BajaComponent
    },{path : 'reportes',
        component:ReportesComponent
    },{path : 'usuarios',
        component:UsuariosComponent
    },{path : 'alimento',
        component:AlimentoComponent
    },{path : 'medicamento',
        component:MedicamentoComponent
    },{path : 'venta',
        component:VentaComponent
    },{path : 'ganado',
        component:GanadoComponent
    },{path : 'perfil',
        component:PerfilComponent
    }
];
