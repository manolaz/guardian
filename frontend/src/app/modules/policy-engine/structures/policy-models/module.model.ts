import { PolicyModel } from './policy.model';
import { IModuleVariables } from './variables/module-variables.interface';
import { IModuleConfig } from './interfaces/module-config.interface';
import { PolicyBlockModel } from './block.model';
import { PolicyEventModel } from './block-event.model';
import { ModuleEventModel } from './module-event.model';
import { ModuleVariableModel } from './module-variable.model';
import { GroupVariables } from './variables/group-variables';
import { RoleVariables } from './variables/role-variables';
import { SchemaVariables } from './variables/schema-variables';
import { TokenTemplateVariables } from './variables/token-template-variables';
import { TokenVariables } from './variables/token-variables';
import { TopicVariables } from './variables/topic-variables';
import { TemplateModel } from './template.model';
import { IBlockConfig } from './interfaces/block-config.interface';
import { IEventConfig } from './interfaces/event-config.interface';
import { Schema } from '@guardian/interfaces';

export class PolicyModuleModel extends PolicyBlockModel {
    protected _dataSource!: PolicyBlockModel[];
    protected _tagMap: { [tag: string]: PolicyBlockModel; } = {};
    protected _idMap: { [tag: string]: PolicyBlockModel; } = {};
    protected _allBlocks!: PolicyBlockModel[];
    protected _allEvents!: PolicyEventModel[];
    protected _inputEvents!: ModuleEventModel[];
    protected _outputEvents!: ModuleEventModel[];
    protected _variables!: ModuleVariableModel[];
    protected _innerEvents!: PolicyEventModel[];
    protected _lastVariables!: IModuleVariables;
    private _schemas: Schema[];

    protected _name!: string;
    protected _description!: string;

    public get innerEvents(): PolicyEventModel[] {
        return this._innerEvents;
    }

    public get allEvents(): PolicyEventModel[] {
        return this._allEvents;
    }

    public get allBlocks(): PolicyBlockModel[] {
        return this._allBlocks;
    }

    public get root(): PolicyBlockModel {
        return this;
    }

    constructor(config: IModuleConfig, parent: PolicyBlockModel | null) {
        super(config, parent);
    }

    public init(config: IModuleConfig, parent: PolicyBlockModel | null) {
        super.init(config, parent);
        this._name = config.name || '';
        this._description = config.description || '';

        this._inputEvents = [];
        if (config.inputEvents && Array.isArray(config.inputEvents)) {
            for (const event of config.inputEvents) {
                this._inputEvents.push(new ModuleEventModel(event, this));
            }
        }

        this._outputEvents = [];
        if (config.outputEvents && Array.isArray(config.outputEvents)) {
            for (const event of config.outputEvents) {
                this._outputEvents.push(new ModuleEventModel(event, this));
            }
        }

        this._variables = [];
        if (config.variables && Array.isArray(config.variables)) {
            for (const variable of config.variables) {
                this._variables.push(new ModuleVariableModel(variable, this));
            }
        }

        this._innerEvents = [];
        if (Array.isArray(config.innerEvents)) {
            for (const event of config.innerEvents) {
                const item = new PolicyEventModel(event, this);
                this._innerEvents.push(item);
            }
        }
    }

    public get dataSource(): PolicyBlockModel[] {
        return this._dataSource;
    }

    public override setModule(module: PolicyModel | PolicyModuleModel | TemplateModel | undefined): void {
        if (module !== this) {
            this._module = module;
        } else {
            console.error('Invalid module');
        }
    }

    private registeredBlock(block: PolicyBlockModel | PolicyModuleModel) {
        if (block === this) {
            this._allBlocks.push(block);
            for (const event of this.innerEvents) {
                this._allEvents.push(event);
            }
            for (const child of block.children) {
                this.registeredBlock(child);
            }
        } else if (block instanceof PolicyModuleModel && block.isModule) {
            this._allBlocks.push(block);
            for (const event of block.events) {
                this._allEvents.push(event);
            }
        } else {
            this._allBlocks.push(block);
            for (const event of block.events) {
                this._allEvents.push(event);
            }
            for (const child of block.children) {
                this.registeredBlock(child);
            }
        }
    }

    public get isModule(): boolean {
        return true;
    }

    public get expandable(): boolean {
        return false;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this.setNameSilently(value);
        this._changed = true;
    }

    public setNameSilently(value: string) {
        this._name = value;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this.setDescriptionSilently(value);
        this._changed = true;
    }

    public setDescriptionSilently(value: string) {
        this._description = value;
    }

    public get inputEvents(): ModuleEventModel[] {
        return this._inputEvents;
    }

    public get outputEvents(): ModuleEventModel[] {
        return this._outputEvents;
    }

    public get variables(): ModuleVariableModel[] {
        return this._variables;
    }

    public get tagPrefix(): string {
        return this.tag + ':';
    }

