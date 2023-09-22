import { BeforeCreate, Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../models';
import { ContractStatus } from '@guardian/interfaces';

/**
 * Contract collection
 */
@Entity()
export class Contract extends BaseEntity {
    /**
     * Hedera Contract Id
     */
    @Property({ nullable: true })
    contractId?: string;

    /**
     * Description
     */
    @Property({ nullable: true })
    description?: string;

    /**
     * Owner
     */
    @Property({ nullable: true })
    owner?: string;

    /**
     * Creator
     */
    @Property({ default: false })
    isOwnerCreator: boolean = false;

    /**
     * Contract status
     */
    @Property({ nullable: true })
    status?: ContractStatus;

    /**
     * Topic id
     */
    @Property({ nullable: true })
    topicId?: string;

    /**
     * Contract defaults
     */
    @BeforeCreate()
    setDefaults() {
        this.status = this.status || ContractStatus.WAIT;
    }
}
