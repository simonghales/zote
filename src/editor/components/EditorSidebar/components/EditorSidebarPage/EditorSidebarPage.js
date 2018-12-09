// @flow
import React, { Component } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './styles';
import IconButton from '../../../../../components/IconButton/IconButton';
import PagePreview from './components/PagePreview/PagePreview';
import type { ReduxState } from '../../../../../state/redux/store';
import {
  getPagesSelector,
  getSelectedPageKeySelector,
} from '../../../../../state/redux/editor/selector';
import type { PageDataModel, PagesDataModel } from '../../../../../data/pages/models';
import type { EditorRoutingMatch } from '../../../../routing';
import { goToPage } from '../../../../routing';
import { getNameSlug } from '../../../../../utils/slugs';
import { setPageEditorMode } from '../../../../../state/redux/ui/reducer';
import { pageEditorModes } from '../../../../views/EditorPageView/EditorPageView';

type Props = {
  selectedPageKey: string,
  pages: PagesDataModel,
  history: {},
  match: EditorRoutingMatch,
  switchToEditMode: () => void,
};

class EditorSidebarPage extends Component<Props> {
  navigateToPage = (page: PageDataModel) => {
    const { match, history } = this.props;
    const pageNameSlug = getNameSlug(page.name);
    goToPage(pageNameSlug, match, history);
  };

  switchToEditMode = () => {
    const { switchToEditMode } = this.props;
    switchToEditMode();
  };

  render() {
    const { pages, selectedPageKey } = this.props;
    return (
      <div>
        <div className={styles.addPageSectionClass}>
          <div className={styles.addPageSectionTextClass} />
          <IconButton icon={<MdAdd size={18} />} onClick={() => {}} tooltip="Create a new page" />
        </div>
        <div>
          {Object.keys(pages).map(pageKey => (
            <PagePreview
              page={pages[pageKey]}
              key={pageKey}
              select={() => {
                this.navigateToPage(pages[pageKey]);
              }}
              onEdit={this.switchToEditMode}
              selected={pageKey === selectedPageKey}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  pages: getPagesSelector(state),
  selectedPageKey: getSelectedPageKeySelector(state),
});

const mapDispatchToProps = {
  switchToEditMode: () => setPageEditorMode(pageEditorModes.edit),
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorSidebarPage)
);
