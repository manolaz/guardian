import { BlockValidator, IBlockProp } from '@policy-engine/block-validators';

/**
 * Revoke document action with UI
 */
export class RevokeBlock {
    /**
     * Block type
     */
    public static readonly blockType: string = 'revokeBlock';

    /**
     * Validate block options
     * @param validator
     * @param config
     */
    public static async validate(validator: BlockValidator, ref: IBlockProp): Promise<void> {
        try {
            if (!ref.options.uiMetaData || (typeof ref.options.uiMetaData !== 'object')) {
                validator.addError('Option "uiMetaData" is not set');
                return;
            }

            if (ref.options.uiMetaData.updatePrevDoc && !ref.options.uiMetaData.prevDocStatus) {
                validator.addError('Option "Status Value" is not set');
            }
        } catch (error) {
            validator.addError(`Unhandled exception ${validator.getErrorMessage(error)}`);
        }
    }
}
