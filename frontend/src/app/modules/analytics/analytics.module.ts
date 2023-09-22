import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { CompareComponent } from './compare/compare.component';
import { ComparePolicyComponent } from './compare-policy/compare-policy.component';
import { CompareSchemaComponent } from './compare-schema/compare-schema.component';
import { CompareModuleComponent } from './compare-module/compare-module.component';
import { MultiComparePolicyComponent } from './multi-compare-policy/multi-compare-policy.component';
import { SearchPoliciesComponent } from './search-policies/search-policies.component';
import { SearchPolicyDialog } from './search-policy-dialog/search-policy-dialog.component';
import { TagEngineModule } from '../tag-engine/tag-engine.module';
import { CommonComponentsModule } from '../common/common-components.module';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
    declarations: [
        CompareComponent,
        CompareSchemaComponent,
        ComparePolicyComponent,
        CompareModuleComponent,
        MultiComparePolicyComponent,
        SearchPoliciesComponent,
        SearchPolicyDialog
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        CommonComponentsModule,
        TagEngineModule,
        AppRoutingModule
    ],
    exports: [
        CompareComponent,
        CompareSchemaComponent,
        ComparePolicyComponent,
        CompareModuleComponent,
        MultiComparePolicyComponent,
        SearchPoliciesComponent,
        SearchPolicyDialog
    ]
})
export class CompareModule { }