    public removeEvent(event: any) {
        this._allEvents = this._allEvents.filter(e => e.id !== event?.id);
        this._innerEvents = this._innerEvents.filter(e => e.id !== event?.id);
        this._events = this._events.filter(e => e.id !== event?.id);
        event?.remove();
    }

    public removeBlock(block: any) {
        const item = this._idMap[block.id];
        if (item) {
            item.remove();
        }
    }

    public getBlock(block: any): PolicyBlockModel | undefined {
        return this._idMap[block?.id];
    }

    public getNewTag(type: string): string {
        let name = type;
        for (let i = 1; i < 1000; i++) {
            name = `${type}_${i}`;
            if (!this._tagMap[name]) {
                return name;
            }
        }
        return `${type}`;
    }

    public createInputEvent() {
        const e = new ModuleEventModel({
            name: '',
            description: ''
        }, this);
        this.addInputEvent(e);
    }

    public addInputEvent(event: ModuleEventModel) {
        this._changed = true;
        this._inputEvents.push(event);
        this.emitUpdate();
    }

    public removeInputEvent(event: ModuleEventModel) {
        this._changed = true;
        const index = this._inputEvents.findIndex((c) => c.id == event.id);
        if (index !== -1) {
            this._inputEvents.splice(index, 1);
            this.emitUpdate();
        }
    }

    public createOutputEvent() {
        const e = new ModuleEventModel({
            name: '',
            description: ''
        }, this);
        this.addOutputEvent(e);
    }

    public addOutputEvent(event: ModuleEventModel) {
        this._changed = true;
        this._outputEvents.push(event);
        this.emitUpdate();
    }

    public removeOutputEvent(event: ModuleEventModel) {
        this._changed = true;
        const index = this._outputEvents.findIndex((c) => c.id == event.id);
        if (index !== -1) {
            this._outputEvents.splice(index, 1);
            this.emitUpdate();
        }
    }

    public createVariable(type?: string, name?: string): void {
        const e = new ModuleVariableModel({
            name: name || '',
            description: '',
            type: type || 'String',
        }, this);
        this.addVariable(e);
    }

    public addVariable(variable: ModuleVariableModel) {
        this._changed = true;
        this._variables.push(variable);
        this.emitUpdate();
    }

    public removeVariable(variable: ModuleVariableModel) {
        this._changed = true;
        const index = this._variables.findIndex((c) => c.id == variable.id);
        if (index !== -1) {
            this._variables.splice(index, 1);
            this.emitUpdate();
        }
    }

    public override getJSON(): any {
        const json: any = {
            name: this._name,
            description: this._description,
            ...this.properties
        };
        delete json.children;
        delete json.events;
        delete json.artifacts;
        delete json.variables;
        delete json.inputEvents;
        delete json.outputEvents;
        delete json.innerEvents;
        json.id = this.id;
        json.blockType = this.blockType;
        json.tag = this.tag;
        json.children = [];
        json.events = [];
        json.artifacts = this.artifacts || [];
        json.variables = [];
        json.inputEvents = [];
        json.outputEvents = [];
        json.innerEvents = [];

        for (const variable of this.variables) {
            json.variables.push(variable.getJSON());
        }
        for (const event of this.inputEvents) {
            json.inputEvents.push(event.getJSON());
        }
        for (const event of this.outputEvents) {
            json.outputEvents.push(event.getJSON());
        }

        if (this._module) {
            for (const event of this._module.allEvents) {
                if (event.isSource(this)) {
                    json.events.push(event.getJSON());
                }
            }
        }

        for (const event of this.allEvents) {
            if (event.isSource(this)) {
                json.innerEvents.push(event.getJSON());
            }
        }

        for (const block of this.children) {
            json.children.push(block.getJSON());
        }
        return json;
    }

    public setSchemas(schemas: Schema[]): void {
        this._schemas = schemas;
        this.updateVariables();
    }

    public get blockVariables(): IModuleVariables | null {
        return this._lastVariables;
    }

    public get moduleVariables(): IModuleVariables | null {
        if (this._module) {
            return this._module.blockVariables;
        }
        return null;
    }

    public getSchemas(): Schema[] {
        return this._schemas;
    }

