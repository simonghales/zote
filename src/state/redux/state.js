// @flow
import type { ReduxState } from './store';
import store from './store';
import { getModuleFromState, getModulesFromState } from './editor/state';
import { doesModuleChildrenContainModule } from '../../data/modules/state';

export function reduxDoesModuleChildrenContainModule(
  moduleKeyToCheck: string,
  moduleKey: string
): boolean {
  const state: ReduxState = store.getState();
  const { editor } = state;
  const module = getModuleFromState(editor, moduleKey);
  const modules = getModulesFromState(editor);
  return doesModuleChildrenContainModule(moduleKeyToCheck, module, modules);
}
