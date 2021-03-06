// @flow

import type {
  AddableBlockGroups,
  AddBlockGroupModel,
  AddBlockModel,
  BlockGroupModel,
  BlockModel,
  BlockModelPropsConfig,
  BlockPropsConfigModel,
} from './models';
import { addableBlocks, getBlock, getBlockGroup } from './blocks';
import type { DataModule } from '../data/modules/models';
import type { DataBlockModel } from '../data/blocks/models';
import { getBlockUniqueId } from './utils';
import { blockGroups, blockTypes } from './config';
import Page from './groups/module/Page/Page';
import Module from './groups/module/Module/Module';
import ModuleImport from './groups/module/ModuleImport/ModuleImport';
import { EMPTY_BLOCK_STYLES } from '../data/styles/defaults';
import { blockPropsDisplaySections } from './props';

function mapBlockToAddableBlock(block: BlockModel): AddBlockModel {
  return {
    key: block.key,
    label: block.key,
    icon: '', // todo
    isModule: false,
  };
}

function mapBlockGroupToAddableBlockGroup(blockGroup: BlockGroupModel): AddBlockGroupModel {
  const mappedBlocks = {};
  Object.keys(blockGroup.blocks).forEach(blockKey => {
    mappedBlocks[blockKey] = mapBlockToAddableBlock(blockGroup.blocks[blockKey]);
  });
  return {
    key: blockGroup.key,
    label: blockGroup.key,
    blocks: mappedBlocks,
  };
}

function mapModuleToAddableBlock(module: DataModule): AddBlockModel {
  return {
    key: module.key,
    label: module.name,
    icon: '',
    isModule: true,
  };
}

function mapModulesToAddableBlockGroup(
  groupKey: string,
  label: string,
  modules: Array<DataModule>
): AddBlockGroupModel {
  const mappedBlocks = {};
  modules.forEach(module => {
    mappedBlocks[module.key] = mapModuleToAddableBlock(module);
  });
  return {
    key: groupKey,
    label,
    blocks: mappedBlocks,
  };
}

function mapAllModulesToAddableBlockGroups(modules: Array<DataModule>): AddableBlockGroups {
  const moduleGroups: {
    [string]: Array<DataModule>,
  } = {};
  modules.forEach(module => {
    if (moduleGroups[module.groupKey]) {
      moduleGroups[module.groupKey] = moduleGroups[module.groupKey].concat([module]);
    } else {
      moduleGroups[module.groupKey] = [module];
    }
  });
  const mappedModuleGroups = {};
  Object.keys(moduleGroups).forEach(groupKey => {
    mappedModuleGroups[groupKey] = mapModulesToAddableBlockGroup(
      groupKey,
      groupKey,
      moduleGroups[groupKey]
    );
  });
  return mappedModuleGroups;
}

export function getAddableBlockGroups(modules: Array<DataModule>): AddableBlockGroups {
  const addableBlockGroups = {};
  Object.keys(addableBlocks).forEach(groupKey => {
    addableBlockGroups[groupKey] = mapBlockGroupToAddableBlockGroup(addableBlocks[groupKey]);
  });
  const addableModulesBlockGroups = mapAllModulesToAddableBlockGroups(modules);
  return {
    ...addableModulesBlockGroups,
    ...addableBlockGroups,
  };
}

export function getBlockDefaultDataBlock(groupKey: string, blockKey: string): DataBlockModel {
  const group = getBlockGroup(groupKey);
  if (!group) {
    throw new Error(`Group ${groupKey} could not be matched.`);
  }
  const block = getBlock(group, blockKey);
  if (!block) {
    throw new Error(`Block ${blockKey} could not be matched.`);
  }
  const { dataBlock } = block;
  return dataBlock({});
}

export function getBlockFromModule(module: DataModule): DataBlockModel {
  return {
    key: getBlockUniqueId(),
    groupKey: blockGroups.Module,
    blockKey: ModuleImport.key,
    blockType: blockTypes.module,
    label: module.name,
    props: {
      children: null,
    },
    propsConfig: {},
    blockChildrenKeys: [],
    moduleKey: module.key,
    isParentModule: false,
    rawStyles: {
      ...EMPTY_BLOCK_STYLES,
    },
  };
}

export function isBlockPropDisplayedUnderHtml(
  propKey: string,
  propsConfig: BlockPropsConfigModel
): boolean {
  const propConfig: BlockModelPropsConfig = propsConfig[propKey];
  return propConfig.displaySection && propConfig.displaySection === blockPropsDisplaySections.html;
}

export function isBlockPropHidden(propKey: string, propsConfig: BlockPropsConfigModel): boolean {
  const propConfig: BlockModelPropsConfig = propsConfig[propKey];
  return !!propConfig.hidden;
}

export function getBlockHtmlPropsKeys(block: BlockModel): Array<string> {
  const { propsConfig = {} } = block;
  return Object.keys(propsConfig)
    .filter(propKey => isBlockPropDisplayedUnderHtml(propKey, propsConfig))
    .filter(propKey => !isBlockPropHidden(propKey, propsConfig));
}

export function getBlockContentPropsKeys(block: BlockModel): Array<string> {
  const { propsConfig = {} } = block;
  return Object.keys(propsConfig)
    .filter(propKey => !isBlockPropDisplayedUnderHtml(propKey, propsConfig))
    .filter(propKey => !isBlockPropHidden(propKey, propsConfig));
}

export function isBlockModuleBlock(block: BlockModel): boolean {
  return (
    block.groupKey === blockGroups.Module && (block.key === Module.key || block.key === Page.key)
  );
}

export function isBlockModuleImportBlock(block: BlockModel): boolean {
  return block.groupKey === blockGroups.Module && block.key === ModuleImport.key;
}