    private updateVariables(): void {
        this._lastVariables = {
            module: this,
            schemas: [
                new SchemaVariables(),
            ],
            tokens: [
                new TokenVariables(),
            ],
            roles: [
                new RoleVariables('Owner', 'OWNER'),
                new RoleVariables('No Role', 'NO_ROLE'),
                new RoleVariables('Any Role', 'ANY_ROLE')
            ],
            groups: [
                new GroupVariables(),
            ],
            tokenTemplates: [
                new TokenTemplateVariables(),
            ],
            topics: [
                new TopicVariables(),
            ]
        }
        if (this._variables) {
            for (const variable of this._variables) {
                switch (variable.type) {
                    case 'Schema':
                        let baseSchema: Schema | undefined;
                        if (typeof variable?.baseSchema === 'string') {
                            baseSchema = this._schemas?.find(s => s.iri === variable.baseSchema);
                        } else if (typeof variable?.baseSchema === 'object') {
                            baseSchema = new Schema(variable.baseSchema);
                        }
                        this._lastVariables.schemas.push(new SchemaVariables(variable, undefined, baseSchema));
                        break;
                    case 'Token':
                        this._lastVariables.tokens.push(new TokenVariables(variable));
                        break;
                    case 'Role':
                        this._lastVariables.roles.push(new RoleVariables(variable));
                        break;
                    case 'Group':
                        this._lastVariables.groups.push(new GroupVariables(variable));
                        break;
                    case 'TokenTemplate':
                        this._lastVariables.tokenTemplates.push(new TokenTemplateVariables(variable));
                        break;
                    case 'Topic':
                        this._lastVariables.topics.push(new TopicVariables(variable));
                        break;
                }
            }
        }
    }

    public override emitUpdate() {
        this.updateVariables();
        this._changed = false;
        if (this._module) {
            this._module.emitUpdate();
        }
    }

    public createTopic(topic: any): string {
        const topics = this._variables.filter(e => e.type === 'Topic');
        const name = `New Topic ${topics.length}`;
        this.createVariable('Topic', name);
        return name;
    }

    public getRootModule(): PolicyModel | PolicyModuleModel {
        return this;
    }

    public override createChild(block: IBlockConfig, index?: number) {
        block.tag = this.getNewTag('Block');
        const newBlock = this._createChild(block, this, index);
        this.refresh();
        return newBlock;
    }

    public override pasteChild(block: IBlockConfig) {
        this._pasteChild(block, this);
        this.refresh();
    }

    public refreshData() {
        this._tagMap = {};
        this._idMap = {};
        this._allBlocks = [];
        this._allEvents = [];
        this.registeredBlock(this);
        for (const block of this._allBlocks) {
            this._tagMap[block.tag] = block;
            this._idMap[block.id] = block;
        }
        for (const event of this._allEvents) {
            if (event.sourceTag) {
                event.source = this._tagMap[event.sourceTag];
            }
            if (event.targetTag) {
                event.target = this._tagMap[event.targetTag];
            }
        }
        this._dataSource = [this];
        this.updateVariables();
    }

    public override refresh(): void {
        if (this._module) {
            this._module.refresh();
        } else {
            this.refreshData();
        }
    }

    public createInnerEvent(event: IEventConfig) {
        const e = new PolicyEventModel(event, this);
        this._addInnerEvent(e);
        this.refresh();
    }

    public addInnerEvent(event: PolicyEventModel) {
        this._addInnerEvent(event);
        this.refresh();
    }

    private _addInnerEvent(event: PolicyEventModel) {
        this._innerEvents.push(event);
    }

    public removeInnerEvent(event: PolicyEventModel) {
        const index = this._innerEvents.findIndex((c) => c.id == event.id);
        if (index !== -1) {
            this._innerEvents.splice(index, 1);
            this.refresh();
        }
    }

    public getActiveEvents(): PolicyEventModel[] {
        const events = super.getActiveEvents();
        for (const event of this.innerEvents) {
            if (!event.disabled) {
                events.push(event);
            }
        }
        return events;
    }

    public getPermissionsNumber(permission: string): number {
        if (this._variables) {
            let index = -1;
            for (const variable of this._variables) {
                if (variable.type === 'Role') {
                    index++;
                    if (variable.name === permission) {
                        return index;
                    }
                }
            }
        }
        return -1;
    }

    public getPermissionsName(permission: any): any {
        if (permission === 'OWNER') {
            return 'Owner';
        } else if (permission === 'NO_ROLE') {
            return 'No Role';
        } else if (permission === 'ANY_ROLE') {
            return 'Any Role';
        } else {
            if (this._variables) {
                let index = -1;
                for (const variable of this._variables) {
                    if (variable.type === 'Role') {
                        index++;
                        if (index == permission) {
                            return variable.name;
                        }
                    }
                }
            }
            return null;
        }
    }

    public rebuild(object?: any) {
        this.init(object, this.parent);
        if (object.children) {
            for (const child of object.children) {
                this.children.push(this._buildBlock(child, this, this));
            }
        }
        this.refreshData();
        this.emitUpdate();
    }

    private _buildBlock(
        config: IBlockConfig,
        parent: PolicyModuleModel | PolicyBlockModel | null,
        module: PolicyModuleModel | PolicyModel
    ) {
        let block: PolicyModuleModel | PolicyBlockModel;
        if (config.blockType === 'module') {
            block = new PolicyModuleModel(config, parent);
            block.setModule(module);
            module = block as PolicyModuleModel;
        } else {
            block = new PolicyBlockModel(config, parent);
            block.setModule(module);
        }
        if (Array.isArray(config.children)) {
            for (const childConfig of config.children) {
                const child = this._buildBlock(childConfig, block, module);
                block.children.push(child);
            }
        }
        return block;
    }
}
