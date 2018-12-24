// @flow
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import EditorStylesMixins from '../../../EditorStylesView/components/EditorStylesMixins/EditorStylesMixins';
import type { ReduxState } from '../../../../../../../state/redux/store';
import { getSelectedModuleSelectedBlockMappedMixins } from '../../../../../../../state/redux/editor/state';
import { getCurrentModuleKey } from '../../../../../../../state/redux/editor/selector';
import {
  removeBlockStylesMixin,
  updateBlockStylesMixinsOrder,
} from '../../../../../../../state/redux/editor/reducer';
import EditorComponentStylesAddMixinsDropdown from '../EditorComponentStylesAddMixinsDropdown/EditorComponentStylesAddMixinsDropdown';

const EditorComponentStylesMixins = (props: {}) => (
  <EditorStylesMixins
    {...props}
    createMixinEnabled
    AddMixinsDropdown={EditorComponentStylesAddMixinsDropdown}
  />
);

const mapStateToProps = (state: ReduxState) => ({
  mixins: getSelectedModuleSelectedBlockMappedMixins(state),
  moduleKey: getCurrentModuleKey(state),
});

const mapDispatchToProps = {
  dispatchUpdateMixinsOrder: (blockKey: string, mixinKeys: Array<string>, moduleKey: string) =>
    updateBlockStylesMixinsOrder(blockKey, mixinKeys, moduleKey),
  dispatchRemoveMixin: (blockKey: string, mixinKey: string, moduleKey: string) =>
    removeBlockStylesMixin(blockKey, mixinKey, moduleKey),
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  updateMixinsOrder: (mixinKeys: Array<string>) =>
    dispatchProps.dispatchUpdateMixinsOrder(ownProps.blockKey, mixinKeys, stateProps.moduleKey),
  removeMixin: (mixinKey: string) =>
    dispatchProps.dispatchRemoveMixin(ownProps.blockKey, mixinKey, stateProps.moduleKey),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EditorComponentStylesMixins);
